import React from 'react';
import { StyleSheet, View, Text, ScrollView, DimensionValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskItem } from '../storage/appStorage';

interface SafeStatsScreenProps {
  tasks: TaskItem[];
}

interface DayStat {
  day: string;
  height: DimensionValue;
  xp: number;
  active: boolean;
}

export const SafeStatsScreen: React.FC<SafeStatsScreenProps> = ({ tasks }) => {
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const totalXp = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.xp, 0);

  // Mock weekly data for presentation
  const weeklyDays: DayStat[] = [
    { day: 'T2', height: '60%', xp: 85, active: true },
    { day: 'T3', height: '80%', xp: 120, active: true },
    { day: 'T4', height: '45%', xp: 60, active: true },
    { day: 'T5', height: '90%', xp: 140, active: true },
    { day: 'T6', height: '75%', xp: 110, active: true },
    { day: 'T7', height: '100%', xp: 160, active: true },
    { day: 'CN', height: '65%', xp: 95, active: false },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>Thống Kê Năng Lượng</Text>
        <Text style={styles.pageSubtitle}>Theo dõi chỉ số rèn luyện theo tuần</Text>
      </View>

      {/* Overview Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <View style={[styles.statIconBadge, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="trophy" size={20} color="#D97706" />
          </View>
          <Text style={styles.statBoxValue}>{totalXp}</Text>
          <Text style={styles.statBoxLabel}>Tổng Điểm XP</Text>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.statIconBadge, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="checkbox" size={20} color="#2563EB" />
          </View>
          <Text style={styles.statBoxValue}>{completedCount}/{totalCount}</Text>
          <Text style={styles.statBoxLabel}>Nhiệm Vụ Xong</Text>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.statIconBadge, { backgroundColor: '#DCFCE7' }]}>
            <Ionicons name="trending-up" size={20} color="#16A34A" />
          </View>
          <Text style={styles.statBoxValue}>94%</Text>
          <Text style={styles.statBoxLabel}>Hiệu Suất</Text>
        </View>
      </View>

      {/* Weekly Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Biểu Đồ Rèn Luyện Tuần Này</Text>
          <Text style={styles.chartSub}>Trung bình: 110 XP/ngày</Text>
        </View>

        <View style={styles.barChartRow}>
          {weeklyDays.map((item, index) => (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: item.height },
                    item.active ? styles.barFillActive : styles.barFillInactive,
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Achievements / Danh Hiệu */}
      <View style={styles.achievementsCard}>
        <Text style={styles.chartTitle}>Huy Hiệu Đạt Được</Text>

        <View style={styles.badgeItem}>
          <View style={[styles.badgeIcon, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="flame" size={22} color="#EF4444" />
          </View>
          <View style={styles.badgeTextCol}>
            <Text style={styles.badgeName}>Chiến Binh Bền Bỉ</Text>
            <Text style={styles.badgeDesc}>Hoàn thành chuỗi nhiệm vụ 7 ngày liên tục</Text>
          </View>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        </View>

        <View style={styles.badgeItem}>
          <View style={[styles.badgeIcon, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="flash" size={22} color="#F59E0B" />
          </View>
          <View style={styles.badgeTextCol}>
            <Text style={styles.badgeName}>Sức Mạnh Vượt Bậc</Text>
            <Text style={styles.badgeDesc}>Tích lũy trên 500 điểm năng lượng rèn luyện</Text>
          </View>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        </View>

        <View style={styles.badgeItem}>
          <View style={[styles.badgeIcon, { backgroundColor: '#E0E7FF' }]}>
            <Ionicons name="shield-checkmark" size={22} color="#4F46E5" />
          </View>
          <View style={styles.badgeTextCol}>
            <Text style={styles.badgeName}>Bậc Thầy Tập Trung</Text>
            <Text style={styles.badgeDesc}>Hoàn thành toàn bộ nhiệm vụ trong ngày</Text>
          </View>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        </View>
      </View>
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
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statBoxValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statBoxLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  chartHeader: {
    marginBottom: 18,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  chartSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  barChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 14,
    height: 110,
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barFillActive: {
    backgroundColor: '#2563EB',
  },
  barFillInactive: {
    backgroundColor: '#CBD5E1',
  },
  barLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 8,
  },
  achievementsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 12,
  },
  badgeIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTextCol: {
    flex: 1,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  badgeDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
