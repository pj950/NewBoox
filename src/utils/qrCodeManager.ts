// QR码管理器
import DataManager from './dataManager';

export interface QRCodeData {
  type: 'item' | 'box' | 'warehouse';
  id: string;
  name: string;
  location?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

class QRCodeManager {
  private static instance: QRCodeManager;
  
  static getInstance(): QRCodeManager {
    if (!QRCodeManager.instance) {
      QRCodeManager.instance = new QRCodeManager();
    }
    return QRCodeManager.instance;
  }

  private dataManager = DataManager.getInstance();

  // 生成QR码数据
  generateQRData(type: 'item' | 'box' | 'warehouse', id: string): QRCodeData | null {
    let entity;
    let location = '';
    
    switch (type) {
      case 'item':
        entity = this.dataManager.getItems().find(item => item.id === id);
        if (entity) {
          location = entity.location;
        }
        break;
      case 'box':
        entity = this.dataManager.getBoxes().find(box => box.id === id);
        if (entity) {
          const warehouse = this.dataManager.getWarehouses().find(w => w.id === entity.warehouseId);
          location = warehouse ? `${warehouse.name} > ${entity.name}` : entity.name;
        }
        break;
      case 'warehouse':
        entity = this.dataManager.getWarehouses().find(warehouse => warehouse.id === id);
        if (entity) {
          location = entity.name;
        }
        break;
    }
    
    if (!entity) return null;
    
    return {
      type,
      id,
      name: entity.name,
      location,
      metadata: {
        description: entity.description,
        gradient: entity.gradient,
        ...(type === 'item' && {
          category: (entity as any).category,
          status: (entity as any).status,
          tags: (entity as any).tags
        })
      },
      createdAt: new Date().toISOString()
    };
  }

