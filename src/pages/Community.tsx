import React, { useState } from 'react';
import { Plus, Heart, MessageCircle, Share, Search, TrendingUp, Users, Star, Filter, Sparkles } from 'lucide-react';
import { Page, NavigationParams } from '../App';
import CommunityManager from '../utils/communityManager';

interface CommunityProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
}

export default function Community({ onNavigate }: CommunityProps) {
  const [activeTab, setActiveTab] = useState<'hot' | 'latest' | 'following'>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const communityManager = CommunityManager.getInstance();
  const [posts, setPosts] = useState(communityManager.getPosts());
  const [hotTopics] = useState(communityManager.getPopularTags());


  const handleLike = (postId: string) => {
    const isLiked = communityManager.likePost(postId);
    setPosts(communityManager.getPosts());
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return '刚刚';
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString();
  };

  const getUserInfo = (userId: string) => {
    const users = communityManager.getUsers();
    return users.find(u => u.id === userId) || {
      id: userId,
      name: '未知用户',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      level: 1,
      verified: false
    };
  };

  const filteredPosts = searchQuery 
    ? communityManager.searchPosts(searchQuery)
    : posts;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* 超紧凑Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"></div>
        <div className="relative px-3 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-base font-bold text-white mb-0.5">社区</h1>
              <p className="text-xs text-emerald-100">分享你的整理心得</p>
            </div>
            <button
              onClick={() => onNavigate('create-post')}
              className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">发布</span>
            </button>
          </div>
          
          {/* 紧凑搜索栏 */}
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-white/70" />
              <input
                type="text"
                placeholder="搜索话题、用户或内容..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-transparent text-white placeholder-white/70 focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* 紧凑Tabs */}
          <div className="flex space-x-0.5 bg-white/20 backdrop-blur-sm rounded-lg p-0.5 border border-white/30">
            {[
              { id: 'hot', label: '热门', icon: TrendingUp },
              { id: 'latest', label: '最新', icon: Star },
              { id: 'following', label: '关注', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 rounded-md transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white/30 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <tab.icon className="h-3 w-3" />
                <span className="text-xs font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-3 -mt-3 space-y-3">
        {/* 超紧凑热门话题 */}
        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <div className="p-1 rounded-md bg-gradient-to-br from-orange-500 to-red-500">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <h3 className="text-xs font-bold text-gray-900">热门话题</h3>
            </div>
            <Filter className="h-3 w-3 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hotTopics.map((topic, index) => (
              <button
                key={index}
                className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-all duration-300 border border-gray-200/50 active:scale-95"
              >
                <TrendingUp className="h-2.5 w-2.5 text-red-500" />
                <span className="text-xs font-medium">#{topic.name}</span>
                <span className="text-xs text-gray-500 bg-white px-1 py-0.5 rounded-full">{topic.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 超紧凑帖子列表 */}
        <div className="space-y-3">
          {filteredPosts.map((post) => {
            const user = getUserInfo(post.userId);
            const isLiked = post.likedBy.includes(communityManager.getCurrentUser().id);
            return (
            <div
              key={post.id}
              onClick={() => onNavigate('community-post', { postId: post.id })}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer active:scale-95"
            >
              {/* 紧凑用户信息 */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  {user.verified && (
                    <div className="absolute -top-0.5 -right-0.5 p-0.5 bg-blue-500 rounded-full">
                      <Star className="h-2 w-2 text-white fill-current" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-1">
                    <h4 className="text-xs font-bold text-gray-900">{user.name}</h4>
                    <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-1.5 py-0.5 rounded-full font-semibold">
                      Lv.{user.level}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{formatRelativeTime(post.createdAt)}</p>
                </div>
              </div>

              {/* 内容 */}
              <p className="text-xs text-gray-800 mb-2 leading-relaxed">{post.content}</p>

              {/* 紧凑图片 */}
              {post.images.length > 0 && (
                <div className={`grid gap-1.5 mb-2 ${
                  post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}>
                  {post.images.map((image, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg">
                      <img
                        src={image}
                        alt=""
                        className="w-full h-24 object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* 紧凑标签 */}
              <div className="flex flex-wrap gap-1 mb-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium border border-blue-200/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 紧凑操作按钮 */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(post.id);
                  }}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-300 ${
                    isLiked
                      ? 'text-red-500 bg-red-50 border border-red-200/50'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-3 w-3 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-xs font-semibold">{post.likes}</span>
                </button>
                <button className="flex items-center space-x-1 px-2 py-1 rounded-md text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-300">
                  <MessageCircle className="h-3 w-3" />
                  <span className="text-xs font-semibold">{post.comments}</span>
                </button>
                <button className="flex items-center space-x-1 px-2 py-1 rounded-md text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-all duration-300">
                  <Share className="h-3 w-3" />
                  <span className="text-xs font-semibold">{post.shares}</span>
                </button>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}