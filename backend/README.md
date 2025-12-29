# WebHwe Backend - Hướng dẫn cài đặt

## Yêu cầu hệ thống

1. **Python 3.8+** (Kiểm tra: `python --version`)
2. **FFmpeg** (Phần mềm xử lý video/audio)
3. **4GB RAM trở lên** (để chạy Whisper model)

---

## Bước 1: Cài đặt Python

Nếu chưa có Python:
1. Download từ: https://www.python.org/downloads/
2. Cài đặt và **tick vào "Add Python to PATH"**
3. Khởi động lại terminal

---

## Bước 2: Cài đặt FFmpeg

### Windows:
```powershell
# Cách 1: Dùng Chocolatey (nếu đã có)
choco install ffmpeg

# Cách 2: Tải thủ công
# 1. Download từ: https://www.gyan.dev/ffmpeg/builds/
# 2. Giải nén vào C:\ffmpeg
# 3. Thêm C:\ffmpeg\bin vào PATH:
#    - Control Panel → System → Advanced → Environment Variables
#    - Tìm biến "Path" → Edit → Add → C:\ffmpeg\bin
```

### macOS:
```bash
brew install ffmpeg
```

### Linux:
```bash
sudo apt-get install ffmpeg
```

**Kiểm tra cài đặt:**
```bash
ffmpeg -version
```

---

## Bước 3: Cài đặt thư viện Python

Mở terminal tại thư mục `backend/`:

```bash
# Di chuyển vào thư mục backend
cd c:\Users\Admin\Desktop\AG\WebHwe\backend

# Cài đặt tất cả dependencies
pip install -r requirements.txt
```

**Lưu ý:** Bước này có thể mất 5-10 phút vì phải tải Whisper model.

---

## Bước 4: Chạy Backend Server

```bash
python server.py
```

Nếu thành công, bạn sẽ thấy:
```
WebHwe Backend Server
==================================================
Loading Whisper model...
Whisper model loaded successfully!
Starting server on http://localhost:5000
==================================================
```

**Để server chạy và mở terminal mới cho các lệnh tiếp theo.**

---

## Bước 5: Test API

Mở browser và truy cập:
```
http://localhost:5000/api/health
```

Nếu thấy `{"status": "ok", ...}` nghĩa là backend đã sẵn sàng!

---

## Troubleshooting (Xử lý lỗi)

### Lỗi: "ffmpeg not found"
→ Cài đặt FFmpeg theo Bước 2, sau đó khởi động lại terminal

### Lỗi: "pip not recognized"
→ Python chưa được add vào PATH, cài đặt lại Python và tick "Add to PATH"

### Lỗi: "No module named 'whisper'"
→ Chạy lại: `pip install -r requirements.txt`

### Whisper quá chậm
→ Đổi model nhỏ hơn trong `server.py`:
```python
whisper_model = whisper.load_model("tiny")  # Thay vì "base"
```

Models theo độ chính xác (và tốc độ):
- `tiny` - nhanh nhất, độ chính xác thấp
- `base` - cân bằng (khuyến nghị)
- `small` - chính xác hơn, chậm hơn
- `medium` - rất chính xác, cần GPU
- `large` - tốt nhất nhưng cần GPU mạnh

---

## API Endpoints

### 1. Health Check
```
GET http://localhost:5000/api/health
```

### 2. Analyze Video
```
POST http://localhost:5000/api/analyze-video
Content-Type: multipart/form-data
Body: video file
```

### 3. Lookup Word
```
POST http://localhost:5000/api/lookup-word
Content-Type: application/json
Body: { "word": "死者" }
```

---

## Sau khi Backend chạy thành công

1. Mở `index.html` trong browser
2. Upload video MP4 tiếng Trung
3. Backend sẽ tự động phân tích và trả về phụ đề
4. Frontend hiển thị phụ đề với Pinyin + nghĩa

Enjoy! 🎉
