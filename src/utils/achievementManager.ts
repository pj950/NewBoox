// 成就系统管理器
import DataManager from './dataManager';
import CommunityManager from './communityManager';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'collection' | 'usage' | 'organization' | 'social' | 'efficiency';
  icon: string;
  points: number;
  requirements: {
    type: 'count' | 'streak' | 'percentage' | 'time' | 'custom';
    target: number;
    field?: string;
    condition?: string;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  hidden?: boolean;
}

export interface UserProgress {
  totalItems: number;
  totalWarehouses: number;
  totalBoxes: number;
  consecutiveDays: number;
  itemsAddedThisMonth: number;
  itemsUsedThisMonth: number;
  postsCreated: number;
  likesReceived: number;
  commentsReceived: number;
  organizationScore: number;
  efficiencyScore: number;
  lastActiveDate: string;
}

class AchievementManager {
  private static instance: AchievementManager;
  
  static getInstance(): AchievementManager {
    if (!AchievementManager.instance) {
      AchievementManager.instance = new AchievementManager();
    }
    return AchievementManager.instance;
  }

  private achievements: Achievement[] = [
    {
      id: 'first_item',
      name: '初次收纳',
      description: '添加第一个物品',
      category: 'collection',
      icon: '📦',
      points: 10,
      requirements: { type: 'count', target: 1, field: 'totalItems' },
      unlocked: false,
      progress: 0
    },
    {
      id: 'collector_bronze',
      name: '收纳新手',
      description: '管理50件物品',
      category: 'collection',
      icon: '🥉',
      points: 50,
      requirements: { type: 'count', target: 50, field: 'totalItems' },
      unlocked: false,
      progress: 0
    },
    {
      id: 'collector_silver',
      name: '收纳达人',
      description: '管理200件物品',
      category: 'collection',
      icon: '🥈',
      points: 100,
      requirements: { type: 'count', target: 200, field: 'totalItems' },
      unlocked: false,
      progress: 0
    },
    {
      id: 'collector_gold',
      name: '收纳大师',
      description: '管理500件物品',
      category: 'collection',
      icon: '🥇',
      points: 200,
      requirements: { type: 'count', target: 500, field: 'totalItems' },
      unlocked: false,
      progress: 0
    },
    {
      id: 'organizer_bronze',
      name: '整理新手',
      description: '创建5个仓库',
      category: 'organization',
      icon: '🏠',
      points: 30,
      requirements: { type: 'count', target: 5, field: 'totalWarehouses' },
      unlocked: false,
      progress: 0
    },
    {
      id: 'organizer_silver',
      name: '整理专家',
      description: '创建15个仓库',
      category: 'organization',
      icon: '🏢',
      points: 75,
      requirements: { type: 'count', target: 15, field: 'totalWarehouses' },
      unlocked: false,
      progress: 0
    },
    {
      id: 'efficiency_master',
      name: '效率专家',
      description: '连续使用30天',
      category: 'efficiency',
      icon: '⚡',
      points: 150,
      requirements: { type: 'streak', target: 30, field: 'consecutiveDays' },
      unlocked: false,
      progress: 0
    },
    {
      id: 'social_butterfly',
      name: '社交达人',
      description: '发布10个帖子',
      category: 'social',
      icon: '🦋',
      points: 80,
      requirements: { type: 'count', target: 10, field: 'postsCreated' },
      unlocked: false,
      progress: 0
    },
    {
      id: 'popular_user',
      name: '人气用户',
      description: '获得100个赞',
      category: 'social',
      icon: '⭐',
      points: 120,
      requirements: { type: 'count', target: 100, field: 'likesReceived' },
      unlocked: false,
      progress: 0
    },
    {
      id: 'active_user',
      name: '活跃用户',
      description: '本月使用物品超过50次',
      category: 'usage',
      icon: '🔥',
      points: 60,
      requirements: { type: 'count', target: 50, field: 'itemsUsedThisMonth' },
      unlocked: false,
      progress: 0
    }
  ];

