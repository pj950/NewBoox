import React, { useState, useEffect } from 'react';
import { Lightbulb, X, CheckCircle, Clock, AlertTriangle, TrendingUp, Package, MapPin, Wrench } from 'lucide-react';
import RecommendationEngine, { Recommendation } from '../utils/recommendationEngine';

interface RecommendationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecommendationPanel({ isOpen, onClose }: RecommendationPanelProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const recommendationEngine = RecommendationEngine.getInstance();

  useEffect(() => {
    if (isOpen) {
      loadRecommendations();
    }
  }, [isOpen]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const recs = recommendationEngine.getAllRecommendations();
      setRecommendations(recs);
    } catch (error) {
      console.error('加载推荐失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'item': return Package;
      case 'location': return MapPin;
      case 'organization': return TrendingUp;
      case 'maintenance': return Wrench;
      default: return Lightbulb;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertTriangle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const categories = ['all', ...new Set(recommendations.map(r => r.category))];
  const filteredRecommendations = activeCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === activeCategory);

  const handleRecommendationAction = (recommendation: Recommendation) => {
    // 这里可以根据推荐类型执行相应的操作
    console.log('执行推荐操作:', recommendation);
    
    // 标记为已处理
    recommendationEngine.markRecommendationAsHandled(recommendation.title);
    
    // 重新加载推荐
    loadRecommendations();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">智能推荐</h2>
                <p className="text-sm text-gray-600">基于使用习惯的个性化建议</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="border-b border-gray-100">
          <div className="flex space-x-1 px-6 py-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category === 'all' ? '全部' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">正在分析您的使用习惯...</p>
            </div>
          ) : filteredRecommendations.length === 0 ? (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无推荐</h3>
              <p className="text-gray-600">继续使用应用，我们会为您提供个性化建议</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecommendations.map((recommendation, index) => {
                const Icon = getIcon(recommendation.type);
                const PriorityIcon = getPriorityIcon(recommendation.priority);
                
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {recommendation.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(recommendation.priority)}`}>
                              <PriorityIcon className="h-3 w-3 mr-1" />
                              {recommendation.priority === 'high' ? '高优先级' : 
                               recommendation.priority === 'medium' ? '中优先级' : '低优先级'}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              置信度: {Math.round(recommendation.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-3 leading-relaxed">
                          {recommendation.description}
                        </p>
                        
                        {recommendation.reasons.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">推荐原因:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {recommendation.reasons.map((reason, idx) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                  {reason}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {recommendation.estimatedTime || '未知'}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                              {recommendation.category}
                            </span>
                          </div>
                          
                          {recommendation.actionable && (
                            <button
                              onClick={() => handleRecommendationAction(recommendation)}
                              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold text-sm"
                            >
                              立即处理
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isLoading && filteredRecommendations.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>共 {filteredRecommendations.length} 条推荐</span>
              <button
                onClick={loadRecommendations}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                刷新推荐
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}