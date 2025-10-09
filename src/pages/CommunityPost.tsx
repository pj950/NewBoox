import React, { useState } from 'react';
import { ArrowLeft, Heart, MessageCircle, Share, MoreVertical, Star, Send, Sparkles } from 'lucide-react';
import { Page, NavigationParams } from '../App';
import CommunityManager from '../utils/communityManager';

interface CommunityPostProps {
  onNavigate: (page: Page, params?: NavigationParams) => void;
  postId?: string;
}

export default function CommunityPost({ onNavigate, postId }: CommunityPostProps) {
  const [newComment, setNewComment] = useState('');
  const communityManager = CommunityManager.getInstance();
  const [post, setPost] = useState(() => {
    const posts = communityManager.getPosts();
    return posts.find(p => p.id === postId) || posts[0];
  });
  const [comments, setComments] = useState(() => communityManager.getComments(post.id));
  const [user] = useState(() => {
    const users = communityManager.getUsers();
    return users.find(u => u.id === post.userId) || users[0];
  });


  const handleLike = () => {
    const isLiked = communityManager.likePost(post.id);
    const updatedPosts = communityManager.getPosts();
    const updatedPost = updatedPosts.find(p => p.id === post.id);
    if (updatedPost) {
      setPost(updatedPost);
    }
  };

  const handleComment = () => {
    if (newComment.trim()) {
      communityManager.addComment(post.id, newComment.trim());
      setComments(communityManager.getComments(post.id));
      setNewComment('');
      
      // 更新帖子评论数
      const updatedPosts = communityManager.getPosts();
      const updatedPost = updatedPosts.find(p => p.id === post.id);
      if (updatedPost) {
        setPost(updatedPost);
      }
    }
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

  const getCommentUser = (userId: string) => {
    const users = communityManager.getUsers();
    return users.find(u => u.id === userId) || {
      id: userId,
      name: '未知用户',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      level: 1
    };
  };

  const currentUser = communityManager.getCurrentUser();
  const isLiked = post.likedBy.includes(currentUser.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600"></div>
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
                <h1 className="text-xl font-bold text-white">帖子详情</h1>
                <p className="text-emerald-100">查看完整内容和评论</p>
              </div>
            </div>
            <button className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300">
              <MoreVertical className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        {/* Enhanced Post Content */}
        <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100/50">
          {/* Enhanced User Info */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover"
              />
              {user.verified && (
                <div className="absolute -top-1 -right-1 p-1 bg-blue-500 rounded-full">
                  <Star className="h-3 w-3 text-white fill-current" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-gray-900">{user.name}</h3>
                <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full font-semibold">
                  Lv.{user.level}
                </span>
              </div>
              <p className="text-sm text-gray-500">{formatRelativeTime(post.createdAt)}</p>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="mb-6">
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">{post.content}</p>
          </div>

          {/* Enhanced Images */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {post.images.map((image, index) => (
              <div key={index} className="relative overflow-hidden rounded-2xl">
                <img
                  src={image}
                  alt=""
                  className={`w-full object-cover hover:scale-105 transition-transform duration-300 ${
                    index === 0 && post.images.length === 3 ? 'col-span-2 h-48' : 'h-32'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Enhanced Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 px-3 py-1 rounded-full font-medium border border-blue-200/50"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Enhanced Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl transition-all duration-300 ${
                isLiked
                  ? 'text-red-500 bg-red-50 border border-red-200/50'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-semibold">{post.likes}</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all duration-300">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">{post.comments}</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-green-600 transition-all duration-300">
              <Share className="h-5 w-5" />
              <span className="font-semibold">{post.shares}</span>
            </button>
          </div>
        </div>

        {/* Enhanced Comments Section */}
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100/50">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">评论 ({comments.length})</h3>
            </div>
          </div>

          {/* Enhanced Comment Input */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex space-x-4">
              <img
                src={currentUser.avatar}
                alt="我的头像"
                className="w-10 h-10 rounded-2xl object-cover"
              />
              <div className="flex-1 flex space-x-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="写下你的评论..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Comments List */}
          <div className="divide-y divide-gray-100">
            {comments.map((comment) => {
              const commentUser = getCommentUser(comment.userId);
              return (
              <div key={comment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex space-x-4">
                  <img
                    src={commentUser.avatar}
                    alt={commentUser.name}
                    className="w-10 h-10 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{commentUser.name}</h4>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                        Lv.{commentUser.level}
                      </span>
                      <span className="text-xs text-gray-500">{formatRelativeTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-800 mb-3 leading-relaxed">{comment.content}</p>
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm font-medium">{comment.likes}</span>
                      </button>
                      <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors font-medium">
                        回复
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}