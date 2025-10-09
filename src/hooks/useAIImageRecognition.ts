import { useState } from 'react';

export interface AIRecognitionResult {
  name: string;
  category: string;
  brand?: string;
  model?: string;
  tags: string[];
  description: string;
  confidence: number;
  specifications?: Record<string, string>;
}

// 物品识别数据库
const ITEM_DATABASE = {
  // 电子设备特征词
  electronics: {
    keywords: ['macbook', 'iphone', 'ipad', 'laptop', 'phone', 'tablet', 'computer', 'mouse', 'keyboard', 'headphone', 'earphone', 'camera', 'monitor', 'screen'],
    brands: ['apple', 'samsung', 'sony', 'dell', 'hp', 'lenovo', 'asus', 'canon', 'nikon'],
    category: '电子设备'
  },
  // 书籍特征词
  books: {
    keywords: ['book', 'novel', 'guide', 'manual', 'textbook', '指南', '手册', '教程'],
    brands: ['机械工业出版社', '人民邮电出版社', '清华大学出版社'],
    category: '书籍'
  },
  // 衣物特征词
  clothing: {
    keywords: ['shirt', 'pants', 'dress', 'jacket', 'shoes', 'sneakers', 'boots', 't-shirt'],
    brands: ['nike', 'adidas', 'uniqlo', 'zara', 'h&m'],
    category: '衣物'
  },
  // 厨具特征词
  kitchen: {
    keywords: ['cup', 'mug', 'plate', 'bowl', 'knife', 'fork', 'spoon', 'pot', 'pan'],
    brands: ['ikea', 'zwilling', 'wmf'],
    category: '厨具'
  }
};

// 模拟的AI识别服务
class AIRecognitionService {
  private analyzeImageContent(file: File): Promise<string[]> {
    return new Promise((resolve) => {
      // 模拟从文件名和类型中提取特征
      const fileName = file.name.toLowerCase();
      const features: string[] = [];
      
      // 从文件名中提取可能的特征词
      Object.values(ITEM_DATABASE).forEach(category => {
        category.keywords.forEach(keyword => {
          if (fileName.includes(keyword)) {
            features.push(keyword);
          }
        });
        category.brands.forEach(brand => {
          if (fileName.includes(brand.toLowerCase())) {
            features.push(brand);
          }
        });
      });
      
      // 如果没有从文件名提取到特征，随机选择一些
      if (features.length === 0) {
        const allKeywords = Object.values(ITEM_DATABASE).flatMap(cat => cat.keywords);
        const randomKeyword = allKeywords[Math.floor(Math.random() * allKeywords.length)];
        features.push(randomKeyword);
      }
      
      setTimeout(() => resolve(features), 1500);
    });
  }

  private matchCategory(features: string[]): { category: string; confidence: number } {
    let bestMatch = { category: '其他', confidence: 0.3 };
    
    Object.entries(ITEM_DATABASE).forEach(([key, data]) => {
      const matchCount = features.filter(feature => 
        data.keywords.some(keyword => keyword.includes(feature) || feature.includes(keyword)) ||
        data.brands.some(brand => brand.toLowerCase().includes(feature) || feature.includes(brand.toLowerCase()))
      ).length;
      
      const confidence = Math.min(0.95, 0.4 + (matchCount * 0.2));
      
      if (confidence > bestMatch.confidence) {
        bestMatch = { category: data.category, confidence };
      }
    });
    
    return bestMatch;
  }

