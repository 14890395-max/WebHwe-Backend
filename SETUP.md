# WebHwe - Hướng dẫn Setup và Sử dụng

## 📋 Tổng quan

WebHwe bao gồm 2 phần:
1. **Frontend** (HTML/CSS/JS) - Giao diện người dùng
2. **Backend** (Python Flask) - Phân tích video bằng AI

## 🚀 Quick Start

### Cách 1: Chỉ dùng Frontend (Demo với mock data)

```bash
# Mở file index.html bằng browser
# Hoặc dùng Live Server
python -m http.server 8000
# Truy cập: http://localhost:8000
```

### Cách 2: Chạy đầy đủ với Backend (Phân tích video thật)

**Bước 1: Cài đặt yêu cầu**
- Python 3.8+ ([Download](https://www.python.org/downloads/))
- FFmpeg ([Download Windows](https://www.gyan.dev/ffmpeg/builds/))

**Bước 2: Cài đặt Backend**

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt thư viện Python
pip install -r requirements.txt

# Chạy server
python server.py
```

Server sẽ chạy tại `http://localhost:5000`

**Bước 3: Mở Frontend**

Mở `index.html` trong browser hoặc:
```bash
cd ..
python -m http.server 8000
```

**Bước 4: Upload và phân tích video**

1. Mở web tại `http://localhost:8000`
2. Click vào khu vực upload hoặc kéo thả file MP4
3. Đợi backend phân tích (có thể mất 30s - 2 phút tùy độ dài video)
4. Video sẽ tự động mở với phụ đề đã được phân tích!

---

## ⚙️ Cấu hình Whisper Model

Trong `backend/server.py`, dòng 19:

```python
whisper_model = whisper.load_model("base")
```

**Các model khả dụng:**
- `tiny` - Nhanh nhất, độ chính xác thấp (~75MB)
- `base` - **Khuyến nghị** cho CPU thông thường (~140MB)
- `small` - Chính xác hơn, cần CPU mạnh (~460MB)
- `medium` - Rất chính xác, khuyến nghị có GPU (~1.5GB)
- `large` - Tốt nhất, cần GPU mạnh (~3GB)

---

## 🐛 Troubleshooting

### Lỗi: "Failed to fetch" khi upload video

**Nguyên nhân:** Backend chưa chạy

**Giải pháp:**
```bash
cd backend
python server.py
```

### Lỗi: "FFmpeg not found"

**Windows:**
1. Download FFmpeg: https://www.gyan.dev/ffmpeg/builds/
2. Giải nén vào `C:\ffmpeg`
3. Thêm `C:\ffmpeg\bin` vào PATH:
   - Control Panel → System → Advanced System Settings
   - Environment Variables → Path → Edit → New → `C:\ffmpeg\bin`
4. Khởi động lại terminal

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

### Lỗi: Video quá chậm khi phân tích

**Giải pháp 1:** Dùng model nhỏ hơn (xem mục Cấu hình)

**Giải pháp 2:** Cắt video ngắn hơn trước khi upload

**Giải pháp 3:** Nếu có GPU NVIDIA, cài CUDA để tăng tốc:
```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### Lỗi: "No module named 'whisper'"

```bash
pip install openai-whisper
```

---

## 📁 Cấu trúc thư mục

```
WebHwe/
├── index.html              # Trang chủ
├── styles/
│   └── main.css            # CSS styling
├── scripts/
│   ├── data.js             # Mock data
│   └── app.js              # Frontend logic
├── backend/
│   ├── server.py           # Flask API server
│   ├── requirements.txt    # Python dependencies
│   └── README.md           # Backend guide
└── references/             # Design references
```

---

## 🎯 Tính năng chính

### ✅ Đã hoàn thành
- Dashboard với upload video
- Video player với smart subtitles (dual-line Pinyin/Hanzi)
- Dictionary popup tương tác
- Flashcard system với 3D flip
- Backend AI phân tích video (Whisper + jieba + pypinyin)

### 🚧 Có thể mở rộng
- Hỗ trợ URL YouTube trực tiếp
- Spaced Repetition System (SRS) cho flashcards
- Export/Import flashcards
- Multi-user support với database
- Mobile app (React Native)

---

## 📝 API Endpoints

Backend cung cấp các API sau:

### 1. Health Check
```http
GET http://localhost:5000/api/health
```

### 2. Analyze Video
```http
POST http://localhost:5000/api/analyze-video
Content-Type: multipart/form-data

video: <file.mp4>
```

**Response:**
```json
{
  "success": true,
  "subtitles": [
    {
      "id": 1,
      "startTime": 0,
      "endTime": 3,
      "text": "可是 死者 都 被 故人 包围 了",
      "words": [
        {
          "text": "可是",
          "pinyin": "kě shì",
          "meaning": "nhưng",
          "start": 0,
          "end": 0.5
        }
        // ...
      ]
    }
  ]
}
```

### 3. Lookup Word
```http
POST http://localhost:5000/api/lookup-word
Content-Type: application/json

{
  "word": "死者"
}
```

---

## 💡 Tips sử dụng

1. **Video nên có âm thanh rõ ràng** để Whisper phân tích chính xác
2. **Tốc độ phân tích:** ~1 phút video → 30-60 giây xử lý (tùy CPU)
3. **Định dạng video:** MP4, AVI, MOV đều được hỗ trợ
4. **Ngôn ngữ:** Hiện chỉ hỗ trợ tiếng Trung (Mandarin)

---

## 🆘 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console của browser (F12)
2. Kiểm tra terminal chạy backend
3. Xem file `backend/README.md` để biết chi tiết hơn

---

## 🎉 Chúc bạn học tập vui vẻ!

Made with ❤️ using Whisper AI, Flask, and Vanilla JS
