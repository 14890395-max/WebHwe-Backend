import requests
import json
import os

def download_hanviet():
    url = "https://raw.githubusercontent.com/tranminhhuydn/macros/master/data/hanViet.json"
    print(f"Downloading from {url}...")
    try:
        response = requests.get(url)
        response.raise_for_status()
        raw_data = response.json()
        
        # Convert [["char", "reading"], ...] to mapping {"char": "reading"}
        # For multiple readings, we keep the string as is (e.g., "dữ, dự, dư")
        mapping = {}
        for item in raw_data.get("data", []):
            if len(item) == 2:
                mapping[item[0]] = item[1]
        
        # Save optimized dict
        os.makedirs("backend/data", exist_ok=True)
        with open("backend/data/hanviet_dict.json", "w", encoding="utf-8") as f:
            json.dump(mapping, f, ensure_ascii=False, indent=2)
            
        print(f"Successfully saved {len(mapping)} characters to backend/data/hanviet_dict.json")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    download_hanviet()
