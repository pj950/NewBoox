import React, { useState } from 'react';
import { Camera, Upload, ArrowLeft, Package, MapPin, Tag, Calendar, FileText, Loader2, Check } from 'lucide-react';

interface AddItemProps {
  onNavigate: (view: string) => void;
}

export default function AddItem({ onNavigate }: AddItemProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    description: '',
    tags: '',
    purchaseDate: '',
    warrantyDate: '',
    status: '在用'
  });
  
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const categories = ['电子设备', '书籍', '文具', '衣物', '家具', '运动器材', '厨具', '工具', '其他'];
  const locations = [
    '办公室 > 电子设备',
    '卧室 > 衣柜',
    '书房 > 书架',
    '客厅 > 娱乐设备',
    '厨房 > 厨具',
    '储物间 > 杂物',
    '车库 > 工具'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        simulateAIAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAiSuggestions({
        name: 'MacBook Pro',
        category: '电子设备',
        tags: ['苹果', '笔记本', '工作'],
        description: 'AI识别：这是一台苹果笔记本电脑，建议分类为电子设备'
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const applyAISuggestions = () => {
    if (aiSuggestions) {
      setFormData(prev => ({
        ...prev,
        name: aiSuggestions.name,
        category: aiSuggestions.category,
        tags: aiSuggestions.tags.join(', '),
        description: aiSuggestions.description
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 模拟提交
    console.log('提交物品数据:', formData);
    onNavigate('items');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => onNavigate('items')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">添加新物品</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">物品照片</h2>
            
            {!image ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">上传物品照片</p>
                  <p className="text-sm text-gray-500">支持 JPG、PNG 格式，AI将自动识别物品信息</p>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img src={image} alt="上传的物品" className="w-full h-64 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                
                {isAnalyzing && (
                  <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
                    <span className="text-blue-700">AI正在分析图片...</span>
                  </div>
                )}
                
                {aiSuggestions && !isAnalyzing && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Check className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-800">AI识别完成</span>
                      </div>
                      <button
                        type="button"
                        onClick={applyAISuggestions}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                      >
                        应用建议
                      </button>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">物品名称：</span>{aiSuggestions.name}</p>
                      <p><span className="font-medium">分类：</span>{aiSuggestions.category}</p>
                      <p><span className="font-medium">建议标签：</span>{aiSuggestions.tags.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="h-4 w-4 inline mr-1" />
                  物品名称 *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入物品名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  分类 *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">请选择分类</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  存放位置 *
                </label>
                <select
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">请选择位置</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="在用">在用</option>
                  <option value="闲置">闲置</option>
                  <option value="借出">借出</option>
                  <option value="维修中">维修中</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">详细信息</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-1" />
                  物品描述
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请描述物品的特征、用途等信息"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="h-4 w-4 inline mr-1" />
                  标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="例如：工作, 便携, 苹果"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    购买日期
                  </label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    保修期至
                  </label>
                  <input
                    type="date"
                    value={formData.warrantyDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, warrantyDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => onNavigate('items')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              添加物品
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}