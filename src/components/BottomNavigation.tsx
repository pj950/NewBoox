import React from 'react';
import { Home, Package, Users, User } from 'lucide-react';
import { Page, NavigationParams } from '../App';

interface BottomNavigationProps {
  currentPage: Page;
  onNavigate: (page: Page, params?: NavigationParams) => void;
}

export default function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { id: 'dashboard' as Page, label: '首页', icon: Home },
    { id: 'warehouses' as Page, label: '仓库', icon: Package },
    { id: 'community' as Page, label: '社区', icon: Users },
    { id: 'profile' as Page, label: '我的', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-t border-white/20"></div>
      
      <div className="relative px-6 py-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center space-y-1 py-2 px-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}