// 数据管理工具
import SearchEngine from './searchEngine';

export interface Item {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
  location: string;
  addedDate: string;
  lastUsed: string;
  tags: string[];
  image?: string;
  boxId: string;
  warehouseId: string;
}

export interface Box {
  id: string;
  name: string;
  type: string;
  gradient: string;
  capacity: number;
  description: string;
  warehouseId: string;
  image?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  type: string;
  gradient: string;
  description: string;
  image?: string;
  styleTemplate?: 'wardrobe' | 'bookshelf' | 'fridge' | 'documents' | 'album' | string;
}

class DataManager {
  private static instance: DataManager;
  
  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // 仓库管理
  getWarehouses(): Warehouse[] {
    const data = localStorage.getItem('warehouses');
    return data ? JSON.parse(data) : [];
  }

  saveWarehouse(warehouse: Warehouse): void {
    const warehouses = this.getWarehouses();
    const index = warehouses.findIndex(w => w.id === warehouse.id);
    if (index >= 0) {
      warehouses[index] = warehouse;
    } else {
      warehouses.push(warehouse);
    }
    localStorage.setItem('warehouses', JSON.stringify(warehouses));
  }

  deleteWarehouse(id: string): void {
    const warehouses = this.getWarehouses().filter(w => w.id !== id);
    localStorage.setItem('warehouses', JSON.stringify(warehouses));
    
    // 同时删除相关的盒子和物品
    const boxes = this.getBoxes().filter(b => b.warehouseId !== id);
    localStorage.setItem('boxes', JSON.stringify(boxes));
    
    const items = this.getItems().filter(i => i.warehouseId !== id);
    localStorage.setItem('items', JSON.stringify(items));
  }

  // 盒子管理
  getBoxes(): Box[] {
    const data = localStorage.getItem('boxes');
    return data ? JSON.parse(data) : [];
  }

  getBoxesByWarehouse(warehouseId: string): Box[] {
    return this.getBoxes().filter(box => box.warehouseId === warehouseId);
  }

  saveBox(box: Box): void {
    const boxes = this.getBoxes();
    const index = boxes.findIndex(b => b.id === box.id);
    if (index >= 0) {
      boxes[index] = box;
    } else {
      boxes.push(box);
    }
    localStorage.setItem('boxes', JSON.stringify(boxes));
  }

  deleteBox(id: string): void {
    const boxes = this.getBoxes().filter(b => b.id !== id);
    localStorage.setItem('boxes', JSON.stringify(boxes));
    
    // 同时删除相关的物品
    const items = this.getItems().filter(i => i.boxId !== id);
    localStorage.setItem('items', JSON.stringify(items));
  }

  // 物品管理
  getItems(): Item[] {
    const data = localStorage.getItem('items');
    return data ? JSON.parse(data) : [];
  }

  getItemsByBox(boxId: string): Item[] {
    return this.getItems().filter(item => item.boxId === boxId);
  }

  saveItem(item: Item): void {
    const items = this.getItems();
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    localStorage.setItem('items', JSON.stringify(items));
    
    // 更新位置信息
    const boxes = this.getBoxes();
    const warehouses = this.getWarehouses();
    const box = boxes.find(b => b.id === item.boxId);
    const warehouse = warehouses.find(w => w.id === item.warehouseId);
    
    if (box && warehouse) {
      item.location = `${warehouse.name} > ${box.name}`;
      items[index >= 0 ? index : items.length - 1] = item;
      localStorage.setItem('items', JSON.stringify(items));
    }
  }

  deleteItem(id: string): void {
    const items = this.getItems().filter(i => i.id !== id);
    localStorage.setItem('items', JSON.stringify(items));
  }

  // 搜索功能
  searchItems(
    query: string,
    filters: { category?: string; status?: string; location?: string; tags?: string[]; sortBy?: string; limit?: number } = {}
  ): Item[] {
    const searchEngine = SearchEngine.getInstance();
    const items = this.getItems();
    
    const searchResults = searchEngine.search(items, query, {
      fuzzy: true,
      category: filters.category,
      status: filters.status,
      location: filters.location,
      tags: filters.tags,
      sortBy: filters.sortBy || 'relevance',
      limit: filters.limit
    });
    
    return searchResults.map(result => result.item);
  }

  // 获取搜索建议
  getSearchSuggestions(query: string): string[] {
    const searchEngine = SearchEngine.getInstance();
    const items = this.getItems();
    
    return searchEngine.getSuggestions(items, query);
  }

