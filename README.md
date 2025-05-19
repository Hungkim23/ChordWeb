# ChordWeb - Ứng dụng Chia sẻ Hợp âm Guitar

Ứng dụng web cho phép người dùng chia sẻ và tìm kiếm hợp âm guitar của các bài hát.

## Tính năng chính

- Đăng tải và chia sẻ hợp âm guitar
- Hệ thống phê duyệt bài hát
- Yêu thích và lưu bài hát
- Phân quyền admin/user
- Theo dõi lượt xem

## Công nghệ sử dụng

- React.js
- Firebase (Authentication, Firestore)
- Bootstrap 5
- React Router

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/your-username/chordweb.git
cd chordweb
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file .env và cấu hình Firebase:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

4. Chạy ứng dụng:
```bash
npm start
```

## Cấu trúc thư mục

```
src/
  ├── components/     # Các component tái sử dụng
  ├── pages/         # Các trang chính
  ├── utils/         # Các utility function
  ├── firebase.js    # Cấu hình Firebase
  └── App.js         # Component gốc
```

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request để đóng góp.

## License

MIT
