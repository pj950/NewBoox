// 智能搜索引擎
export interface SearchResult {
  item: any;
  score: number;
  matchedFields: string[];
  highlights: Record<string, string>;
}

export interface SearchOptions {
  fuzzy?: boolean;
  category?: string;
  status?: string;
  location?: string;
  tags?: string[];
  sortBy?: 'relevance' | 'date' | 'name' | 'usage';
  limit?: number;
}

class SearchEngine {
  private static instance: SearchEngine;
  
  static getInstance(): SearchEngine {
    if (!SearchEngine.instance) {
      SearchEngine.instance = new SearchEngine();
    }
    return SearchEngine.instance;
  }

  // 拼音映射表（简化版）
  private pinyinMap: Record<string, string> = {
    '电': 'dian', '子': 'zi', '设': 'she', '备': 'bei',
    '书': 'shu', '籍': 'ji', '衣': 'yi', '物': 'wu',
    '厨': 'chu', '具': 'ju', '工': 'gong',
    '办': 'ban', '公': 'gong', '室': 'shi', '卧': 'wo',
    '苹': 'ping', '果': 'guo', '华': 'hua', '为': 'wei'
  };

  // 计算字符串相似度（Levenshtein距离）
  private calculateSimilarity(str1: string, str2: string): number {
    const matrix: number[][] = [];
    const len1 = str1.length;
    const len2 = str2.length;

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        if (str1.charAt(i - 1) === str2.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    const maxLen = Math.max(len1, len2);
    return maxLen === 0 ? 1 : (maxLen - matrix[len1][len2]) / maxLen;
  }

  // 转换为拼音（简化版）
  private toPinyin(text: string): string {
    return text.split('').map(char => this.pinyinMap[char] || char).join('');
  }

  // 模糊匹配
  private fuzzyMatch(query: string, text: string, threshold: number = 0.6): boolean {
    const similarity = this.calculateSimilarity(query.toLowerCase(), text.toLowerCase());
    if (similarity >= threshold) return true;

    // 拼音匹配
    const queryPinyin = this.toPinyin(query.toLowerCase());
    const textPinyin = this.toPinyin(text.toLowerCase());
    const pinyinSimilarity = this.calculateSimilarity(queryPinyin, textPinyin);
    
    return pinyinSimilarity >= threshold;
  }

  // 计算搜索得分
  private calculateScore(item: any, query: string, options: SearchOptions): number {
    let score = 0;
    const queryLower = query.toLowerCase();

    // 名称匹配（权重最高）
    if (item.name.toLowerCase().includes(queryLower)) {
      score += 10;
    } else if (options.fuzzy && this.fuzzyMatch(query, item.name, 0.7)) {
      score += 7;
    }

    // 描述匹配
    if (item.description && item.description.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // 标签匹配
    if (item.tags && Array.isArray(item.tags)) {
      const tagMatches = item.tags.filter((tag: string) => 
        tag.toLowerCase().includes(queryLower) ||
        (options.fuzzy && this.fuzzyMatch(query, tag, 0.8))
      );
      score += tagMatches.length * 3;
    }

    // 分类匹配
    if (item.category && item.category.toLowerCase().includes(queryLower)) {
      score += 4;
    }

    // 位置匹配
    if (item.location && item.location.toLowerCase().includes(queryLower)) {
      score += 3;
    }

    // 品牌匹配
    if (item.brand && item.brand.toLowerCase().includes(queryLower)) {
      score += 2;
    }

    return score;
  }

  // 生成高亮文本
  private generateHighlights(item: any, query: string): Record<string, string> {
    const highlights: Record<string, string> = {};
    const queryLower = query.toLowerCase();

    const highlightText = (text: string, query: string): string => {
      if (!text || !query) return text;
      const regex = new RegExp(`(${query})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    };

    if (item.name.toLowerCase().includes(queryLower)) {
      highlights.name = highlightText(item.name, query);
    }

    if (item.description && item.description.toLowerCase().includes(queryLower)) {
      highlights.description = highlightText(item.description, query);
    }

    return highlights;
  }

  // 主搜索方法
  search(items: any[], query: string, options: SearchOptions = {}): SearchResult[] {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];

    for (const item of items) {
      // 应用筛选条件
      if (options.category && item.category !== options.category) continue;
      if (options.status && item.status !== options.status) continue;
      if (options.location && !item.location.includes(options.location)) continue;
      
      if (options.tags && options.tags.length > 0) {
        const hasMatchingTag = options.tags.some(tag => 
          item.tags && item.tags.includes(tag)
        );
        if (!hasMatchingTag) continue;
      }

      // 计算搜索得分
      const score = this.calculateScore(item, query, options);
      
      if (score > 0) {
        const matchedFields: string[] = [];
        if (item.name.toLowerCase().includes(query.toLowerCase())) matchedFields.push('name');
        if (item.description && item.description.toLowerCase().includes(query.toLowerCase())) matchedFields.push('description');
        if (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()))) matchedFields.push('tags');

        results.push({
          item,
          score,
          matchedFields,
          highlights: this.generateHighlights(item, query)
        });
      }
    }

    // 排序
    results.sort((a, b) => {
      switch (options.sortBy) {
        case 'date':
          return new Date(b.item.addedDate).getTime() - new Date(a.item.addedDate).getTime();
        case 'name':
          return a.item.name.localeCompare(b.item.name);
        case 'usage':
          return (b.item.usageCount || 0) - (a.item.usageCount || 0);
        default:
          return b.score - a.score;
      }
    });

    // 限制结果数量
    return options.limit ? results.slice(0, options.limit) : results;
  }

  // 搜索建议
  getSuggestions(items: any[], query: string, limit: number = 5): string[] {
    if (!query.trim()) return [];

    const suggestions = new Set<string>();
    const queryLower = query.toLowerCase();

    for (const item of items) {
      // 从名称中提取建议
      if (item.name.toLowerCase().includes(queryLower)) {
        suggestions.add(item.name);
      }

      // 从标签中提取建议
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach((tag: string) => {
          if (tag.toLowerCase().includes(queryLower)) {
            suggestions.add(tag);
          }
        });
      }

      // 从分类中提取建议
      if (item.category && item.category.toLowerCase().includes(queryLower)) {
        suggestions.add(item.category);
      }
    }

    return Array.from(suggestions).slice(0, limit);
  }

  // 热门搜索词
  getPopularSearches(searchHistory: string[], limit: number = 10): string[] {
    const frequency = new Map<string, number>();
    
    searchHistory.forEach(search => {
      frequency.set(search, (frequency.get(search) || 0) + 1);
    });

    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([search]) => search);
  }
}

export default SearchEngine;