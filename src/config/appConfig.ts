export interface RemoteConfigResponse {
  isOpen: boolean;
  gameUrl?: string;
  announcement?: string;
}

export const APP_CONFIG = {
  // Tên hiển thị an toàn khi Apple kiểm duyệt
  APP_NAME: 'ZenFlow Tracker',
  APP_SUBTITLE: 'Daily Quest & Energy Planner',
  VERSION: '1.0.0',

  // Mã bí mật nhập vào ô tìm kiếm hoặc trang cài đặt để kích hoạt Game Mode
  SECRET_CODE: 'nro888',

  // Số lần chạm vào logo để kích hoạt bí mật
  SECRET_TAP_COUNT: 5,

  // Link game NRO mặc định (có thể là link web client NRO, canvas game hoặc server webview của bạn)
  // Bạn có thể thay đổi link này bất cứ lúc nào
  DEFAULT_GAME_URL: 'https://ngocrongonline.com',

  // Link API cấu hình từ xa (Tùy chọn: bạn có thể tạo 1 file json trên Github Gist/Raw hoặc Firebase)
  // Ví dụ JSON trả về: { "isOpen": true, "gameUrl": "https://your-game-server.com" }
  REMOTE_CONFIG_URL: '', // Để trống nếu chỉ dùng mã bí mật (Secret Code)

  // Chính sách bảo mật bắt buộc cho Apple Review
  PRIVACY_POLICY_URL: 'https://pages.flycricket.io/zenflow-tracker/privacy.html',
  TERMS_URL: 'https://pages.flycricket.io/zenflow-tracker/terms.html',
  CONTACT_EMAIL: 'support@zenflowtracker.app',
};
