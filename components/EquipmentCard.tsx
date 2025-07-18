'use client';

import React from 'react';
import styles from '../components/EquipmentCard.module.css';

interface EquipmentCardProps {
  name: string;
  status: 'available' | 'in_use' | 'maintenance';
}

interface EquipmentItemProps {
  name: string;
  status: 'available' | 'in_use' | 'maintenance';
  count: number;
  icon: string;
}

// Component สำหรับแสดงในรายการหลัก (Dashboard)
export function EquipmentItem({ name, status, count, icon }: EquipmentItemProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'available':
        return { 
          label: 'พร้อมใช้งาน', 
          cardClass: styles.equipmentCardAvailable,
          dotClass: styles.statusDotAvailable,
          textClass: styles.statusTextAvailable
        };
      case 'in_use':
        return { 
          label: 'กำลังใช้งาน', 
          cardClass: styles.equipmentCardInUse,
          dotClass: styles.statusDotInUse,
          textClass: styles.statusTextInUse
        };
      case 'maintenance':
        return { 
          label: 'ซ่อมบำรุง', 
          cardClass: styles.equipmentCardMaintenance,
          dotClass: styles.statusDotMaintenance,
          textClass: styles.statusTextMaintenance
        };
      default:
        return { 
          label: 'ไม่ทราบสถานะ', 
          cardClass: styles.equipmentCardDefault,
          dotClass: styles.statusDotDefault,
          textClass: styles.statusTextDefault
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <div className={`${styles.equipmentCard} ${statusConfig.cardClass}`}>
      <div className={styles.equipmentHeader}>
        <div className={styles.equipmentIcon}>{icon}</div>
        <div className={`${styles.statusDot} ${statusConfig.dotClass}`}></div>
      </div>
      <div className={styles.equipmentInfo}>
        <h3 className={styles.equipmentName}>{name}</h3>
        <div className={styles.equipmentStatus}>
          <span className={`${styles.statusLabel} ${statusConfig.textClass}`}>
            {statusConfig.label}
          </span>
          <span className={styles.equipmentCount}>
            มีทั้งหมด {count} {name.includes('คู่') ? 'คู่' : name.includes('ตัว') ? 'ตัว' : 'ชิ้น'}
          </span>
        </div>
      </div>
    </div>
  );
}

// Component เดิมสำหรับใช้ที่อื่น
export default function EquipmentCard({ name, status }: EquipmentCardProps) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px' }}>
      <h3>{name}</h3>
      <p>Status: {status}</p>
    </div>
  );
}