import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '../config/appConfig';

export interface TaskItem {
  id: string;
  title: string;
  category: 'Daily' | 'Focus' | 'Health' | 'Power';
  xp: number;
  completed: boolean;
  createdAt: number;
}

export interface AppSettings {
  isDarkMode: boolean;
  notificationsEnabled: boolean;
  gameMode: boolean;
  gameUrl: string;
}

const STORAGE_KEYS = {
  TASKS: '@zenflow_tasks',
  SETTINGS: '@zenflow_settings',
  STREAK: '@zenflow_streak',
};

const DEFAULT_TASKS: TaskItem[] = [
  {
    id: '1',
    title: 'Nạp năng lượng buổi sáng (Uống 500ml nước)',
    category: 'Health',
    xp: 20,
    completed: true,
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: '2',
    title: 'Hoàn thành 30 phút rèn luyện thể lực',
    category: 'Power',
    xp: 50,
    completed: true,
    createdAt: Date.now() - 3600000,
  },
  {
    id: '3',
    title: 'Đọc 15 trang bí kíp / cẩm nang phát triển',
    category: 'Focus',
    xp: 35,
    completed: false,
    createdAt: Date.now(),
  },
  {
    id: '4',
    title: 'Điểm danh nhiệm vụ hàng ngày (Daily Quest)',
    category: 'Daily',
    xp: 25,
    completed: false,
    createdAt: Date.now(),
  },
];

const DEFAULT_SETTINGS: AppSettings = {
  isDarkMode: false,
  notificationsEnabled: true,
  gameMode: false,
  gameUrl: APP_CONFIG.DEFAULT_GAME_URL,
};

export const appStorage = {
  async getTasks(): Promise<TaskItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      if (data) {
        return JSON.parse(data);
      }
      // Lưu danh sách mẫu nếu lần đầu mở app
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
      return DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  },

  async saveTasks(tasks: TaskItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks:', e);
    }
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async resetData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TASKS);
      await AsyncStorage.removeItem(STORAGE_KEYS.SETTINGS);
    } catch (e) {
      console.error('Error resetting data:', e);
    }
  },
};
