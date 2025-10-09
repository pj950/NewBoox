// 社区数据管理器
export interface User {
  id: string;
  name: string;
  avatar: string;
  level: number;
  verified: boolean;
  joinDate: string;
  followers: number;
  following: number;
  posts: number;
  likes: number;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  images: string[];
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  updatedAt: string;
  likedBy: string[];
  location?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: string;
  likedBy: string[];
  parentId?: string; // 用于回复
}

class CommunityManager {
  private static instance: CommunityManager;
  
  static getInstance(): CommunityManager {
    if (!CommunityManager.instance) {
      CommunityManager.instance = new CommunityManager();
    }
    return CommunityManager.instance;
  }

  // 用户管理
  getCurrentUser(): User {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return JSON.parse(userData);
    }
    
    // 创建默认用户
    const defaultUser: User = {
      id: 'user-' + Date.now(),
      name: '张三',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      level: 12,
      verified: true,
      joinDate: '2023年6月',
      followers: 156,
      following: 89,
      posts: 23,
      likes: 1247
    };
    
    this.saveUser(defaultUser);
    return defaultUser;
  }

  saveUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUsers(): User[] {
    const users = localStorage.getItem('communityUsers');
    if (users) {
      return JSON.parse(users);
    }
    
    // 初始化示例用户
    const sampleUsers: User[] = [
      {
        id: 'user-1',
        name: '整理达人小王',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: 15,
        verified: true,
        joinDate: '2023年3月',
        followers: 892,
        following: 234,
        posts: 67,
        likes: 3421
      },
      {
        id: 'user-2',
        name: '收纳女王',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: 18,
        verified: true,
        joinDate: '2023年1月',
        followers: 1543,
        following: 156,
        posts: 89,
        likes: 5678
      },
      {
        id: 'user-3',
        name: '极简主义者',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: 8,
        verified: false,
        joinDate: '2023年8月',
        followers: 234,
        following: 345,
        posts: 34,
        likes: 876
      }
    ];
    
    localStorage.setItem('communityUsers', JSON.stringify(sampleUsers));
    return sampleUsers;
  }

  // 帖子管理
  getPosts(): Post[] {
    const posts = localStorage.getItem('communityPosts');
    if (posts) {
      return JSON.parse(posts);
    }
    
    // 初始化示例帖子
    const samplePosts: Post[] = [
      {
        id: 'post-1',
        userId: 'user-1',
        content: '分享一下我的办公室整理心得！用透明收纳盒真的太好用了，一眼就能看到里面的东西。经过一个月的实践，我总结了几个关键点：\n\n1. 按使用频率分类，常用的放在最顺手的位置\n2. 透明收纳盒比不透明的效率高很多\n3. 标签系统很重要，即使是透明盒子也要贴标签\n4. 定期整理，每周花10分钟维护一下\n\n希望对大家有帮助！',
        images: [
          'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        tags: ['办公室整理', '收纳技巧', '透明收纳盒'],
        likes: 156,
        comments: 23,
        shares: 8,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likedBy: []
      },
      {
        id: 'post-2',
        userId: 'user-2',
        content: '厨房收纳大改造完成！按照使用频率分类，常用的放在最顺手的位置。现在做饭效率提升了好多！',
        images: [
          'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        tags: ['厨房收纳', '生活技巧', '效率提升'],
        likes: 289,
        comments: 45,
        shares: 12,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        likedBy: []
      }
    ];
    
    localStorage.setItem('communityPosts', JSON.stringify(samplePosts));
    return samplePosts;
  }

  savePost(post: Post): void {
    const posts = this.getPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.unshift(post);
    }
    localStorage.setItem('communityPosts', JSON.stringify(posts));
  }

  createPost(content: string, images: string[], tags: string[]): Post {
    const currentUser = this.getCurrentUser();
    const newPost: Post = {
      id: 'post-' + Date.now(),
      userId: currentUser.id,
      content,
      images,
      tags,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likedBy: []
    };
    
    this.savePost(newPost);
    
    // 更新用户帖子数
    currentUser.posts += 1;
    this.saveUser(currentUser);
    
    return newPost;
  }

  likePost(postId: string): boolean {
    const posts = this.getPosts();
    const currentUser = this.getCurrentUser();
    const post = posts.find(p => p.id === postId);
    
    if (post) {
      const isLiked = post.likedBy.includes(currentUser.id);
      if (isLiked) {
        post.likedBy = post.likedBy.filter(id => id !== currentUser.id);
        post.likes -= 1;
      } else {
        post.likedBy.push(currentUser.id);
        post.likes += 1;
      }
      
      this.savePost(post);
      return !isLiked;
    }
    
    return false;
  }

  // 评论管理
  getComments(postId: string): Comment[] {
    const comments = localStorage.getItem('communityComments');
    if (comments) {
      return JSON.parse(comments).filter((c: Comment) => c.postId === postId);
    }
    return [];
  }

  addComment(postId: string, content: string, parentId?: string): Comment {
    const currentUser = this.getCurrentUser();
    const newComment: Comment = {
      id: 'comment-' + Date.now(),
      postId,
      userId: currentUser.id,
      content,
      likes: 0,
      createdAt: new Date().toISOString(),
      likedBy: [],
      parentId
    };
    
    const allComments = JSON.parse(localStorage.getItem('communityComments') || '[]');
    allComments.push(newComment);
    localStorage.setItem('communityComments', JSON.stringify(allComments));
    
    // 更新帖子评论数
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comments += 1;
      this.savePost(post);
    }
    
    return newComment;
  }

  // 搜索和筛选
  searchPosts(query: string, tags?: string[]): Post[] {
    const posts = this.getPosts();
    return posts.filter(post => {
      const matchesQuery = !query || 
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesTags = !tags || tags.length === 0 ||
        tags.some(tag => post.tags.includes(tag));
      
      return matchesQuery && matchesTags;
    });
  }

  getPopularTags(): { name: string; count: number }[] {
    const posts = this.getPosts();
    const tagCount = new Map<string, number>();
    
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });
    
    return Array.from(tagCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

export default CommunityManager;