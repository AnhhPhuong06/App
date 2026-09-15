# ZenFlow Tracker - Decoy / Carrier App Đẩy NRO Lên TestFlight

Ứng dụng được viết hoàn toàn bằng **React Native (Expo SDK 57) + TypeScript (.tsx)**, thiết kế chuyên biệt làm **App Mồi** để vượt qua các điều khoản kiểm duyệt khắt khe của Apple (Guideline 4.2 & 4.3) và sẵn sàng chuyển đổi linh hoạt sang game Ngọc Rồng Online (NRO).

---

## 1. Cơ Chế Chuyển Đổi (Switch Triggers)

App có 4 cơ chế kích hoạt vào giao diện Game NRO (Fullscreen WebView + Tự động khóa xoay ngang Landscape):

### Cách 1: Gõ mã bí mật vào ô tìm kiếm
- Tại màn hình chính (Nhiệm Vụ), nhấn vào thanh tìm kiếm.
- Nhập mã bí mật: `nro888`
- Hệ thống sẽ hiển thị thông báo xác nhận và chuyển ngay vào Game NRO.

### Cách 2: Chạm 5 lần vào Logo
- Tại thanh trên cùng (Header) của màn hình chính, chạm liên tiếp 5 lần vào biểu tượng Logo tia chớp / ZenFlow.
- Hệ thống kích hoạt cửa sổ chuyển đổi vào Game NRO.

### Cách 3: Cấu hình URL Game trong Cài Đặt
- Vào tab **Cài Đặt** -> Chọn **Cấu hình kết nối dữ liệu**.
- Nhập mã `nro888` để mở khóa.
- Bạn có thể chỉnh sửa link Web Game NRO (`https://...`) trực tiếp trong app và bấm **Mở Game Ngay** hoặc **Lưu Cấu Hình**.

### Cách 4: Kích hoạt từ xa (Remote Config)
- Mở file [appConfig.ts](file:///d:/AppUpTest/src/config/appConfig.ts).
- Điền đường dẫn API cấu hình vào `REMOTE_CONFIG_URL` (ví dụ link raw json từ Github / Firebase / Cloudflare Worker).
- Định dạng JSON trả về:
  ```json
  {
    "isOpen": true,
    "gameUrl": "https://your-nro-game-server.com"
  }
  ```
  Khi Apple đang kiểm duyệt: Đặt `"isOpen": false` (hoặc chặn theo IP Mỹ / Apple Reviewer). Khi duyệt xong: Bật `"isOpen": true`.

---

## 2. Cách Chạy Thử Ứng Dụng (Local Development)

```bash
# Khởi động Expo Metro Bundler
npm start
```
- Nhấn phím `i` để mở trên iPhone Simulator (nếu có Mac).
- Hoặc quét mã QR bằng ứng dụng **Expo Go** trên iPhone / iPad thật để trải nghiệm trực tiếp!

---

## 3. Cách Đẩy Lên TestFlight

### Phương Án 1: Mở trực tiếp bằng Xcode trên máy Mac (Khuyên Dùng)
1. Copy hoặc push source code lên Git và clone về máy Mac.
2. Tại thư mục dự án, chạy lệnh:
   ```bash
   npx expo prebuild --platform ios
   ```
   Lệnh này sẽ tự động sinh thư mục `ios/` hoàn chỉnh với file `ZenFlowTracker.xcworkspace`.
3. Mở file `ios/ZenFlowTracker.xcworkspace` bằng **Xcode**.
4. Vào mục **Signing & Capabilities**, chọn Team Apple Developer của bạn.
5. Trên thanh menu Xcode: Chọn thiết bị **Any iOS Device (arm64)** -> Chọn menu **Product** -> **Archive**.
6. Sau khi Archive hoàn tất, chọn **Distribute App** -> **TestFlight & App Store** -> **Upload**!

### Phương Án 2: Sử dụng Codemagic CI/CD (Không cần Mac)
- Dự án đã tích hợp sẵn file cấu hình [codemagic.yaml](file:///d:/AppUpTest/codemagic.yaml).
- Kết nối kho mã nguồn với Codemagic, thiết lập App Store Connect API Key, hệ thống sẽ tự động build file `.ipa` và gửi thẳng lên TestFlight.

### Phương Án 3: Sử dụng EAS Build của Expo
```bash
# Cài đặt EAS CLI nếu chưa có
npm install -g eas-cli

# Đăng nhập tài khoản Expo
eas login

# Khởi tạo và build trực tiếp lên TestFlight
eas build --platform ios --auto-submit
```

---

## 4. Cấu Trúc Mã Nguồn

- [App.tsx](file:///d:/AppUpTest/App.tsx): Root component điều hướng giữa Safe Mode (App mồi TSX) và Game Mode (WebView xoay ngang).
- [src/config/appConfig.ts](file:///d:/AppUpTest/src/config/appConfig.ts): Tùy chỉnh link game mặc định, mã bí mật, chính sách bảo mật.
- [src/storage/appStorage.ts](file:///d:/AppUpTest/src/storage/appStorage.ts): Lưu trữ dữ liệu nhiệm vụ, trạng thái kích hoạt cục bộ qua AsyncStorage.
- [src/screens/GameWebViewScreen.tsx](file:///d:/AppUpTest/src/screens/GameWebViewScreen.tsx): Trình duyệt Webview toàn màn hình, hỗ trợ xoay ngang, thanh loading và nút thoát quay về an toàn.
- [src/screens/SafeHomeScreen.tsx](file:///d:/AppUpTest/src/screens/SafeHomeScreen.tsx): Giao diện quản lý nhiệm vụ, năng lượng rèn luyện và các trigger bí mật.
- [src/screens/SafeStatsScreen.tsx](file:///d:/AppUpTest/src/screens/SafeStatsScreen.tsx): Màn hình thống kê năng lượng, biểu đồ tuần và danh hiệu chiến binh.
- [src/screens/SafeSettingsScreen.tsx](file:///d:/AppUpTest/src/screens/SafeSettingsScreen.tsx): Cài đặt, Privacy Policy, Terms of Service và cấu hình server bảo mật.
- [app.json](file:///d:/AppUpTest/app.json): Cấu hình Bundle ID (`com.zenflow.taskplanner`), ATS, xoay màn hình, và thông số xuất bản iOS.