  // 获取所有成就
  getAchievements(): Achievement[] {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      this.achievements = JSON.parse(saved);
    }
    return this.achievements;
  }

  // 保存成就数据
  private saveAchievements(): void {
    localStorage.setItem('achievements', JSON.stringify(this.achievements));
  }

  // 获取用户进度
  getUserProgress(): UserProgress {
    const dataManager = DataManager.getInstance();
    const communityManager = CommunityManager.getInstance();
    
    const warehouses = dataManager.getWarehouses();
    const boxes = dataManager.getBoxes();
    const items = dataManager.getItems();
    const posts = communityManager.getPosts();
    const currentUser = communityManager.getCurrentUser();
    
    // 计算本月数据
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const itemsAddedThisMonth = items.filter(item => {
      const addedDate = new Date(item.addedDate);
      return addedDate.getMonth() === thisMonth && addedDate.getFullYear() === thisYear;
    }).length;
    
    // 计算使用次数（从使用历史中获取）
    const usageHistory = JSON.parse(localStorage.getItem('usageHistory') || '[]');
    const itemsUsedThisMonth = usageHistory.filter((record: any) => {
      const usedDate = new Date(record.timestamp);
      return usedDate.getMonth() === thisMonth && usedDate.getFullYear() === thisYear;
    }).length;
    
    // 计算连续使用天数
    const consecutiveDays = this.calculateConsecutiveDays();
    
    // 计算社交数据
    const userPosts = posts.filter(post => post.userId === currentUser.id);
    const likesReceived = userPosts.reduce((sum, post) => sum + post.likes, 0);
    const commentsReceived = userPosts.reduce((sum, post) => sum + post.comments, 0);
    
    return {
      totalItems: items.length,
      totalWarehouses: warehouses.length,
      totalBoxes: boxes.length,
      consecutiveDays,
      itemsAddedThisMonth,
      itemsUsedThisMonth,
      postsCreated: userPosts.length,
      likesReceived,
      commentsReceived,
      organizationScore: this.calculateOrganizationScore(),
      efficiencyScore: this.calculateEfficiencyScore(),
      lastActiveDate: new Date().toISOString()
    };
  }

  // 计算连续使用天数
  private calculateConsecutiveDays(): number {
    const usageHistory = JSON.parse(localStorage.getItem('usageHistory') || '[]');
    if (usageHistory.length === 0) return 0;
    
    const today = new Date();
    const dates = new Set<string>();
    
    usageHistory.forEach((record: any) => {
      const date = new Date(record.timestamp);
      dates.add(date.toDateString());
    });
    
    const sortedDates = Array.from(dates).sort().reverse();
    let consecutiveDays = 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (date.toDateString() === expectedDate.toDateString()) {
        consecutiveDays++;
      } else {
        break;
      }
    }
    
    return consecutiveDays;
  }

  // 计算整理分数
  private calculateOrganizationScore(): number {
    const dataManager = DataManager.getInstance();
    
    const warehouses = dataManager.getWarehouses();
    const boxes = dataManager.getBoxes();
    const items = dataManager.getItems();
    
    let score = 0;
    
    // 基础分数：每个仓库10分
    score += warehouses.length * 10;
    
    // 分类分数：每个盒子5分
    score += boxes.length * 5;
    
    // 详细程度分数：有描述的物品每个2分
    const itemsWithDescription = items.filter(item => item.description && item.description.length > 10);
    score += itemsWithDescription.length * 2;
    
    // 标签分数：有标签的物品每个1分
    const itemsWithTags = items.filter(item => item.tags && item.tags.length > 0);
    score += itemsWithTags.length * 1;
    
    return Math.min(score, 1000); // 最高1000分
  }

  // 计算效率分数
  private calculateEfficiencyScore(): number {
    const usageHistory = JSON.parse(localStorage.getItem('usageHistory') || '[]');
    const dataManager = DataManager.getInstance();
    const items = dataManager.getItems();
    
    if (items.length === 0) return 0;
    
    // 使用频率分数
    const usageScore = Math.min(usageHistory.length, 500); // 最高500分
    
    // 物品利用率分数
    const usedItems = new Set(usageHistory.map((record: any) => record.itemId));
    const utilizationRate = usedItems.size / items.length;
    const utilizationScore = Math.round(utilizationRate * 300); // 最高300分
    
    // 及时性分数：最近使用的物品越多分数越高
    const recentUsage = usageHistory.filter((record: any) => {
      const date = new Date(record.timestamp);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date > weekAgo;
    });
    const timelinessScore = Math.min(recentUsage.length * 5, 200); // 最高200分
    
    return usageScore + utilizationScore + timelinessScore;
  }

  // 检查并更新成就进度
  checkAchievements(): Achievement[] {
    const progress = this.getUserProgress();
    const unlockedAchievements: Achievement[] = [];
    
    this.achievements.forEach(achievement => {
      if (achievement.unlocked) return;
      
      const { requirements } = achievement;
      let currentValue = 0;
      
      // 获取当前值
      if (requirements.field && (progress as any)[requirements.field] !== undefined) {
        currentValue = (progress as any)[requirements.field];
      }
      
      // 计算进度百分比
      const progressPercentage = Math.min((currentValue / requirements.target) * 100, 100);
      achievement.progress = Math.round(progressPercentage);
      
      // 检查是否解锁
      if (currentValue >= requirements.target && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        unlockedAchievements.push(achievement);
      }
    });
    
    this.saveAchievements();
    return unlockedAchievements;
  }

  // 获取用户总分
  getTotalPoints(): number {
    return this.achievements
      .filter(achievement => achievement.unlocked)
      .reduce((total, achievement) => total + achievement.points, 0);
  }

  // 获取用户等级
  getUserLevel(): number {
    const totalPoints = this.getTotalPoints();
    return Math.floor(totalPoints / 100) + 1; // 每100分升一级
  }

  // 获取下一级所需分数
  getPointsToNextLevel(): number {
    const currentLevel = this.getUserLevel();
    const pointsForNextLevel = currentLevel * 100;
    const currentPoints = this.getTotalPoints();
    return pointsForNextLevel - currentPoints;
  }

  // 获取成就统计
  getAchievementStats() {
    const total = this.achievements.length;
    const unlocked = this.achievements.filter(a => a.unlocked).length;
    const categories = this.achievements.reduce((acc, achievement) => {
      acc[achievement.category] = (acc[achievement.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total,
      unlocked,
      locked: total - unlocked,
      completionRate: Math.round((unlocked / total) * 100),
      categories,
      totalPoints: this.getTotalPoints(),
      userLevel: this.getUserLevel(),
      pointsToNextLevel: this.getPointsToNextLevel()
    };
  }
}

export default AchievementManager;