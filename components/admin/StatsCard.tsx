// components/admin/StatsCard.tsx
'use client';

import React from 'react';
import { 
  BarChart3, 
  Clock, 
  Package, 
  Users,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import styles from '@/styles/components/stats-card.module.css';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: 'total' | 'pending' | 'available' | 'online';
  color?: 'blue' | 'orange' | 'green' | 'purple';
}

const iconMap = {
  total: BarChart3,
  pending: Clock,
  available: Package,
  online: Users
};

const AdminStatsCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  color = 'blue' 
}) => {
  const IconComponent = iconMap[icon];
  
  const getTrendIcon = () => {
    if (!change) return null;
    
    switch (change.type) {
      case 'increase':
        return <TrendingUp size={16} className={styles.trendIcon} />;
      case 'decrease':
        return <TrendingDown size={16} className={styles.trendIcon} />;
      default:
        return <Minus size={16} className={styles.trendIcon} />;
    }
  };

  return (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statIcon}>
        <IconComponent size={24} />
      </div>
      <div className={styles.statContent}>
        <div className={styles.statNumber}>{value}</div>
        <div className={styles.statLabel}>{title}</div>
        {change && (
          <div className={`${styles.statChange} ${styles[change.type]}`}>
            {getTrendIcon()}
            <span>{change.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatsCard;