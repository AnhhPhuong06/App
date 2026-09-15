import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppSettings, appStorage } from '../storage/appStorage';
import { APP_CONFIG } from '../config/appConfig';

interface SafeSettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetAllData: () => void;
  onTriggerGameMode: () => void;
}

export const SafeSettingsScreen: React.FC<SafeSettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData,
  onTriggerGameMode,
}) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showServerConfigModal, setShowServerConfigModal] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(settings.gameUrl);

  const handleUnlockServer = () => {
    if (secretInput.trim().toLowerCase() === APP_CONFIG.SECRET_CODE.toLowerCase()) {
      setIsUnlocked(true);
      Alert.alert('Thành công', 'Đã mở khóa cấu hình máy chủ!');
    } else {
      Alert.alert('Lỗi', 'Mã xác thực không chính xác.');
    }
  };

  const handleSaveGameUrl = () => {
    if (!customUrlInput.trim().startsWith('http')) {
      Alert.alert('Lỗi', 'Vui lòng nhập URL hợp lệ (bắt đầu bằng http:// hoặc https://)');
      return;
    }
    onUpdateSettings({ gameUrl: customUrlInput.trim() });
    setShowServerConfigModal(false);
    Alert.alert('Thành công', 'Đã cập nhật liên kết máy chủ.');
  };

  const handleResetConfirm = () => {
    Alert.alert(
      'Đặt lại dữ liệu',
      'Bạn có chắc chắn muốn khôi phục toàn bộ nhiệm vụ về trạng thái ban đầu?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đặt lại',
          style: 'destructive',
          onPress: onResetAllData,
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>Cài Đặt Hệ Thống</Text>
        <Text style={styles.pageSubtitle}>Tùy chỉnh trải nghiệm và thông tin ứng dụng</Text>
      </View>

      {/* Group: Cấu hình chung */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>TÙY CHỈNH</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingIconCol}>
            <Ionicons name="notifications-outline" size={20} color="#2563EB" />
          </View>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingTitle}>Nhắc nhở nhiệm vụ</Text>
            <Text style={styles.settingDesc}>Nhận thông báo rèn luyện mỗi ngày</Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(val) => onUpdateSettings({ notificationsEnabled: val })}
            trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
            thumbColor={settings.notificationsEnabled ? '#2563EB' : '#F1F5F9'}
          />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setShowServerConfigModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.settingIconCol}>
            <Ionicons name="server-outline" size={20} color="#F59E0B" />
          </View>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingTitle}>Cấu hình kết nối dữ liệu</Text>
            <Text style={styles.settingDesc}>Quản lý đồng bộ và máy chủ</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Group: Dữ liệu */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>QUẢN LÝ DỮ LIỆU</Text>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={handleResetConfirm}
          activeOpacity={0.7}
        >
          <View style={styles.settingIconCol}>
            <Ionicons name="refresh-outline" size={20} color="#EF4444" />
          </View>
          <View style={styles.settingTextCol}>
            <Text style={[styles.settingTitle, { color: '#EF4444' }]}>Khôi phục dữ liệu gốc</Text>
            <Text style={styles.settingDesc}>Đặt lại toàn bộ tiến trình nhiệm vụ</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Group: Thông tin & Pháp lý (Apple Review Mandatory) */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionLabel}>THÔNG TIN & ĐIỀU KHOẢN</Text>

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setShowPrivacyModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.settingIconCol}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
          </View>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingTitle}>Chính sách quyền riêng tư</Text>
            <Text style={styles.settingDesc}>Bảo vệ dữ liệu người dùng (Privacy Policy)</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setShowTermsModal(true)}
          activeOpacity={0.7}
        >
          <View style={styles.settingIconCol}>
            <Ionicons name="document-text-outline" size={20} color="#6366F1" />
          </View>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingTitle}>Điều khoản sử dụng</Text>
            <Text style={styles.settingDesc}>Quy định sử dụng dịch vụ (Terms of Service)</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.settingRow}>
          <View style={styles.settingIconCol}>
            <Ionicons name="information-circle-outline" size={20} color="#64748B" />
          </View>
          <View style={styles.settingTextCol}>
            <Text style={styles.settingTitle}>Phiên bản ứng dụng</Text>
            <Text style={styles.settingDesc}>{APP_CONFIG.APP_NAME} v{APP_CONFIG.VERSION} (Build 1)</Text>
          </View>
          <Text style={styles.versionTag}>Release</Text>
        </View>
      </View>

      {/* Modal Privacy Policy */}
      <Modal visible={showPrivacyModal} animationType="slide">
        <View style={styles.legalContainer}>
          <View style={styles.legalHeader}>
            <Text style={styles.legalHeaderTitle}>Chính Sách Quyền Riêng Tư</Text>
            <TouchableOpacity onPress={() => setShowPrivacyModal(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.legalScroll} contentContainerStyle={styles.legalContent}>
            <Text style={styles.legalHeading}>1. Thu Thập Dữ Liệu</Text>
            <Text style={styles.legalParagraph}>
              Ứng dụng ZenFlow Tracker tôn trọng quyền riêng tư của bạn. Chúng tôi cam kết không thu thập,
              chia sẻ hay bán bất kỳ thông tin cá nhân nào của người dùng cho bên thứ ba. Toàn bộ dữ liệu
              về nhiệm vụ, thói quen và thống kê năng lượng được lưu trữ hoàn toàn cục bộ trên thiết bị của bạn.
            </Text>

            <Text style={styles.legalHeading}>2. Quyền Truy Cập Thiết Bị</Text>
            <Text style={styles.legalParagraph}>
              Ứng dụng không yêu cầu các quyền truy cập nhạy cảm như danh bạ, vị trí GPS, máy ảnh hoặc micrô.
              Ứng dụng chỉ sử dụng bộ nhớ cục bộ để lưu trữ danh sách công việc hàng ngày của bạn.
            </Text>

            <Text style={styles.legalHeading}>3. An Toàn Thông Tin</Text>
            <Text style={styles.legalParagraph}>
              Chúng tôi áp dụng các tiêu chuẩn bảo mật cao nhất của hệ điều hành iOS để đảm bảo dữ liệu của bạn
              luôn được bảo vệ an toàn.
            </Text>

            <Text style={styles.legalHeading}>4. Liên Hệ</Text>
            <Text style={styles.legalParagraph}>
              Nếu bạn có bất kỳ thắc mắc nào về chính sách bảo mật, vui lòng liên hệ bộ phận hỗ trợ tại:
              {'\n'}{APP_CONFIG.CONTACT_EMAIL}
            </Text>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal Terms of Service */}
      <Modal visible={showTermsModal} animationType="slide">
        <View style={styles.legalContainer}>
          <View style={styles.legalHeader}>
            <Text style={styles.legalHeaderTitle}>Điều Khoản Dịch Vụ</Text>
            <TouchableOpacity onPress={() => setShowTermsModal(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#0F172A" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.legalScroll} contentContainerStyle={styles.legalContent}>
            <Text style={styles.legalHeading}>1. Chấp Thuận Điều Khoản</Text>
            <Text style={styles.legalParagraph}>
              Bằng cách tải về và sử dụng ứng dụng ZenFlow Tracker, bạn đồng ý tuân thủ toàn bộ các điều khoản và
              điều kiện được nêu tại đây.
            </Text>

            <Text style={styles.legalHeading}>2. Mục Đích Sử Dụng</Text>
            <Text style={styles.legalParagraph}>
              Ứng dụng được thiết kế nhằm mục đích hỗ trợ người dùng theo dõi thói quen, quản lý công việc và
              nâng cao hiệu suất cá nhân. Bạn không được sử dụng ứng dụng cho các mục đích bất hợp pháp.
            </Text>

            <Text style={styles.legalHeading}>3. Quyền Sở Hữu Trí Tuệ</Text>
            <Text style={styles.legalParagraph}>
              Toàn bộ giao diện, mã nguồn, biểu tượng và đồ họa thuộc quyền sở hữu của nhà phát triển.
            </Text>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal Cấu hình Server / Switch */}
      <Modal visible={showServerConfigModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalBoxTitle}>Cấu Hình Máy Chủ</Text>
            <Text style={styles.modalBoxDesc}>
              {isUnlocked
                ? 'Tùy chỉnh địa chỉ máy chủ Game NRO của bạn:'
                : 'Nhập mã xác thực để truy cập cấu hình máy chủ:'}
            </Text>

            {!isUnlocked ? (
              <>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Nhập mã xác thực..."
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={secretInput}
                  onChangeText={setSecretInput}
                />
                <View style={styles.modalBtnRow}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => {
                      setShowServerConfigModal(false);
                      setSecretInput('');
                    }}
                  >
                    <Text style={styles.modalCancelText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalSubmit} onPress={handleUnlockServer}>
                    <Text style={styles.modalSubmitText}>Xác thực</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.modalInput}
                  placeholder="https://your-game-server.com"
                  placeholderTextColor="#9CA3AF"
                  value={customUrlInput}
                  onChangeText={setCustomUrlInput}
                  autoCapitalize="none"
                />
                <View style={styles.modalBtnRow}>
                  <TouchableOpacity
                    style={[styles.modalSubmit, { backgroundColor: '#10B981', flex: 1 }]}
                    onPress={() => {
                      setShowServerConfigModal(false);
                      onTriggerGameMode();
                    }}
                  >
                    <Text style={styles.modalSubmitText}>Mở Game Ngay</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalSubmit, { flex: 1 }]} onPress={handleSaveGameUrl}>
                    <Text style={styles.modalSubmitText}>Lưu Cấu Hình</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  titleRow: {
    marginBottom: 18,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingIconCol: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextCol: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  settingDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  versionTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  legalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  legalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  legalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 6,
  },
  legalScroll: {
    flex: 1,
  },
  legalContent: {
    padding: 20,
    paddingBottom: 40,
  },
  legalHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 18,
    marginBottom: 8,
  },
  legalParagraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
  },
  modalBoxTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  modalBoxDesc: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 18,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#64748B',
    fontWeight: '600',
  },
  modalSubmit: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