  // 生成QR码URL（使用在线QR码生成服务）
  generateQRCodeURL(data: QRCodeData, size: number = 200): string {
    const jsonData = JSON.stringify(data);
    const encodedData = encodeURIComponent(jsonData);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}`;
  }

  // 解析QR码数据
  parseQRData(qrString: string): QRCodeData | null {
    try {
      const data = JSON.parse(qrString);
      
      // 验证数据格式
      if (!data.type || !data.id || !data.name) {
        return null;
      }
      
      // 验证类型
      if (!['item', 'box', 'warehouse'].includes(data.type)) {
        return null;
      }
      
      return data as QRCodeData;
    } catch (error) {
      // 如果不是JSON格式，可能是简单的ID或URL
      return this.parseSimpleQRData(qrString);
    }
  }

  // 解析简单格式的QR码（如纯ID或URL）
  private parseSimpleQRData(qrString: string): QRCodeData | null {
    // 尝试从URL中提取信息
    if (qrString.startsWith('http')) {
      const url = new URL(qrString);
      const pathParts = url.pathname.split('/');
      
      // 假设URL格式为 /item/123 或 /box/456
      if (pathParts.length >= 3) {
        const type = pathParts[1] as 'item' | 'box' | 'warehouse';
        const id = pathParts[2];
        
        if (['item', 'box', 'warehouse'].includes(type)) {
          return this.generateQRData(type, id);
        }
      }
    }
    
    // 尝试作为纯ID处理，先查找物品
    const item = this.dataManager.getItems().find(item => 
      item.id === qrString || 
      item.name.toLowerCase().includes(qrString.toLowerCase())
    );
    
    if (item) {
      return this.generateQRData('item', item.id);
    }
    
    return null;
  }

  // 处理扫码结果
  handleQRScan(qrString: string): {
    success: boolean;
    data?: QRCodeData;
    entity?: any;
    suggestions?: any[];
    error?: string;
  } {
    const qrData = this.parseQRData(qrString);
    
    if (!qrData) {
      // 如果无法解析，尝试模糊搜索
      const suggestions = this.searchByQRString(qrString);
      return {
        success: false,
        suggestions,
        error: suggestions.length > 0 ? '未找到精确匹配，以下是相关建议' : '无法识别此QR码'
      };
    }
    
    // 验证实体是否存在
    let entity;
    switch (qrData.type) {
      case 'item':
        entity = this.dataManager.getItems().find(item => item.id === qrData.id);
        break;
      case 'box':
        entity = this.dataManager.getBoxes().find(box => box.id === qrData.id);
        break;
      case 'warehouse':
        entity = this.dataManager.getWarehouses().find(warehouse => warehouse.id === qrData.id);
        break;
    }
    
    if (!entity) {
      return {
        success: false,
        error: '扫描的物品不存在，可能已被删除'
      };
    }
    
    // 记录扫码历史
    this.recordScanHistory(qrData);
    
    return {
      success: true,
      data: qrData,
      entity
    };
  }

  // 根据QR字符串搜索相关物品
  private searchByQRString(qrString: string): any[] {
    const items = this.dataManager.getItems();
    const boxes = this.dataManager.getBoxes();
    const warehouses = this.dataManager.getWarehouses();
    
    const query = qrString.toLowerCase();
    const suggestions: any[] = [];
    
    // 搜索物品
    items.forEach(item => {
      if (item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some(tag => tag.toLowerCase().includes(query))) {
        suggestions.push({
          type: 'item',
          entity: item,
          matchReason: '名称或描述匹配'
        });
      }
    });
    
    // 搜索盒子
    boxes.forEach(box => {
      if (box.name.toLowerCase().includes(query) ||
          box.description.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'box',
          entity: box,
          matchReason: '盒子名称匹配'
        });
      }
    });
    
    // 搜索仓库
    warehouses.forEach(warehouse => {
      if (warehouse.name.toLowerCase().includes(query) ||
          warehouse.description.toLowerCase().includes(query)) {
        suggestions.push({
          type: 'warehouse',
          entity: warehouse,
          matchReason: '仓库名称匹配'
        });
      }
    });
    
    return suggestions.slice(0, 5); // 最多返回5个建议
  }

  // 记录扫码历史
  private recordScanHistory(qrData: QRCodeData): void {
    const history = JSON.parse(localStorage.getItem('qrScanHistory') || '[]');
    
    const scanRecord = {
      ...qrData,
      scannedAt: new Date().toISOString()
    };
    
    // 避免重复记录（同一物品在1分钟内的扫码）
    const recentScan = history.find((record: any) => 
      record.id === qrData.id && 
      record.type === qrData.type &&
      new Date().getTime() - new Date(record.scannedAt).getTime() < 60000
    );
    
    if (!recentScan) {
      history.unshift(scanRecord);
      
      // 只保留最近100条记录
      if (history.length > 100) {
        history.splice(100);
      }
      
      localStorage.setItem('qrScanHistory', JSON.stringify(history));
    }
  }

  // 获取扫码历史
  getScanHistory(): any[] {
    return JSON.parse(localStorage.getItem('qrScanHistory') || '[]');
  }

  // 清除扫码历史
  clearScanHistory(): void {
    localStorage.removeItem('qrScanHistory');
  }

  // 批量生成QR码
  generateBatchQRCodes(type: 'item' | 'box' | 'warehouse', ids: string[]): Array<{
    id: string;
    name: string;
    qrData: QRCodeData;
    qrUrl: string;
  }> {
    return ids.map(id => {
      const qrData = this.generateQRData(type, id);
      if (!qrData) return null;
      
      return {
        id,
        name: qrData.name,
        qrData,
        qrUrl: this.generateQRCodeURL(qrData)
      };
    }).filter(Boolean) as Array<{
      id: string;
      name: string;
      qrData: QRCodeData;
      qrUrl: string;
    }>;
  }

  // 导出QR码数据
  exportQRCodes(type: 'item' | 'box' | 'warehouse'): string {
    let entities: any[] = [];
    
    switch (type) {
      case 'item':
        entities = this.dataManager.getItems();
        break;
      case 'box':
        entities = this.dataManager.getBoxes();
        break;
      case 'warehouse':
        entities = this.dataManager.getWarehouses();
        break;
    }
    
    const qrCodes = entities.map(entity => {
      const qrData = this.generateQRData(type, entity.id);
      return {
        ...qrData,
        qrUrl: qrData ? this.generateQRCodeURL(qrData) : null
      };
    }).filter(Boolean);
    
    return JSON.stringify(qrCodes, null, 2);
  }
}

export default QRCodeManager;