import os
import json
import tempfile
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from utils.hanviet_utils import translator

# Load environment variables from the same directory as the script
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=dotenv_path, override=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini with the new SDK
if GEMINI_API_KEY and GEMINI_API_KEY != "your_key_here":
    client = genai.Client(api_key=GEMINI_API_KEY)
    MODEL_ID = "gemini-1.5-flash"
else:
    print("WARNING: GEMINI_API_KEY not set correctly in .env file.")
    client = None

app = Flask(__name__)
CORS(app)

# Dictionary data (Initial mock data)
DICTIONARY = {
    '可是': {'pinyin': 'kě shì', 'meaning': 'nhưng', 'explanation': '可是 dùng để chỉ sự đối lập.'},
    '死者': {'pinyin': 'sǐ zhě', 'meaning': 'người chết', 'explanation': '死者 chỉ những người đã qua đời.'},
}

def lookup_additional_info(word):
    """Adds HanViet and checks dictionary for a word"""
    info = DICTIONARY.get(word, {
        'meaning': 'Tra cứu tự động',
        'explanation': 'Được phân tích bởi AI'
    })
    
    if translator:
        info['hanViet'] = translator.to_hanviet(word)
    else:
        info['hanViet'] = ''
        
    return info

def analyze_video_with_gemini(video_path):
    """
    Sends video to Gemini to get transcription, timestamps, pinyin and meanings.
    Using the new Google GenAI SDK.
    """
    if not client:
        return {'error': 'Gemini Client not configured. Please check your API Key.'}

    try:
        print(f"Uploading file to Gemini: {video_path}")
        # Upload using the new SDK
        video_file = client.files.upload(path=video_path)
        
        # Wait for processing
        while video_file.state.name == "PROCESSING":
            print(".", end="", flush=True)
            time.sleep(2)
            video_file = client.files.get(name=video_file.name)
            
        if video_file.state.name == "FAILED":
            return {'error': 'Gemini processing failed.'}

        print("\nAnalyzing with Gemini...")
        
        prompt = """
        Analyze this video/audio. Provide a Vietnamese learning transcript.
        For each sentence, provide the original Traditional Chinese text, startTime and endTime.
        Crucially, break each sentence into words. For each word, provide:
        - text: the character(s)
        - pinyin: with tone marks
        - meaning: Vietnamese meaning
        
        Return ONLY a JSON object in this format:
        {
          "subtitles": [
            {
              "startTime": 0.0,
              "endTime": 2.5,
              "text": "原生句子",
              "words": [
                {"text": "原", "pinyin": "yuán", "meaning": "nguyên"},
                ...
              ]
            }
          ]
        }
        """

        response = client.models.generate_content(
            model=MODEL_ID,
            contents=[prompt, video_file]
        )
        
        # Clean up the file from Gemini cloud
        client.files.delete(name=video_file.name)

        print(f"DEBUG: Gemini raw response: {response.text}")
        
        # Extract JSON from response
        content = response.text
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        
        try:
            result = json.loads(content)
        except json.JSONDecodeError as je:
            print(f"JSON Error: Could not parse Gemini response. Raw: {content}")
            return {'error': f"AI returned invalid format: {str(je)}"}
        
        # Enrich with HanViet
        for sub in result.get('subtitles', []):
            for word_obj in sub.get('words', []):
                extra = lookup_additional_info(word_obj['text'])
                word_obj['hanViet'] = extra['hanViet']
                if word_obj['text'] in DICTIONARY:
                    word_obj['meaning'] = DICTIONARY[word_obj['text']]['meaning']

        return {
            'success': True,
            'subtitles': result['subtitles'],
            'fullText': "".join([s['text'] for s in result['subtitles']]),
            'language': 'zh'
        }

    except Exception as e:
        print(f"Gemini Error: {e}")
        return {'error': str(e)}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'gemini_configured': client is not None,
        'backend': 'Gemini-2.0-SDK-Powered'
    })

@app.route('/api/analyze-video', methods=['POST'])
def analyze_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400
    
    video_file = request.files['video']
    if video_file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_video:
        video_path = temp_video.name
        video_file.save(video_path)
    
    try:
        result = analyze_video_with_gemini(video_path)
        os.unlink(video_path)
        
        if 'error' in result:
            return jsonify(result), 500
        return jsonify(result)
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"CRITICAL ERROR during analyze-video:\n{error_details}")
        if os.path.exists(video_path): os.unlink(video_path)
        return jsonify({'error': str(e), 'details': 'Check Render logs for traceback'}), 500

if __name__ == '__main__':
    # Use the port assigned by the cloud provider or default to 5000
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False) # Turn off debug for production
