// app/admin/equipment/page.tsx - เวอร์ชันอัปเดต
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye,
  Download, Upload, Settings, AlertTriangle, XCircle, 
  Package, Calendar, DollarSign
} from 'lucide-react'
import { 
  calculateExpiryStatus,
  generateMockEquipment,
  ExpiryNotification,
  generateExpiryNotifications
} from '@/utils/equipment'  
import ExpiryNotifications from '@/components/admin/ExpiryNotifications'
import styles from '@/styles/pages/admin-equipment.module.css'

// ✨ Enhanced Equipment interface เพื่อรองรับฟีเจอร์ใหม่
interface EnhancedEquipment extends Equipment {
  expiryStatus?: {
    isExpired: boolean
    isNearExpiry: boolean
    daysUntilExpiry: number
    warningMessage?: string
  }
}

export default function EnhancedEquipmentManagementPage() {
  const [equipment, setEquipment] = useState<EnhancedEquipment[]>([])
  const [filteredEquipment, setFilteredEquipment] = useState<EnhancedEquipment[]>([])
  const [expiryNotifications, setExpiryNotifications] = useState<ExpiryNotification[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด')
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด')
  const [selectedCondition, setSelectedCondition] = useState('ทั้งหมด')
  const [showExpiredOnly, setShowExpiredOnly] = useState(false)
  const [showNearExpiryOnly, setShowNearExpiryOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const categories = ['ทั้งหมด', 'อุปกรณ์ตรวจวัด', 'อุปกรณ์ฝึกอบรม', 'อุปกรณ์ช่วยเหลือ', 'อุปกรณ์การแพทย์']
  const statuses = ['ทั้งหมด', 'available', 'borrowed', 'maintenance', 'damaged']
  const conditions = ['ทั้งหมด', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED']

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // จำลองการโหลดข้อมูล
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockData = generateMockEquipment()
        
        // ✨ เพิ่มข้อมูลสถานะหมดอายุ
        const filteredNotifications = notifications.filter((item: ExpiryNotification) => 
  item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
)
        const enhancedData = mockData.map(item => ({
        
          ...item,
          expiryStatus: calculateExpiryStatus(item.expiryDate)
        }))
        
        setEquipment(enhancedData)
        
        // ✨ สร้างการแจ้งเตือนหมดอายุ
        const notifications = generateExpiryNotifications(mockData)
        setExpiryNotifications(notifications)
        
      } catch (error) {
        console.error('Failed to load equipment:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // ✨ Enhanced filtering with expiry status
  useEffect(() => {
    let filtered = equipment

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'ทั้งหมด') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Status filter
    if (selectedStatus !== 'ทั้งหมด') {
      filtered = filtered.filter(item => item.status === selectedStatus)
    }

    // ✨ Expiry filters
    if (showExpiredOnly) {
      filtered = filtered.filter(item => item.expiryStatus?.isExpired)
    }

    if (showNearExpiryOnly) {
      filtered = filtered.filter(item => item.expiryStatus?.isNearExpiry)
    }

    setFilteredEquipment(filtered)
  }, [equipment, searchQuery, selectedCategory, selectedStatus, selectedCondition, showExpiredOnly, showNearExpiryOnly])

  // ✨ Enhanced statistics
  const stats = useMemo(() => {
    const total = equipment.length
    const available = equipment.filter(item => item.status === 'available').length
    const borrowed = equipment.filter(item => item.status === 'borrowed').length
    const maintenance = equipment.filter(item => item.status === 'maintenance').length
    const damaged = equipment.filter(item => item.status === 'damaged').length
    const expired = equipment.filter(item => item.expiryStatus?.isExpired).length
    const nearExpiry = equipment.filter(item => item.expiryStatus?.isNearExpiry).length

    return { total, available, borrowed, maintenance, damaged, expired, nearExpiry }
  }, [equipment])

  // ✨ Component สำหรับแสดงสถานะหมดอายุ
  const ExpiryStatusBadge = ({ equipment }: { equipment: EnhancedEquipment }) => {
    if (!equipment.expiryStatus) return null
    
    const { isExpired, isNearExpiry, daysUntilExpiry, warningMessage } = equipment.expiryStatus
    
    if (isExpired) {
      return (
        <span className={`${styles.statusBadge} ${styles.expired}`} title={warningMessage}>
          <XCircle size={12} />
          หมดอายุ
        </span>
      )
    }
    
    if (isNearExpiry) {
      return (
        <span className={`${styles.statusBadge} ${styles.nearExpiry}`} title={warningMessage}>
          <AlertTriangle size={12} />
          เกือบหมดอายุ ({daysUntilExpiry} วัน)
        </span>
      )
    }
    
    return (
      <span className={`${styles.statusBadge} ${styles.normal}`}>
        <Calendar size={12} />
        ปกติ
      </span>
    )
  }

  // ✨ Component สำหรับแสดงจำนวนอุปกรณ์
  const QuantityInfo = ({ equipment }: { equipment: EnhancedEquipment }) => (
    <div className={styles.quantityDisplay}>
      <div className={styles.quantityItem}>
        <span className={styles.quantityLabel}>ทั้งหมด:</span>
        <span className={styles.quantityValue}>{equipment.totalQuantity}</span>
      </div>
      <div className={styles.quantityItem}>
        <span className={styles.quantityLabel}>ยืมได้:</span>
        <span className={`${styles.quantityValue} ${equipment.availableQuantity === 0 ? styles.unavailable : styles.available}`}>
          {equipment.availableQuantity}
        </span>
      </div>
      {equipment.borrowedQuantity > 0 && (
        <div className={styles.quantityItem}>
          <span className={styles.quantityLabel}>ยืม:</span>
          <span className={styles.quantityValue}>{equipment.borrowedQuantity}</span>
        </div>
      )}
      {equipment.maintenanceQuantity > 0 && (
        <div className={styles.quantityItem}>
          <span className={styles.quantityLabel}>ซ่อม:</span>
          <span className={`${styles.quantityValue} ${styles.maintenance}`}>
            {equipment.maintenanceQuantity}
          </span>
        </div>
      )}
      {equipment.damagedQuantity > 0 && (
        <div className={styles.quantityItem}>
          <span className={styles.quantityLabel}>เสียหาย:</span>
          <span className={`${styles.quantityValue} ${styles.damaged}`}>
            {equipment.damagedQuantity}
          </span>
        </div>
      )}
    </div>
  )

  const handleSelectAll = () => {
    if (selectedItems.length === filteredEquipment.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredEquipment.map(item => item.id))
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  return (
    <div className={styles.equipmentPage}>
      {/* ✨ Expiry Notifications - แสดงที่ด้านบน */}
      {expiryNotifications.length > 0 && (
        <ExpiryNotifications />
      )}

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              <Package size={32} />
              จัดการอุปกรณ์การแพทย์
            </h1>
            <p className={styles.pageSubtitle}>
              จัดการและติดตามสถานะอุปกรณ์ทั้งหมดในระบบ
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link href="/admin/equipment/add" className={styles.primaryButton}>
              <Plus size={16} />
              เพิ่มอุปกรณ์ใหม่
            </Link>
            <button className={styles.secondaryButton}>
              <Download size={16} />
              ส่งออกข้อมูล
            </button>
          </div>
        </div>
      </div>

      {/* ✨ Enhanced Statistics Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Package size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.total}</span>
            <span className={styles.statLabel}>อุปกรณ์ทั้งหมด</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#10b981' }}>
            <Package size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.available}</span>
            <span className={styles.statLabel}>พร้อมใช้</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#f59e0b' }}>
            <Package size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.borrowed}</span>
            <span className={styles.statLabel}>ถูกยืม</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.nearExpiry}</span>
            <span className={styles.statLabel}>เกือบหมดอายุ</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#dc2626' }}>
            <XCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{stats.expired}</span>
            <span className={styles.statLabel}>หมดอายุแล้ว</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="ค้นหาอุปกรณ์..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterControls}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
          >
            <Filter size={16} />
            ตัวกรอง
          </button>
        </div>
      </div>

      {/* ✨ Enhanced Filter Panel */}
      {showFilters && (
        <div className={styles.filtersSection}>
          <div className={styles.filterRow}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.filterSelect}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={styles.filterSelect}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'ทั้งหมด' ? 'สถานะทั้งหมด' : 
                   status === 'available' ? 'พร้อมใช้' :
                   status === 'borrowed' ? 'ถูกยืม' :
                   status === 'maintenance' ? 'ซ่อมบำรุง' :
                   status === 'damaged' ? 'เสียหาย' : status}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.checkboxFilters}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showExpiredOnly}
                onChange={(e) => setShowExpiredOnly(e.target.checked)}
              />
              แสดงเฉพาะหมดอายุ ({stats.expired})
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={showNearExpiryOnly}
                onChange={(e) => setShowNearExpiryOnly(e.target.checked)}
              />
              แสดงเฉพาะเกือบหมดอายุ ({stats.nearExpiry})
            </label>
          </div>
        </div>
      )}

      {/* Equipment Table */}
      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <table className={styles.equipmentTable}>
            <thead>
              <tr>
                <th className={styles.checkboxHeader}>
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredEquipment.length && filteredEquipment.length > 0}
                    onChange={handleSelectAll}
                    className={styles.checkbox}
                  />
                </th>
                <th>รหัส</th>
                <th>ชื่ออุปกรณ์</th>
                <th>หมวดหมู่</th>
                <th>สถานที่</th>
                <th>สถานะ</th>
                <th>จำนวน</th>
                <th>สถานะหมดอายุ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map(item => (
                <tr key={item.id} className={styles.tableRow}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className={styles.checkbox}
                    />
                  </td>
                  <td className={styles.codeCell}>
                    <span className={styles.equipmentCode}>{item.model}</span>
                  </td>
                  <td className={styles.nameCell}>
                    <div className={styles.equipmentName}>
                      <span className={styles.categoryIcon}>
                        📦
                      </span>
                      <div>
                        <div className={styles.name}>{item.name}</div>
                        <div className={styles.serial}>{item.serialNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={styles.category}>
                      {item.category}
                    </span>
                  </td>
                  <td>{item.location}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[item.status]}`}>
                      {item.status === 'available' ? 'พร้อมใช้' :
                       item.status === 'borrowed' ? 'ถูกยืม' :
                       item.status === 'maintenance' ? 'ซ่อมบำรุง' :
                       item.status === 'damaged' ? 'เสียหาย' : item.status}
                    </span>
                  </td>
                  <td>
                    <QuantityInfo equipment={item} />
                  </td>
                  <td>
                    <ExpiryStatusBadge equipment={item} />
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionButton} title="ดูรายละเอียด">
                        <Eye size={14} />
                      </button>
                      <button className={styles.actionButton} title="แก้ไข">
                        <Edit size={14} />
                      </button>
                      <button className={styles.actionButton} title="ลบ">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredEquipment.length === 0 && (
          <div className={styles.emptyState}>
            <Package size={64} />
            <h3>ไม่พบอุปกรณ์</h3>
            <p>ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
          </div>
        )}
      </div>
    </div>
  )
}