import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Clock, Tag, MapPin } from 'lucide-react';
import SearchEngine from '../utils/searchEngine';

interface SearchComponentProps {
  onSearch: (query: string, filters: any) => void;
  placeholder?: string;
  items?: any[];
}

export default function SearchComponent({ onSearch, placeholder = "搜索...", items = [] }: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    location: '',
    sortBy: 'relevance'
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const searchEngine = SearchEngine.getInstance();

  useEffect(() => {
    // 从localStorage加载搜索历史
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // 实时搜索建议
  useEffect(() => {
    if (query.length > 1 && items.length > 0) {
      const newSuggestions = searchEngine.getSuggestions(items, query, 5);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, items, searchEngine]);
  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // 添加到搜索历史
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      onSearch(searchQuery, { ...filters, fuzzy: true });
      setShowSuggestions(false);
    }
  };

  const clearFilters = () => {
    setFilters({ category: '', status: '', location: '', sortBy: 'relevance' });
    setQuery('');
    onSearch('', { category: '', status: '', location: '', sortBy: 'relevance' });
  };

  return (
    <div className="relative">
      {/* 主搜索框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          onFocus={() => query.length > 1 && setShowSuggestions(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-lg transition-colors ${
              showFilters ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            <Filter className="h-3 w-3" />
          </button>
          <button
            onClick={() => handleSearch(query)}
            className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Search className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 搜索建议 */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-20">
          <div className="p-3 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">搜索建议</span>
          </div>
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(suggestion);
                  handleSearch(suggestion);
                }}
                className="w-full flex items-center space-x-2 p-2 text-left hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Search className="h-3 w-3 text-blue-500" />
                <span className="text-sm text-gray-700">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 搜索历史 */}
      {query === '' && searchHistory.length > 0 && !showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
          <div className="p-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">最近搜索</span>
              <button
                onClick={() => {
                  setSearchHistory([]);
                  localStorage.removeItem('searchHistory');
                }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                清除
              </button>
            </div>
          </div>
          <div className="p-2">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(item);
                  handleSearch(item);
                }}
                className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-sm text-gray-700">{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 高级筛选 */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-10 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-gray-900">筛选条件</span>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">分类</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部分类</option>
                <option value="电子设备">电子设备</option>
                <option value="书籍">书籍</option>
                <option value="衣物">衣物</option>
                <option value="厨具">厨具</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">状态</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">全部状态</option>
                <option value="在用">在用</option>
                <option value="闲置">闲置</option>
                <option value="借出">借出</option>
                <option value="维修中">维修中</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">排序方式</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="relevance">相关性</option>
                <option value="date">添加时间</option>
                <option value="name">名称</option>
                <option value="usage">使用频率</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-between mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              清除筛选
            </button>
            <button
              onClick={() => {
                onSearch(query, filters);
                setShowFilters(false);
              }}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              应用筛选
            </button>
          </div>
        </div>
      )}
    </div>
  );
}