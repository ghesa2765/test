'use client'

import { useState } from 'react'
import { 
  Package2, Plus, Search, Filter, Edit, Trash2, 
  Eye, AlertCircle, CheckCircle, Clock
} from 'lucide-react'
import styles from '@/styles/admin-equipment.module.css'

interface Equipment {
  id: string
  name: string
  category: string
  status: 'available' | 'borrowed' | 'maintenance' | 'broken'
  location: string
  borrower?: string
  borrowDate?: string
  maintenanceDate?: string
}

export default function EquipmentManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)

  const equipmentData: Equipment[] = [
    {
      id: 'EQ001',
      name: 'เครื่องวัดความดันโลหิตดิจิทัล',
      category: 'การวินิจฉัย',
      status: 'borrowed',
      location: 'ห้อง 101',
      borrower: 'นิคม ใจดี',
      borrowDate: '2025-01-07'
    },
    {
      id: 'EQ002',
      name: 'เครื่อง Ultrasound',
      category: 'การวินิจฉัย',
      status: 'available',
      location: 'ห้อง 102'
    },
    {
      id: 'EQ003',
      name: 'เครื่องตรวจหูคอจมูก',
      category: 'ตรวจร่างกาย',
      status: 'maintenance',
      location: 'ห้องซ่อม',
      maintenanceDate: '2025-01-05'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle size={16} />
      case 'borrowed': return <Clock size={16} />
      case 'maintenance': return <AlertCircle size={16} />
      case 'broken': return <AlertCircle size={16} />
      default: return <CheckCircle size={16} />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'ว่าง'
      case 'borrowed': return 'ถูกยืม'
      case 'maintenance': return 'บำรุงรักษา'
      case 'broken': return 'เสียหาย'
      default: return 'ไม่ทราบ'
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available': return styles.statusAvailable
      case 'borrowed': return styles.statusBorrowed
      case 'maintenance': return styles.statusMaintenance
      case 'broken': return styles.statusBroken
      default: return styles.statusAvailable
    }
  }

  return (
    <div className={styles.equipmentManagement}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <Package2 size={32} />
            จัดการอุปกรณ์
          </h1>
          <p className={styles.pageSubtitle}>จัดการอุปกรณ์ทางการแพทย์ทั้งหมด</p>
        </div>
        <button className={styles.addButton} onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          เพิ่มอุปกรณ์ใหม่
        </button>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="ค้นหาอุปกรณ์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterContainer}>
          <Filter size={20} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="available">ว่าง</option>
            <option value="borrowed">ถูกยืม</option>
            <option value="maintenance">บำรุงรักษา</option>
            <option value="broken">เสียหาย</option>
          </select>
        </div>
      </div>

      <div className={styles.equipmentGrid}>
        {equipmentData.map((item) => (
          <div key={item.id} className={styles.equipmentCard}>
            <div className={styles.cardHeader}>
              <div className={styles.equipmentId}>#{item.id}</div>
              <div className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                {getStatusIcon(item.status)}
                {getStatusText(item.status)}
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <h3 className={styles.equipmentName}>{item.name}</h3>
              <p className={styles.equipmentCategory}>{item.category}</p>
              <p className={styles.equipmentLocation}>📍 {item.location}</p>
              
              {item.borrower && (
                <p className={styles.borrowInfo}>
                  👤 {item.borrower} | 📅 {item.borrowDate}
                </p>
              )}
              
              {item.maintenanceDate && (
                <p className={styles.maintenanceInfo}>
                  🔧 บำรุงรักษาตั้งแต่: {item.maintenanceDate}
                </p>
              )}
            </div>
            
            <div className={styles.cardActions}>
              <button className={styles.actionBtn}>
                <Eye size={16} />
                ดูรายละเอียด
              </button>
              <button className={styles.actionBtn}>
                <Edit size={16} />
                แก้ไข
              </button>
              <button className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                <Trash2 size={16} />
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}