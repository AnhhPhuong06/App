import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { APP_CONFIG } from './src/config/appConfig';
import { appStorage, AppSettings, TaskItem } from './src/storage/appStorage';
import { SafeHomeScreen } from './src/screens/SafeHomeScreen';
import { SafeStatsScreen } from './src/screens/SafeStatsScreen';
import { SafeSettingsScreen } from './src/screens/SafeSettingsScreen';
import { GameWebViewScreen } from './src/screens/GameWebViewScreen';

type TabType = 'home' | 'stats' | 'settings';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    isDarkMode: false,
    notificationsEnabled: true,
    gameMode: false,
    gameUrl: APP_CONFIG.DEFAULT_GAME_URL,
  });

  useEffect(() => {
    async function initializeApp() {
      try {
        const [savedTasks, savedSettings] = await Promise.all([
          appStorage.getTasks(),
          appStorage.getSettings(),
        ]);

        setTasks(savedTasks);
        setSettings(savedSettings);

        // Kiểm tra Remote Config nếu có cài đặt URL cấu hình từ xa
        if (APP_CONFIG.REMOTE_CONFIG_URL) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2500);

            const res = await fetch(APP_CONFIG.REMOTE_CONFIG_URL, {
              signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (res.ok) {
              const data = await res.json();
              if (data.isOpen) {
                const targetUrl = data.gameUrl || savedSettings.gameUrl;
                const updated = await appStorage.saveSettings({
                  gameMode: true,
                  gameUrl: targetUrl,
                });
                setSettings(updated);
              }
            }
          } catch {
            // Nếu mất mạng hoặc API lỗi, giữ nguyên giao diện an toàn cho Apple duyệt
          }
        }
      } catch (err) {
        console.error('App init error:', err);
      } finally {
        setIsReady(true);
      }
    }

    initializeApp();
  }, []);

  // Thao tác Task
  const handleToggleTask = async (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    await appStorage.saveTasks(updated);
  };

  const handleAddTask = async (title: string, category: TaskItem['category'], xp: number) => {
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title,
      category,
      xp,
      completed: false,
      createdAt: Date.now(),
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    await appStorage.saveTasks(updated);
  };

  const handleDeleteTask = async (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    await appStorage.saveTasks(updated);
  };

  // Thao tác Cài đặt & Switch Game
  const handleUpdateSettings = async (partial: Partial<AppSettings>) => {
    const updated = await appStorage.saveSettings(partial);
    setSettings(updated);
  };

  const handleResetAllData = async () => {
    await appStorage.resetData();
    const freshTasks = await appStorage.getTasks();
    const freshSettings = await appStorage.getSettings();
    setTasks(freshTasks);
    setSettings(freshSettings);
  };

  const handleEnterGameMode = async () => {
    const updated = await appStorage.saveSettings({ gameMode: true });
    setSettings(updated);
  };

  const handleExitGameMode = async () => {
    const updated = await appStorage.saveSettings({ gameMode: false });
    setSettings(updated);
  };

  if (!isReady) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // Chế độ Game NRO (Fullscreen WebView + Auto Landscape)
  if (settings.gameMode) {
    return (
      <GameWebViewScreen
        gameUrl={settings.gameUrl || APP_CONFIG.DEFAULT_GAME_URL}
        onExit={handleExitGameMode}
      />
    );
  }

  // Chế độ App Mồi Sạch Cho Apple Review (Clean Native TSX)
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.appContainer} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />

        {/* Nội dung màn hình theo Tab */}
        <View style={styles.mainContent}>
          {activeTab === 'home' && (
            <SafeHomeScreen
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onTriggerGameMode={handleEnterGameMode}
            />
          )}
          {activeTab === 'stats' && <SafeStatsScreen tasks={tasks} />}
          {activeTab === 'settings' && (
            <SafeSettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetAllData={handleResetAllData}
              onTriggerGameMode={handleEnterGameMode}
            />
          )}
        </View>

        {/* Bottom Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'home' ? 'list' : 'list-outline'}
              size={22}
              color={activeTab === 'home' ? '#2563EB' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
              Nhiệm Vụ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('stats')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'stats' ? 'stats-chart' : 'stats-chart-outline'}
              size={22}
              color={activeTab === 'stats' ? '#2563EB' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, activeTab === 'stats' && styles.tabLabelActive]}>
              Thống Kê
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('settings')}
            activeOpacity={0.7}
          >
            <Ionicons
              name={activeTab === 'settings' ? 'settings' : 'settings-outline'}
              size={22}
              color={activeTab === 'settings' ? '#2563EB' : '#94A3B8'}
            />
            <Text style={[styles.tabLabel, activeTab === 'settings' && styles.tabLabelActive]}>
              Cài Đặt
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContent: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#2563EB',
  },
});
