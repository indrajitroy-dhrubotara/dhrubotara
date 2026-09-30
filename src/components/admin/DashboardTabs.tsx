"use client";

import {
  BookOpen,
  Gift,
  ImageIcon,
  ListOrdered,
  MessageSquare,
  Package,
  Tag,
  type LucideIcon,
} from 'lucide-react';
import { type AdminTab } from './types';

const TABS: { id: AdminTab; label: string; icon: LucideIcon }[] = [
  { id: 'products', label: 'Products', icon: Package },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'reorder-testimonials', label: 'Reorder Reviews', icon: ListOrdered },
  { id: 'categorize', label: 'Categorize', icon: Tag },
  { id: 'categories', label: 'Category Images', icon: ImageIcon },
  { id: 'hamper', label: 'Hamper Images', icon: Gift },
  { id: 'story', label: 'Story Images', icon: BookOpen },
];

interface DashboardTabsProps {
  activeTab: AdminTab;
  onChange: (tab: AdminTab) => void;
}

export function DashboardTabs({ activeTab, onChange }: DashboardTabsProps) {
  return (
    <div className="flex space-x-8 border-b border-stone-200 mb-8 overflow-x-auto">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`pb-4 text-sm font-medium flex items-center cursor-pointer transition-all active:scale-95 whitespace-nowrap ${
            activeTab === id
              ? 'border-b-2 border-emerald-900 text-emerald-900'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          <Icon size={18} className="mr-2" /> {label}
        </button>
      ))}
    </div>
  );
}
