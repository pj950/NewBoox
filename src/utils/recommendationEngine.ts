// 智能推荐引擎
import DataManager from './dataManager';

export interface Recommendation {
  type: 'item' | 'location' | 'organization' | 'maintenance';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  data: any;
  confidence: number;
  reasons: string[];
  actionable: boolean;
  estimatedTime?: string;
}

class RecommendationEngine {
  private static instance: RecommendationEngine;
  
  static getInstance(): RecommendationEngine {
    if (!RecommendationEngine.instance) {
      RecommendationEngine.instance = new RecommendationEngine();
    }
    return RecommendationEngine.instance;
  }

  private dataManager = DataManager.getInstance();

  // 获取所有推荐
  getAllRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    recommendations.push(...this.getUsageRecommendations());
    recommendations.push(...this.getOrganizationRecommendations());
    recommendations.push(...this.getMaintenanceRecommendations());
    recommendations.push(...this.getLocationRecommendations());
    
    // 按优先级和置信度排序
    return recommendations.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityWeight[a.priority];
      const bPriority = priorityWeight[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.confidence - a.confidence;
    });
  }

  // 基于使用模式的推荐
  private getUsageRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const items = this.dataManager.getItems();
    const usageHistory = JSON.parse(localStorage.getItem('usageHistory') || '[]');
    
    // 分析使用频率
    const usageCount = new Map<string, number>();
    const lastUsed = new Map<string, Date>();
    
    usageHistory.forEach((record: any) => {
      const itemId = record.itemId;
      usageCount.set(itemId, (usageCount.get(itemId) || 0) + 1);
      
      const recordDate = new Date(record.timestamp);
      if (!lastUsed.has(itemId) || recordDate > lastUsed.get(itemId)!) {
        lastUsed.set(itemId, recordDate);
      }
    });
    
    // 推荐经常使用的物品
    const frequentItems = Array.from(usageCount.entries())
      .filter(([_, count]) => count >= 5)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    frequentItems.forEach(([itemId, count]) => {
      const item = items.find(i => i.id === itemId);
      if (item) {
        recommendations.push({
          type: 'item',
          title: '常用物品优化',
          description: `"${item.name}" 使用频率很高，建议放在更便于取用的位置`,
          priority: 'medium',
          category: '使用优化',
          data: { item, usageCount: count },
          confidence: Math.min(count / 10, 1),
          reasons: [`使用了${count}次`, '属于高频使用物品'],
          actionable: true,
          estimatedTime: '5分钟'
        });
      }
    });
    
    // 推荐长期未使用的物品
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    
    const unusedItems = items.filter(item => {
      const itemLastUsed = lastUsed.get(item.id);
      return !itemLastUsed || itemLastUsed < threeMonthsAgo;
    }).slice(0, 5);
    
    if (unusedItems.length > 0) {
      recommendations.push({
        type: 'maintenance',
        title: '清理建议',
        description: `发现${unusedItems.length}件长期未使用的物品，建议整理或处理`,
        priority: 'low',
        category: '空间优化',
        data: { items: unusedItems },
        confidence: 0.8,
        reasons: ['超过3个月未使用', '可能不再需要'],
        actionable: true,
        estimatedTime: '30分钟'
      });
    }
    
    return recommendations;
  }

  // 整理建议
  private getOrganizationRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const warehouses = this.dataManager.getWarehouses();
    const boxes = this.dataManager.getBoxes();
    const items = this.dataManager.getItems();
    
    // 检查容量利用率
    warehouses.forEach(warehouse => {
      const warehouseBoxes = boxes.filter(box => box.warehouseId === warehouse.id);
      const warehouseItems = items.filter(item => item.warehouseId === warehouse.id);
      const totalCapacity = warehouseBoxes.reduce((sum, box) => sum + box.capacity, 0);
      const utilizationRate = totalCapacity > 0 ? warehouseItems.length / totalCapacity : 0;
      
      if (utilizationRate > 0.9) {
        recommendations.push({
          type: 'organization',
          title: '容量预警',
          description: `仓库"${warehouse.name}"使用率已达${Math.round(utilizationRate * 100)}%，建议扩容或整理`,
          priority: 'high',
          category: '容量管理',
          data: { warehouse, utilizationRate },
          confidence: 0.9,
          reasons: ['容量接近上限', '可能影响使用效率'],
          actionable: true,
          estimatedTime: '1小时'
        });
      } else if (utilizationRate < 0.3 && warehouseItems.length > 0) {
        recommendations.push({
          type: 'organization',
          title: '空间优化',
          description: `仓库"${warehouse.name}"使用率较低(${Math.round(utilizationRate * 100)}%)，可以合并或重新规划`,
          priority: 'low',
          category: '空间优化',
          data: { warehouse, utilizationRate },
          confidence: 0.7,
          reasons: ['空间利用率低', '可以优化布局'],
          actionable: true,
          estimatedTime: '45分钟'
        });
      }
    });
    
    // 检查分类建议
    const categoryStats = this.analyzeCategoryDistribution();
    Object.entries(categoryStats).forEach(([category, data]) => {
      if (data.scattered && data.count > 3) {
        recommendations.push({
          type: 'organization',
          title: '分类整理建议',
          description: `"${category}"类物品分散在${data.locations}个位置，建议集中存放`,
          priority: 'medium',
          category: '分类优化',
          data: { category, ...data },
          confidence: 0.8,
          reasons: ['同类物品分散', '不便于查找和管理'],
          actionable: true,
          estimatedTime: '20分钟'
        });
      }
    });
    
    return recommendations;
  }

  // 维护建议
  private getMaintenanceRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const items = this.dataManager.getItems();
    
    // 检查保修期
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    items.forEach(item => {
      // 从描述中提取保修期信息
      const warrantyMatch = item.description.match(/保修.*?(\d{4}-\d{2}-\d{2})/);
      if (warrantyMatch) {
        const warrantyDate = new Date(warrantyMatch[1]);
        
        if (warrantyDate > now && warrantyDate <= thirtyDaysFromNow) {
          recommendations.push({
            type: 'maintenance',
            title: '保修期提醒',
            description: `"${item.name}"的保修期将在${warrantyDate.toLocaleDateString()}到期`,
            priority: 'high',
            category: '保修管理',
            data: { item, warrantyDate },
            confidence: 1.0,
            reasons: ['保修期即将到期', '需要及时处理'],
            actionable: true,
            estimatedTime: '检查状态'
          });
        }
      }
    });
    
    // 检查需要维护的物品
    const maintenanceItems = items.filter(item => item.status === '维修中');
    if (maintenanceItems.length > 0) {
      recommendations.push({
        type: 'maintenance',
        title: '维修跟进',
        description: `有${maintenanceItems.length}件物品正在维修中，建议跟进维修进度`,
        priority: 'medium',
        category: '维修管理',
        data: { items: maintenanceItems },
        confidence: 0.9,
        reasons: ['有物品在维修', '需要跟进状态'],
        actionable: true,
        estimatedTime: '联系维修方'
      });
    }
    
    return recommendations;
  }

  // 位置建议
  private getLocationRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const items = this.dataManager.getItems();
    const usageHistory = JSON.parse(localStorage.getItem('usageHistory') || '[]');
    
    // 分析使用地点和存放地点的关系
    const locationAnalysis = this.analyzeLocationUsage(items, usageHistory);
    
    locationAnalysis.forEach(analysis => {
      if (analysis.mismatchScore > 0.7) {
        recommendations.push({
          type: 'location',
          title: '位置优化建议',
          description: `"${analysis.item.name}"经常在${analysis.usageLocation}使用，但存放在${analysis.storageLocation}`,
          priority: 'medium',
          category: '位置优化',
          data: analysis,
          confidence: analysis.mismatchScore,
          reasons: ['使用地点与存放地点不匹配', '可以提高使用效率'],
          actionable: true,
          estimatedTime: '移动物品'
        });
      }
    });
    
    return recommendations;
  }

  // 分析分类分布
  private analyzeCategoryDistribution(): Record<string, any> {
    const items = this.dataManager.getItems();
    const categoryStats: Record<string, any> = {};
    
    items.forEach(item => {
      const category = item.category;
      if (!categoryStats[category]) {
        categoryStats[category] = {
          count: 0,
          locations: new Set<string>(),
          items: []
        };
      }
      
      categoryStats[category].count++;
      categoryStats[category].locations.add(item.location);
      categoryStats[category].items.push(item);
    });
    
    // 判断是否分散
    Object.keys(categoryStats).forEach(category => {
      const data = categoryStats[category];
      data.locations = data.locations.size;
      data.scattered = data.locations > 2 && data.count > 3;
    });
    
    return categoryStats;
  }

  // 分析位置使用情况
  private analyzeLocationUsage(items: any[], usageHistory: any[]): any[] {
    const analysis: any[] = [];
    
    // 这里可以根据使用记录分析物品的使用地点
    // 由于当前没有使用地点数据，这里提供一个框架
    items.forEach(item => {
      const itemUsage = usageHistory.filter(record => record.itemId === item.id);
      
      if (itemUsage.length > 5) {
        // 模拟分析：如果是电子设备且存放在储物间，但经常使用，建议移到办公室
        if (item.category === '电子设备' && item.location.includes('储物间')) {
          analysis.push({
            item,
            storageLocation: item.location,
            usageLocation: '办公室',
            mismatchScore: 0.8,
            usageCount: itemUsage.length
          });
        }
      }
    });
    
    return analysis;
  }

  // 获取个性化推荐
  getPersonalizedRecommendations(limit: number = 5): Recommendation[] {
    const allRecommendations = this.getAllRecommendations();
    
    // 根据用户行为调整推荐权重
    const userPreferences = this.getUserPreferences();
    
    const weightedRecommendations = allRecommendations.map(rec => ({
      ...rec,
      adjustedConfidence: rec.confidence * (userPreferences[rec.category] || 1)
    }));
    
    return weightedRecommendations
      .sort((a, b) => b.adjustedConfidence - a.adjustedConfidence)
      .slice(0, limit);
  }

  // 获取用户偏好
  private getUserPreferences(): Record<string, number> {
    // 基于用户历史行为分析偏好
    const preferences: Record<string, number> = {
      '使用优化': 1.2,
      '容量管理': 1.1,
      '分类优化': 1.0,
      '空间优化': 0.9,
      '位置优化': 1.1,
      '保修管理': 1.3,
      '维修管理': 1.2
    };
    
    return preferences;
  }

  // 标记推荐为已处理
  markRecommendationAsHandled(recommendationId: string): void {
    const handledRecommendations = JSON.parse(localStorage.getItem('handledRecommendations') || '[]');
    handledRecommendations.push({
      id: recommendationId,
      handledAt: new Date().toISOString()
    });
    localStorage.setItem('handledRecommendations', JSON.stringify(handledRecommendations));
  }

  // 获取推荐统计
  getRecommendationStats() {
    const recommendations = this.getAllRecommendations();
    const categories = recommendations.reduce((acc, rec) => {
      acc[rec.category] = (acc[rec.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const priorities = recommendations.reduce((acc, rec) => {
      acc[rec.priority] = (acc[rec.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: recommendations.length,
      categories,
      priorities,
      actionable: recommendations.filter(r => r.actionable).length,
      averageConfidence: recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length
    };
  }
}

export default RecommendationEngine;