import React, { useState } from 'react';
import { ArrowLeft, Camera, Upload, Hash, X, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Page, NavigationParams } from '../App';
import CommunityManager from '../utils/communityManager';

interface CreatePostProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
}

export default function CreatePost({ onNavigate }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const communityManager = CommunityManager.getInstance();

  const popularTags = [
    '办公室整理', '收纳技巧', '断舍离', '极简生活', '厨房收纳',
    '卧室整理', '书籍收纳', '电子设备', '衣物整理', '工具收纳'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags(prev => [...prev, tag]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !isSubmitting) {
      setIsSubmitting(true);
      
      try {
        communityManager.createPost(content.trim(), images, tags);
        onNavigate('community');
      } catch (error) {
        console.error('发布失败:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500"></div>
        <div className="relative px-6 pt-12 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('community')}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">发布动态</h1>
                <p className="text-purple-100">分享你的整理心得</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg shadow-emerald-500/25 disabled:opacity-50"
            >
              {isSubmitting ? '发布中...' : '发布'}
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enhanced User Info */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="我的头像"
                className="w-12 h-12 rounded-2xl object-cover"
              />
              <div>
                <h3 className="font-bold text-gray-900">张三</h3>
                <p className="text-sm text-gray-500">分享你的整理心得</p>
              </div>
            </div>

            {/* Enhanced Content Input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享你的收纳技巧、整理心得或者提出问题..."
              rows={6}
              className="w-full px-0 py-2 border-0 resize-none focus:ring-0 text-gray-800 placeholder-gray-500 text-lg leading-relaxed"
            />
          </div>

          {/* Enhanced Images */}
          {images.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                  <ImageIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">图片</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`上传图片 ${index + 1}`}
                      className="w-full h-32 object-cover rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Tags */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500">
                <Hash className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">话题标签</h3>
            </div>
            
            {/* Current Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 rounded-full border border-blue-200/50"
                  >
                    <Hash className="h-3 w-3" />
                    <span className="text-sm font-medium">{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add Tag Input */}
            <div className="flex space-x-3 mb-4">
              <div className="flex-1 relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag(currentTag);
                    }
                  }}
                  placeholder="添加话题标签"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              <button
                type="button"
                onClick={() => addTag(currentTag)}
                disabled={!currentTag || tags.includes(currentTag) || tags.length >= 5}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                添加
              </button>
            </div>

            {/* Popular Tags */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-3">热门话题：</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    disabled={tags.includes(tag) || tags.length >= 5}
                    className="inline-flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Hash className="h-3 w-3" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                    <ImageIcon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">添加图片</span>
                </label>
              </div>
              <div className="text-sm text-gray-500 font-medium">
                {content.length}/500
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}