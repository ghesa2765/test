// components/dashboard/EquipmentCard.tsx
'use client'

import styles from '@/styles/components/dashboard.module.css'

interface Equipment {
  id: string
  name: string
  code: string
  category: string
  status: 'available' | 'borrowed' | 'maintenance'
  location: string
  rating: number
  description: string
  dueDate?: string
  borrower?: string
  maintenanceUntil?: string
}

interface EquipmentCardProps {
  equipment: Equipment
}

export default function EquipmentCard({ equipment }: EquipmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#10b981'
      case 'borrowed': return '#3b82f6'
      case 'maintenance': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'พร้อมใช้งาน'
      case 'borrowed': return 'ถูกยืม'
      case 'maintenance': return 'บำรุงรักษา'
      default: return 'ไม่ทราบ'
    }
  }

  const handleBorrow = () => {
    alert(`ยืมอุปกรณ์: ${equipment.name}`)
    // ในแอปจริง จะเชื่อมต่อกับ API หรือ redirect ไปหน้ายืม
  }

  const handleBooking = () => {
    alert(`จองอุปกรณ์: ${equipment.name}`)
    // ในแอปจริง จะเชื่อมต่อกับ API หรือ redirect ไปหน้าจอง
  }

  return (
    <div className={styles.equipmentCard}>
      <div className={styles.equipmentHeader}>
        <div className={styles.equipmentIcon}>📦</div>
        <div 
          className={styles.statusDot}
          style={{ backgroundColor: getStatusColor(equipment.status) }}
        />
      </div>
      
      <h3 className={styles.equipmentName}>{equipment.name}</h3>
      <p className={styles.equipmentCode}>{equipment.code}</p>
      <p className={styles.equipmentCategory}>{equipment.category}</p>
      <p className={styles.equipmentDescription}>{equipment.description}</p>
      
      <div className={styles.equipmentLocation}>
        📍 {equipment.location}
      </div>
      
      <div className={styles.equipmentFooter}>
        <span 
          className={styles.statusBadge}
          style={{
            backgroundColor: getStatusColor(equipment.status) + '20', 
            color: getStatusColor(equipment.status)
          }}
        >
          {getStatusText(equipment.status)}
        </span>
        
        {equipment.status === 'available' && (
          <div className={styles.actionButtons}>
            <button 
              className={`${styles.actionButton} ${styles.borrowButton}`}
              onClick={handleBorrow}
            >
              ยืม
            </button>
            <button 
              className={`${styles.actionButton} ${styles.bookButton}`}
              onClick={handleBooking}
            >
              จอง
            </button>
          </div>
        )}
        
        {equipment.status === 'borrowed' && equipment.dueDate && (
          <span className={styles.dueDate}>ครบกำหนด: {equipment.dueDate}</span>
        )}
        
        {equipment.status === 'maintenance' && equipment.maintenanceUntil && (
          <span className={styles.dueDate}>พร้อมใช้: {equipment.maintenanceUntil}</span>
        )}
      </div>
    </div>
  )
}