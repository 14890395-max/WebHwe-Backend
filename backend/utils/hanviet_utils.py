import json
import os

class HanVietTranslator:
    _instance = None
    _dict = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(HanVietTranslator, cls).__new__(cls)
            cls._instance._load_dict()
        return cls._instance

    def _load_dict(self):
        dict_path = os.path.join(os.path.dirname(__file__), "..", "data", "hanviet_dict.json")
        try:
            if os.path.exists(dict_path):
                with open(dict_path, "r", encoding="utf-8") as f:
                    self._dict = json.load(f)
            else:
                print(f"Warning: HanViet dict not found at {dict_path}")
        except Exception as e:
            print(f"Error loading HanViet dict: {e}")

    def to_hanviet(self, text):
        """
        Translates a word or sentence into Hán Việt.
        If a word is multiple characters, it translates character by character.
        If a character has multiple readings (e.g., 'dữ, dự, dư'), it picks the first one.
        """
        results = []
        for char in text:
            reading = self._dict.get(char)
            if reading:
                # Pick the first reading if multiple exist
                main_reading = reading.split(',')[0].strip()
                results.append(main_reading.capitalize())
            else:
                # Keep original if not found
                results.append(char)
        
        return " ".join(results)

# Singleton instance
translator = HanVietTranslator()
