# 20/10 Interactive — V3

## V3 có gì mới?

### 1. Hub = căn phòng 3D
- Phong thư, album, gương, hộp quà là các vật thể có thể click.
- Rê chuột trên căn phòng tạo hiệu ứng camera/parallax.
- Mỗi vật thể hiển thị nhãn khi hover.
- Progress 0/4 -> 4/4.
- Khi mở đủ 4 không gian, đoạn kết được mở khóa.

### 2. KHÁM PHÁ
- Scroll bức thư dài.
- Các box chibi bay từ phía trên xuống.
- Click box => mở một lời chúc.
- Các đoạn thư fade-in theo scroll.

### 3. KỶ NIỆM
- Kho ảnh dạng album.
- Prev / next / dots.
- Click ảnh => lightbox.
- Có 8 vị trí ảnh mẫu.

Thay:
assets/photos/memory-01.svg ... memory-08.svg
bằng ảnh thật của bạn.
Nếu muốn dùng JPG/PNG:
- đổi src trong js/pages.js, mảng MEMORYS.
- đổi tên/đường dẫn tương ứng.

### 4. NHẮC NHỞ
- 4 mảnh giấy.
- Click => mở lời nhắc dạng modal.
- Có cửa dẫn tới CẢM ƠN.

### 5. CẢM ƠN
- Tên
- Lời nhắn
- Mức độ hài lòng 1–5
- Gửi qua FormSubmit -> kiotarot@gmail.com
- Lần đầu dùng cần xác nhận kích hoạt email.

### 6. DÀNH TẶNG
- 6 món quà.
- Mỗi món mở một lời nhắn.
- KẾT NỐI ở cuối.

### 7. KẾT NỐI
Chỉnh file:
js/config.js
=> connectUrl: "YOUR_LINK_HERE.html"

### 8. ÂM NHẠC
assets/ambient.wav là nhạc ambient mẫu.
Thay bằng file nhạc bạn thích nếu cần, giữ tên ambient.wav hoặc sửa src trong index.html.

## Cấu trúc
index.html
css/
  global.css
  pages.css
js/
  config.js
  app.js
  pages.js
assets/
  ambient.wav
  photos/

Mở index.html bằng trình duyệt là chạy.

Lưu ý khi deploy:
- FormSubmit có thể yêu cầu xác nhận email lần đầu.
- Nếu trình duyệt chặn nhạc tự động, click nút NHẠC.
