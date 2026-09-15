import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';

interface GameWebViewScreenProps {
  gameUrl: string;
  onExit: () => void;
}

export const GameWebViewScreen: React.FC<GameWebViewScreenProps> = ({ gameUrl, onExit }) => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    // Tự động xoay ngang màn hình khi vào Game NRO
    async function lockLandscape() {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        StatusBar.setHidden(true, 'fade');
      } catch (err) {
        console.warn('Failed to lock landscape orientation:', err);
      }
    }

    lockLandscape();

    return () => {
      // Khi thoát game quay về màn hình dọc
      async function restorePortrait() {
        try {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
          StatusBar.setHidden(false, 'fade');
        } catch (err) {
          console.warn('Failed to restore portrait orientation:', err);
        }
      }
      restorePortrait();
    };
  }, []);

  const handleExitConfirm = () => {
    Alert.alert(
      'Thoát Game Mode',
      'Bạn có muốn quay về giao diện Quản Lý Nhiệm Vụ (App Mồi)?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Quay về App Mồi',
          style: 'destructive',
          onPress: async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            StatusBar.setHidden(false, 'fade');
            onExit();
          },
        },
      ]
    );
  };

  const handleReload = () => {
    setLoadError(null);
    setIsLoading(true);
    webViewRef.current?.reload();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <WebView
        ref={webViewRef}
        source={{ uri: gameUrl }}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        scalesPageToFit={true}
        originWhitelist={['*']}
        mixedContentMode="always"
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setLoadError(nativeEvent.description || 'Không thể tải trang game.');
          setIsLoading(false);
        }}
      />

      {/* Loading overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FF9900" />
          <Text style={styles.loadingText}>Đang nạp dữ liệu máy chủ...</Text>
        </View>
      )}

      {/* Error state */}
      {loadError && (
        <View style={styles.errorOverlay}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF5252" />
          <Text style={styles.errorTitle}>Lỗi kết nối Game</Text>
          <Text style={styles.errorMessage}>{loadError}</Text>
          <Text style={styles.errorUrl}>{gameUrl}</Text>
          <View style={styles.errorActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleReload}>
              <Ionicons name="refresh" size={18} color="#FFF" />
              <Text style={styles.actionBtnText}>Thử lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.exitBtn]}
              onPress={handleExitConfirm}
            >
              <Ionicons name="arrow-back" size={18} color="#FFF" />
              <Text style={styles.actionBtnText}>Quay về App</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Nút thoát nổi tinh gọn ở góc trên cùng (không cản tầm nhìn) */}
      <TouchableOpacity
        style={styles.floatingMenuBtn}
        activeOpacity={0.7}
        onPress={handleExitConfirm}
      >
        <Ionicons name="power-outline" size={20} color="rgba(255,255,255,0.75)" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  webView: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#E0E0E0',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  errorOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 20,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  errorMessage: {
    color: '#B0B0B0',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  errorUrl: {
    color: '#888888',
    fontSize: 11,
    marginTop: 4,
    marginBottom: 20,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  exitBtn: {
    backgroundColor: '#374151',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  floatingMenuBtn: {
    position: 'absolute',
    top: 14,
    right: 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});
