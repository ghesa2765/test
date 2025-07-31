// components/admin/ExpiryNotifications.tsx
'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, XCircle, Calendar, Package } from 'lucide-react'
import styles from '@/styles/components/expiry-notifications.module.css'

interface ExpiryNotification {
  equipmentId: string
  equipmentName: string
  category: string
  expiryDate: string
  daysUntilExpiry: number
  isExpired: boolean
  totalQuantity: number
}

export default function ExpiryNotifications() {
  const [notifications, setNotifications] = useState<ExpiryNotification[]>([])
  
  useEffect(() => {
    // จำลองการดึงข้อมูลอุปกรณ์ที่เกือบหมดอายุ
    const mockNotifications: ExpiryNotification[] = [
      {
        equipmentId: 'EQ002',
        equipmentName: 'เครื่องวัดความดัน',
        category: 'อุปกรณ์ตรวจวัด',
        expiryDate: '2025-02-01',
        daysUntilExpiry: 15,
        isExpired: false,
        totalQuantity: 5
      },
      {
        equipmentId: 'EQ010',
        equipmentName: 'เครื่องกระตุกหัวใจไฟฟ้า',
        category: 'อุปกรณ์การแพทย์',
        expiryDate: '2025-01-20',
        daysUntilExpiry: -10,
        isExpired: true,
        totalQuantity: 2
      }
    ]
    
    setNotifications(mockNotifications)
  }, [])

  const expiredCount = notifications.filter(n => n.isExpired).length
  const nearExpiryCount = notifications.filter(n => !n.isExpired && n.daysUntilExpiry <= 30).length

  if (notifications.length === 0) return null

  return (
    <div className={styles.notificationsContainer}>
      <div className={styles.notificationHeader}>
        <h3 className={styles.notificationTitle}>
          <AlertTriangle size={20} />
          การแจ้งเตือนอุปกรณ์
        </h3>
        <div className={styles.notificationCounts}>
          {expiredCount > 0 && (
            <span className={styles.expiredCount}>
              หมดอายุ: {expiredCount}
            </span>
          )}
          {nearExpiryCount > 0 && (
            <span className={styles.nearExpiryCount}>
              เกือบหมดอายุ: {nearExpiryCount}
            </span>
          )}
        </div>
      </div>

      <div className={styles.notificationList}>
        {notifications.map(notification => (
          <div 
            key={notification.equipmentId}
            className={`${styles.notificationItem} ${notification.isExpired ? styles.expired : styles.nearExpiry}`}
          >
            <div className={styles.notificationIcon}>
              {notification.isExpired ? (
                <XCircle size={20} />
              ) : (
                <AlertTriangle size={20} />
              )}
            </div>
            
            <div className={styles.notificationContent}>
              <div className={styles.equipmentName}>
                {notification.equipmentName}
              </div>
              <div className={styles.equipmentDetails}>
                <span className={styles.category}>{notification.category}</span>
                <span className={styles.quantity}>
                  <Package size={14} />
                  {notification.totalQuantity} ชิ้น
                </span>
              </div>
              <div className={styles.expiryInfo}>
                <Calendar size={14} />
                {notification.isExpired ? (
                  <span className={styles.expiredText}>
                    หมดอายุแล้ว {Math.abs(notification.daysUntilExpiry)} วัน
                  </span>
                ) : (
                  <span className={styles.nearExpiryText}>
                    เกือบหมดอายุ อีก {notification.daysUntilExpiry} วัน
                  </span>
                )}
              </div>
            </div>
            
            <div className={styles.notificationDate}>
              {new Date(notification.expiryDate).toLocaleDateString('th-TH')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}