  // 记录物品使用
  recordItemUsage(itemId: string, action: string = '使用', detail?: string): void {
    const usageHistory = JSON.parse(localStorage.getItem('usageHistory') || '[]');
    const newRecord = {
      itemId,
      action,
      detail: detail || '',
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('zh-CN')
    };
    
    usageHistory.unshift(newRecord);
    
    // 只保留最近1000条记录
    if (usageHistory.length > 1000) {
      usageHistory.splice(1000);
    }
    
    localStorage.setItem('usageHistory', JSON.stringify(usageHistory));
    
    // 更新物品的最后使用时间
    const items = this.getItems();
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex >= 0) {
      items[itemIndex].lastUsed = this.formatRelativeTime(new Date());
      localStorage.setItem('items', JSON.stringify(items));
    }
  }

  // 获取物品使用历史
  getItemUsageHistory(itemId: string): { itemId: string; action: string; detail: string; timestamp: string; date: string }[] {
    const usageHistory = JSON.parse(localStorage.getItem('usageHistory') || '[]') as { itemId: string; action: string; detail: string; timestamp: string; date: string }[];
    return usageHistory.filter((record) => record.itemId === itemId);
  }

  // 格式化相对时间
  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return `${Math.floor(diffDays / 30)}个月前`;
  }

  // 统计数据
  getStats() {
    const warehouses = this.getWarehouses();
    const boxes = this.getBoxes();
    const items = this.getItems();
    
    return {
      totalWarehouses: warehouses.length,
      totalBoxes: boxes.length,
      totalItems: items.length,
      utilizationRate: boxes.length > 0 ? Math.round((items.length / (boxes.reduce((sum, box) => sum + box.capacity, 0))) * 100) : 0,
      totalValue: this.calculateTotalValue(),
      recentlyUsed: this.getRecentlyUsedItems(5),
      categoryDistribution: this.getCategoryDistribution(),
      statusDistribution: this.getStatusDistribution()
    };
  }

  // 计算总价值
  private calculateTotalValue(): number {
    const items = this.getItems();
    return items.reduce((total, item) => {
      const price = parseFloat(item.description.match(/\d+/)?.[0] || '0') || 0;
      return total + price;
    }, 0);
  }

  // 获取最近使用的物品
  private getRecentlyUsedItems(limit: number): Item[] {
    const usageHistory = JSON.parse(localStorage.getItem('usageHistory') || '[]') as { itemId: string }[];
    const items = this.getItems();
    const recentItemIds = [...new Set(usageHistory.slice(0, limit * 2).map((record) => record.itemId))];
    
    return recentItemIds
      .map(id => items.find(item => item.id === id))
      .filter((i): i is Item => Boolean(i))
      .slice(0, limit);
  }

  // 获取分类分布
  private getCategoryDistribution(): Record<string, number> {
    const items = this.getItems();
    const distribution: Record<string, number> = {};
    
    items.forEach(item => {
      distribution[item.category] = (distribution[item.category] || 0) + 1;
    });
    
    return distribution;
  }

  // 获取状态分布
  private getStatusDistribution(): Record<string, number> {
    const items = this.getItems();
    const distribution: Record<string, number> = {};
    
    items.forEach(item => {
      distribution[item.status] = (distribution[item.status] || 0) + 1;
    });
    
    return distribution;
  }

  // 数据验证
  validateData(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      const warehouses = this.getWarehouses();
      const boxes = this.getBoxes();
      const items = this.getItems();
      
      // 验证仓库数据
      warehouses.forEach(warehouse => {
        if (!warehouse.id || !warehouse.name) {
          errors.push(`仓库数据不完整: ${warehouse.name || warehouse.id}`);
        }
      });
      
      // 验证盒子数据
      boxes.forEach(box => {
        if (!box.id || !box.name || !box.warehouseId) {
          errors.push(`盒子数据不完整: ${box.name || box.id}`);
        }
        
        const warehouse = warehouses.find(w => w.id === box.warehouseId);
        if (!warehouse) {
          errors.push(`盒子 "${box.name}" 关联的仓库不存在`);
        }
      });
      
      // 验证物品数据
      items.forEach(item => {
        if (!item.id || !item.name || !item.boxId || !item.warehouseId) {
          errors.push(`物品数据不完整: ${item.name || item.id}`);
        }
        
        const box = boxes.find(b => b.id === item.boxId);
        if (!box) {
          errors.push(`物品 "${item.name}" 关联的盒子不存在`);
        }
        
        const warehouse = warehouses.find(w => w.id === item.warehouseId);
        if (!warehouse) {
          errors.push(`物品 "${item.name}" 关联的仓库不存在`);
        }
      });
      
    } catch {
      errors.push('数据格式错误，无法解析');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 清理无效数据
  cleanupData(): void {
    const warehouses = this.getWarehouses();
    const boxes = this.getBoxes();
    const items = this.getItems();
    
    // 清理无效的盒子（关联的仓库不存在）
    const validBoxes = boxes.filter(box => 
      warehouses.some(warehouse => warehouse.id === box.warehouseId)
    );
    
    // 清理无效的物品（关联的盒子或仓库不存在）
    const validItems = items.filter(item => 
      validBoxes.some(box => box.id === item.boxId) &&
      warehouses.some(warehouse => warehouse.id === item.warehouseId)
    );
    
    // 保存清理后的数据
    localStorage.setItem('boxes', JSON.stringify(validBoxes));
    localStorage.setItem('items', JSON.stringify(validItems));
  }

  // 初始化示例数据
  initializeSampleData(): void {
    if (this.getWarehouses().length === 0) {
      // 添加示例仓库
      const sampleWarehouses: Warehouse[] = [
        {
          id: '1',
          name: '办公室',
          type: '工作区域',
          gradient: 'from-blue-500 to-cyan-500',
          description: '主要存放办公用品和电子设备',
          image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        {
          id: '2',
          name: '卧室',
          type: '生活区域',
          gradient: 'from-pink-500 to-rose-500',
          description: '个人物品和衣物存放',
          image: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ];

      sampleWarehouses.forEach(warehouse => this.saveWarehouse(warehouse));

      // 添加示例盒子
      const sampleBoxes: Box[] = [
        {
          id: '1',
          name: '电子设备盒',
          type: '电子产品',
          gradient: 'from-blue-500 to-cyan-500',
          capacity: 20,
          description: '存放各种电子设备',
          warehouseId: '1',
          image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ];

      sampleBoxes.forEach(box => this.saveBox(box));

      // 添加示例物品
      const sampleItems: Item[] = [
        {
          id: '1',
          name: 'MacBook Pro 16"',
          category: '电子设备',
          status: '在用',
          description: '主要用于日常工作和开发',
          location: '办公室 > 电子设备盒',
          addedDate: '2024-01-15',
          lastUsed: '2小时前',
          tags: ['工作', '便携', '苹果'],
          image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=400',
          boxId: '1',
          warehouseId: '1'
        }
      ];

      sampleItems.forEach(item => this.saveItem(item));
    }
  }
}

export default DataManager;