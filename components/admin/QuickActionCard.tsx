// components/admin/QuickActionCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Package, 
  Settings,
  FileText,
  Calendar,
  Bell,
  Shield
} from 'lucide-react';
import styles from '@/styles/components/quick-action-card.module.css';

interface QuickActionProps {
  href: string;
  icon: 'dashboard' | 'users' | 'equipment' | 'settings' | 'reports' | 'calendar' | 'notifications' | 'security';
  title: string;
  description?: string;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'indigo';
}

const iconMap = {
  dashboard: BarChart3,
  users: Users,
  equipment: Package,
  settings: Settings,
  reports: FileText,
  calendar: Calendar,
  notifications: Bell,
  security: Shield
};

const QuickActionCard: React.FC<QuickActionProps> = ({ 
  href, 
  icon, 
  title, 
  description, 
  color = 'blue' 
}) => {
  const IconComponent = iconMap[icon];

  return (
    <Link href={href} className={`${styles.actionCard} ${styles[color]}`}>
      <div className={styles.actionIcon}>
        <IconComponent size={24} />
      </div>
      <div className={styles.actionContent}>
        <span className={styles.actionTitle}>{title}</span>
        {description && (
          <span className={styles.actionDescription}>{description}</span>
        )}
      </div>
      <div className={styles.actionArrow}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Link>
  );
};

export default QuickActionCard;