  private generateItemName(features: string[], category: string): string {
    const categoryMap: Record<string, string[]> = {
      '电子设备': ['MacBook Pro', 'iPhone 15', 'iPad Air', '无线鼠标', '机械键盘', '蓝牙耳机', '显示器'],
      '书籍': ['JavaScript权威指南', 'Python编程', '设计模式', '算法导论', '深入理解计算机系统'],
      '衣物': ['休闲T恤', '牛仔裤', '运动鞋', '连帽衫', '商务衬衫'],
      '厨具': ['不锈钢水杯', '陶瓷餐具', '平底锅', '保温饭盒', '咖啡杯'],
      '其他': ['收纳盒', '文件夹', '笔记本', '台灯', '装饰品']
    };
    
    const items = categoryMap[category] || categoryMap['其他'];
    
    // 尝试根据特征匹配更精确的名称
    for (const feature of features) {
      const matchedItem = items.find(item => 
        item.toLowerCase().includes(feature) || feature.includes(item.toLowerCase())
      );
      if (matchedItem) return matchedItem;
    }
    
    // 随机选择一个
    return items[Math.floor(Math.random() * items.length)];
  }

  private generateTags(features: string[], category: string): string[] {
    const baseTags = features.slice(0, 3);
    const categoryTags: Record<string, string[]> = {
      '电子设备': ['数码', '科技', '便携', '智能'],
      '书籍': ['学习', '知识', '阅读', '教育'],
      '衣物': ['时尚', '舒适', '日常', '品质'],
      '厨具': ['实用', '家居', '烹饪', '生活'],
      '其他': ['实用', '收纳', '整理', '便利']
    };
    
    const additionalTags = categoryTags[category] || categoryTags['其他'];
    const selectedAdditional = additionalTags.slice(0, 2);
    
    return [...new Set([...baseTags, ...selectedAdditional])];
  }

  async recognizeItem(file: File): Promise<AIRecognitionResult> {
    // 分析图像内容
    const features = await this.analyzeImageContent(file);
    
    // 匹配分类
    const { category, confidence } = this.matchCategory(features);
    
    // 生成物品名称
    const name = this.generateItemName(features, category);
    
    // 生成标签
    const tags = this.generateTags(features, category);
    
    // 生成描述
    const description = `AI识别：这是一个${category}类物品，建议分类为${category}进行管理。`;
    
    // 生成规格信息（根据分类）
    const specifications = this.generateSpecifications(category, name);
    
    return {
      name,
      category,
      brand: features.find(f => Object.values(ITEM_DATABASE).some(cat => 
        cat.brands.some(brand => brand.toLowerCase().includes(f))
      )),
      tags,
      description,
      confidence,
      specifications
    };
  }

  private generateSpecifications(category: string, name: string): Record<string, string> {
    const specs: Record<string, Record<string, string>> = {
      '电子设备': {
        '品牌': 'Apple',
        '型号': 'MacBook Pro 16"',
        '颜色': '深空灰色',
        '存储': '512GB',
        '内存': '16GB'
      },
      '书籍': {
        '作者': '未知',
        '出版社': '机械工业出版社',
        '页数': '约500页',
        '语言': '中文',
        '版本': '第1版'
      },
      '衣物': {
        '尺码': 'M',
        '材质': '棉质',
        '颜色': '黑色',
        '季节': '四季',
        '风格': '休闲'
      },
      '厨具': {
        '材质': '不锈钢',
        '容量': '500ml',
        '颜色': '银色',
        '品牌': 'IKEA',
        '产地': '中国'
      }
    };
    
    return specs[category] || { '类型': category };
  }
}

export function useAIImageRecognition() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const aiService = new AIRecognitionService();

  const analyzeImage = async (imageFile: File): Promise<AIRecognitionResult | null> => {
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      // 验证文件类型
      if (!imageFile.type.startsWith('image/')) {
        throw new Error('请选择有效的图片文件');
      }

      // 验证文件大小（限制为5MB）
      if (imageFile.size > 5 * 1024 * 1024) {
        throw new Error('图片文件过大，请选择小于5MB的图片');
      }

      // 调用AI识别服务
      const recognitionResult = await aiService.recognizeItem(imageFile);
      
      setResult(recognitionResult);
      return recognitionResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '图片识别失败，请重试';
      setError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
  };

  return {
    isAnalyzing,
    result,
    error,
    analyzeImage,
    reset
  };
}