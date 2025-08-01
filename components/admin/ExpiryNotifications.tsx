// components/admin/ExpiryNotifications.tsx - เวอร์ชันสมบูรณ์
'use client'

import { useState, useEffect } from 'react'
import { 
  AlertTriangle, XCircle, Calendar, Package, 
  MapPin, Eye, Settings, X, ChevronDown, ChevronUp,
  Clock, AlertCircle
} from 'lucide-react'
import { 
  ExpiryNotification, 
  generateMockEquipment, 
  generateExpiryNotifications 
} from '@/types/equipment'
import styles from '@/styles/components/expiry-notifications.module.css'

interface ExpiryNotificationsProps {
  maxDisplay?: number
  showActions?: boolean
  compact?: boolean
}

export default function ExpiryNotifications({ 
  maxDisplay = 5, 
  showActions = true,
  compact = false 
}: ExpiryNotificationsProps) {
  const [notifications, setNotifications] = useState<ExpiryNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true)
      try {
        // จำลองการโหลดจาก API
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const mockEquipment = generateMockEquipment()
        const generatedNotifications = generateExpiryNotifications(mockEquipment)
        
        // กรองเฉพาะที่ยังไม่ได้ dismiss
        const activeNotifications = generatedNotifications.filter(
          notification => !dismissedIds.includes(notification.equipmentId)
        )
        
        setNotifications(activeNotifications)
      } catch (error) {
        console.error('Failed to load expiry notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()
  }, [dismissedIds])

  const handleDismiss = (equipmentId: string) => {
    setDismissedIds(prev => [...prev, equipmentId])
    setNotifications(prev => prev.filter(n => n.equipmentId !== equipmentId))
  }

  const handleView = (notification: ExpiryNotification) => {
    // Navigate to equipment details
    window.location.href = `/admin/equipment/${notification.equipmentId}`
  }

  const handleSettings = () => {
    // Navigate to notification settings
    window.location.href = '/admin/settings/notifications'
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (notification: ExpiryNotification) => {
    if (notification.isExpired) {
      return <XCircle size={20} className={styles.expiredIcon} />
    }
    
    if (notification.priority === 'high') {
      return <AlertTriangle size={20} className={styles.highPriorityIcon} />
    }
    
    return <AlertTriangle size={20} className={styles.mediumPriorityIcon} />
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'เมื่อสักครู่'
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} วันที่แล้ว`
  }

  const visibleNotifications = expanded 
    ? notifications 
    : notifications.slice(0, maxDisplay)

  const expiredCount = notifications.filter(n => n.isExpired).length
  const nearExpiryCount = notifications.filter(n => !n.isExpired && n.isNearExpiry).length
  const unreadCount = notifications.filter(n => !n.isRead).length

  if (loading) {
    return (
      <div className={styles.notificationsContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>กำลังโหลดการแจ้งเตือน...</p>
        </div>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className={styles.notificationsContainer}>
        <div className={styles.emptyState}>
          <Package size={48} />
          <h3>ไม่มีการแจ้งเตือน</h3>
          <p>อุปกรณ์ทั้งหมดอยู่ในสภาพดี</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.notificationsContainer} ${compact ? styles.compact : ''}`}>
      <div className={styles.notificationHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTitle}>
            <AlertTriangle size={20} />
            <h3>การแจ้งเตือนอุปกรณ์</h3>
            {unreadCount > 0 && (
              <span className={styles.unreadBadge}>{unreadCount}</span>
            )}
          </div>
          <div className={styles.notificationSummary}>
            {expiredCount > 0 && (
              <span className={styles.expiredSummary}>
                หมดอายุ: {expiredCount}
              </span>
            )}
            {nearExpiryCount > 0 && (
              <span className={styles.nearExpirySummary}>
                เกือบหมดอายุ: {nearExpiryCount}
              </span>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className={styles.headerActions}>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className={styles.markAllReadBtn}
                title="ทำเครื่องหมายอ่านทั้งหมด"
              >
                อ่านทั้งหมด
              </button>
            )}
            <button 
              onClick={handleSettings}
              className={styles.settingsBtn}
              title="ตั้งค่าการแจ้งเตือน"
            >
              <Settings size={16} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.notificationList}>
        {visibleNotifications.map(notification => (
          <div 
            key={notification.equipmentId}
            className={`
              ${styles.notificationItem} 
              ${notification.isExpired ? styles.expired : styles.nearExpiry}
              ${!notification.isRead ? styles.unread : ''}
              ${notification.priority === 'high' ? styles.highPriority : ''}
            `}
          >
            <div className={styles.notificationIcon}>
              {getNotificationIcon(notification)}
            </div>
            
            <div className={styles.notificationContent}>
              <div className={styles.equipmentInfo}>
                <div className={styles.equipmentName}>
                  {notification.equipmentName}
                </div>
                <div className={styles.equipmentModel}>
                  {notification.equipmentModel}
                </div>
              </div>
              
              <div className={styles.equipmentDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.category}>{notification.category}</span>
                </div>
                <div className={styles.detailItem}>
                  <MapPin size={12} />
                  <span>{notification.location}</span>
                </div>
                <div className={styles.detailItem}>
                  <Package size={12} />
                  <span>{notification.totalQuantity} ชิ้น</span>
                </div>
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
              
              <div className={styles.notificationTime}>
                <Clock size={12} />
                <span>{formatTimeAgo(notification.notifiedAt)}</span>
              </div>
            </div>
            
            <div className={styles.notificationActions}>
              <button
                onClick={() => handleView(notification)}
                className={styles.viewBtn}
                title="ดูรายละเอียด"
              >
                <Eye size={14} />
              </button>
              <button
                onClick={() => handleDismiss(notification.equipmentId)}
                className={styles.dismissBtn}
                title="ปิดการแจ้งเตือน"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {notifications.length > maxDisplay && (
        <div className={styles.notificationFooter}>
          <button
            onClick={() => setExpanded(!expanded)}
            className={styles.expandBtn}
          >
            {expanded ? (
              <>
                <ChevronUp size={16} />
                แสดงน้อยลง
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                แสดงทั้งหมด ({notifications.length - maxDisplay} เพิ่มเติม)
              </>
            )}
          </button>
        </div>
      )}

      {/* แสดงข้อแนะนำเพิ่มเติม */}
      {(expiredCount > 0 || nearExpiryCount > 2) && (
        <div className={styles.actionSuggestion}>
          <AlertCircle size={16} />
          <div className={styles.suggestionContent}>
            <strong>แนะนำ:</strong>
            <span>
              ควรจัดทำแผนการเปลี่ยนอุปกรณ์ที่หมดอายุ 
              และเตรียมงบประมาณสำหรับการจัดซื้อใหม่
            </span>
          </div>
        </div>
      )}
    </div>
  )
}