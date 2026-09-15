import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskItem } from '../storage/appStorage';
import { APP_CONFIG } from '../config/appConfig';

interface SafeHomeScreenProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (title: string, category: TaskItem['category'], xp: number) => void;
  onDeleteTask: (id: string) => void;
  onTriggerGameMode: () => void;
}

export const SafeHomeScreen: React.FC<SafeHomeScreenProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onTriggerGameMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TaskItem['category']>('Daily');
  const [newXp, setNewXp] = useState('25');

  // Tính toán tiến độ & năng lượng
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const currentXp = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.xp, 0);
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Xử lý chạm logo 5 lần để kích hoạt game bí mật
  const handleLogoPress = () => {
    const now = Date.now();
    if (now - lastTapTime > 2500) {
      setLogoTapCount(1);
    } else {
      const newCount = logoTapCount + 1;
      setLogoTapCount(newCount);
      if (newCount >= APP_CONFIG.SECRET_TAP_COUNT) {
        setLogoTapCount(0);
        triggerSecretUnlock();
        return;
      }
    }
    setLastTapTime(now);
  };

  // Xử lý khi gõ mã bí mật vào ô tìm kiếm
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (text.trim().toLowerCase() === APP_CONFIG.SECRET_CODE.toLowerCase()) {
      setSearchQuery('');
      triggerSecretUnlock();
    }
  };

  const triggerSecretUnlock = () => {
    Alert.alert(
      'Hệ Thống',
      'Đã kích hoạt chế độ máy chủ. Bạn có muốn chuyển vào giao diện Game NRO ngay bây giờ?',
      [
        { text: 'Ở lại', style: 'cancel' },
        {
          text: 'Vào Game',
          style: 'default',
          onPress: onTriggerGameMode,
        },
      ]
    );
  };

  const handleCreateTask = () => {
    if (!newTitle.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên nhiệm vụ.');
      return;
    }
    const xpVal = parseInt(newXp, 10) || 20;
    onAddTask(newTitle.trim(), newCategory, xpVal);
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogoPress} style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <Ionicons name="flash" size={20} color="#F59E0B" />
          </View>
          <View>
            <Text style={styles.appTitle}>{APP_CONFIG.APP_NAME}</Text>
            <Text style={styles.appSubtitle}>{APP_CONFIG.APP_SUBTITLE}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setIsAddModalOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Hero Energy Card */}
      <View style={styles.energyCard}>
        <View style={styles.energyCardHeader}>
          <View>
            <Text style={styles.energyLabel}>NĂNG LƯỢNG HÔM NAY</Text>
            <Text style={styles.energyValue}>{currentXp} <Text style={styles.energyUnit}>XP</Text></Text>
          </View>
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color="#EF4444" />
            <Text style={styles.streakText}>7 Ngày Streak</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${completionPercentage}%` }]} />
        </View>

        <View style={styles.progressStats}>
          <Text style={styles.progressStatText}>
            Đã xong: {completedCount}/{totalCount} nhiệm vụ
          </Text>
          <Text style={styles.progressPercentText}>{completionPercentage}%</Text>
        </View>
      </View>

      {/* Search / Filter Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm nhiệm vụ hoặc nhập lệnh..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={handleSearchChange}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Task List Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nhiệm Vụ Rèn Luyện</Text>
        <Text style={styles.sectionBadge}>{filteredTasks.length}</Text>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={56} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Chưa có nhiệm vụ nào</Text>
            <Text style={styles.emptyDesc}>Bấm dấu + ở góc trên để tạo nhiệm vụ rèn luyện mới.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.taskCard, item.completed && styles.taskCardCompleted]}>
            <TouchableOpacity
              style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
              onPress={() => onToggleTask(item.id)}
            >
              {item.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
            </TouchableOpacity>

            <View style={styles.taskInfo}>
              <Text
                style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}
                numberOfLines={2}
              >
                {item.title}
              </Text>
              <View style={styles.taskMeta}>
                <View style={[styles.categoryTag, getCategoryStyle(item.category)]}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.xpBadge}>+{item.xp} XP</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDeleteTask(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal Thêm Nhiệm Vụ Mới */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm Nhiệm Vụ Mới</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Tên nhiệm vụ</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="VD: Rèn luyện 100 lần chống đẩy..."
              placeholderTextColor="#9CA3AF"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.inputLabel}>Phân loại</Text>
            <View style={styles.categoryRow}>
              {(['Daily', 'Power', 'Focus', 'Health'] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catOption,
                    newCategory === cat && styles.catOptionActive,
                  ]}
                  onPress={() => setNewCategory(cat)}
                >
                  <Text
                    style={[
                      styles.catOptionText,
                      newCategory === cat && styles.catOptionTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Phần thưởng năng lượng (XP)</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              placeholder="25"
              placeholderTextColor="#9CA3AF"
              value={newXp}
              onChangeText={setNewXp}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsAddModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreateTask}>
                <Text style={styles.modalSubmitText}>Tạo Nhiệm Vụ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

function getCategoryStyle(category: TaskItem['category']) {
  switch (category) {
    case 'Daily':
      return { backgroundColor: '#DBEAFE' };
    case 'Power':
      return { backgroundColor: '#FEE2E2' };
    case 'Focus':
      return { backgroundColor: '#FEF3C7' };
    case 'Health':
      return { backgroundColor: '#D1FAE5' };
    default:
      return { backgroundColor: '#F3F4F6' };
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  appSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  energyCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  energyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  energyLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  energyValue: {
    fontSize: 26,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  energyUnit: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  streakText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStatText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  progressPercentText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  listContent: {
    paddingBottom: 24,
    gap: 10,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  taskCardCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 6,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  xpBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  deleteBtn: {
    padding: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    marginTop: 10,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 220,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
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
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  catOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  catOptionActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  catOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  catOptionTextActive: {
    color: '#2563EB',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
  modalSubmitBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
