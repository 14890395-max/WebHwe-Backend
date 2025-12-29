# Hướng dẫn cấu hình API Key (Bắt buộc)

Để Backend có thể chạy được AI, bạn cần thực hiện chính xác các bước sau:

### 1. Vị trí đặt file
File phải nằm trong thư mục `backend/`, cùng cấp với file `server.py`.
```text
WebHwe/
├── backend/
│   ├── .env          <-- FILE NẰM Ở ĐÂY
│   ├── server.py
│   └── ...
└── ...
```

### 2. Tên file
Tên file phải là **`.env`**. 
- Lưu ý: Không được có đuôi `.txt` hay bất kỳ đuôi nào khác. 
- Trên Windows, đôi khi nó hiện là `.env.txt`. Bạn hãy xóa phần `.txt` đi.

### 3. Nội dung bên trong file
Mở file `.env` bằng Notepad hoặc VS Code, xóa hết nội dung cũ và dán dòng này vào:

```text
GEMINI_API_KEY=AIzaSy...mã_của_bạn...
FLASK_ENV=development
```

**Lưu ý cực kỳ quan trọng:**
- Không có dấu cách xung quanh dấu `=`.
- Không có dấu nháy `"` bao quanh mã Key.
- Phải xóa chữ `your_key_here` đi (đây là mã mẫu, không dùng được).

### 4. Kiểm tra
Sau khi lưu file, bạn chạy lại lệnh:
```powershell
python backend/server.py
```
Nếu thành công, bạn sẽ thấy dòng: **`* Debugger is active!`** và **KHÔNG** có dòng cảnh báo màu vàng về API Key nữa.
