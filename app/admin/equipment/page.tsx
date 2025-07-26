// app/admin/equipment/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  Settings
} from 'lucide-react'
import styles from '@/styles/pages/admin-equipment.module.css'

interface Equipment {
  id: string
  code: string
  name: string
  category: {
    name: string
    icon: string
  }
  location: {
    name: string
  }
  status: 'AVAILABLE' | 'BORROWED' | 'MAINTENANCE' | 'DAMAGED'
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED'
  totalBorrows: number
  lastBorrow?: {
    user: string
    date: string
  }
  createdAt: string
}

// Mock data with Thai equipment
const mockEquipment: Equipment[] = [
  {
    id: '1',
    code: 'HEM-001',
    name: 'เครื่องวัดความดันโลหิต OMRON',
    category: { name: 'อุปกรณ์ตรวจวัด', icon: '🩺' },
    location: { name: 'ห้องตรวจ A' },
    status: 'AVAILABLE',
    condition: 'GOOD',
    totalBorrows: 45,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    code: 'CPR-001',
    name: 'หุ่นจำลอง CPR',
    category: { name: 'อุปกรณ์ฝึกอบรม', icon: '🫁' },
    location: { name: 'ห้องฝึกปฏิบัติ' },
    status: 'BORROWED',
    condition: 'GOOD',
    totalBorrows: 23,
    lastBorrow: { user: 'นพ.สมชาย ใจดี', date: '2024-01-20' },
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    code: 'WLK-001',
    name: 'วอกเกอร์ 4 ขา',
    category: { name: 'อุปกรณ์ช่วยเหลือ', icon: '🚶' },
    location: { name: 'ห้องกายภาพบำบัด' },
    status: 'MAINTENANCE',
    condition: 'FAIR',
    totalBorrows: 67,
    createdAt: '2023-12-05'
  },
  {
    id: '4',
    code: 'TMP-001',
    name: 'เครื่องวัดอุณหภูมิดิจิทัล',
    category: { name: 'อุปกรณ์ตรวจวัด', icon: '🌡️' },
    location: { name: 'ห้องตรวจ B' },
    status: 'AVAILABLE',
    condition: 'EXCELLENT',
    totalBorrows: 89,
    createdAt: '2024-01-08'
  },
  {
    id: '5',
    code: 'WCH-001',
    name: 'วิลแชร์',
    category: { name: 'อุปกรณ์ช่วยเหลือ', icon: '♿' },
    location: { name: 'ห้องผู้ป่วยนอก' },
    status: 'DAMAGED',
    condition: 'POOR',
    totalBorrows: 156,
    createdAt: '2023-11-20'
  }
]

const categories = ['ทั้งหมด', 'อุปกรณ์ตรวจวัด', 'อุปกรณ์ฝึกอบรม', 'อุปกรณ์ช่วยเหลือ', 'อุปกรณ์การแพทย์']
const statuses = ['ทั้งหมด', 'AVAILABLE', 'BORROWED', 'MAINTENANCE', 'DAMAGED']
const conditions = ['ทั้งหมด', 'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DAMAGED']

export default function EquipmentManagementPage() {
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment)
  const [filteredEquipment, setFilteredEquipment] = useState<Equipment[]>(mockEquipment)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด')
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด')
  const [selectedCondition, setSelectedCondition] = useState('ทั้งหมด')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [isLoading, setIsLoading] = useState(false)

  // Filter and search logic
  useEffect(() => {
    let filtered = equipment

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'ทั้งหมด') {
      filtered = filtered.filter(item => item.category.name === selectedCategory)
    }

    // Status filter
    if (selectedStatus !== 'ทั้งหมด') {
      filtered = filtered.filter(item => item.status === selectedStatus)
    }

    // Condition filter
    if (selectedCondition !== 'ทั้งหมด') {
      filtered = filtered.filter(item => item.condition === selectedCondition)
    }

    setFilteredEquipment(filtered)
  }, [equipment, searchQuery, selectedCategory, selectedStatus, selectedCondition])

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
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const getStatusDisplay = (status: Equipment['status']) => {
    const statusMap = {
      'AVAILABLE': { text: 'พร้อมใช้', class: 'available' },
      'BORROWED': { text: 'ถูกยืม', class: 'borrowed' },
      'MAINTENANCE': { text: 'ซ่อมบำรุง', class: 'maintenance' },
      'DAMAGED': { text: 'เสียหาย', class: 'damaged' }
    }
    return statusMap[status]
  }

  const getConditionDisplay = (condition: Equipment['condition']) => {
    const conditionMap = {
      'EXCELLENT': { text: 'ดีเยี่ยม', class: 'excellent' },
      'GOOD': { text: 'ดี', class: 'good' },
      'FAIR': { text: 'พอใช้', class: 'fair' },
      'POOR': { text: 'แย่', class: 'poor' },
      'DAMAGED': { text: 'เสียหาย', class: 'damaged' }
    }
    return conditionMap[condition]
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems)
    // Implement bulk actions
  }

  const handleDelete = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบอุปกรณ์นี้?')) {
      setEquipment(prev => prev.filter(item => item.id !== id))
      setSelectedItems(prev => prev.filter(item => item !== id))
    }
  }

  const handleExport = () => {
    console.log('Exporting equipment data...')
    // Implement export functionality
  }

  return (
    <div className={styles.equipmentPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>🏥 จัดการอุปกรณ์การแพทย์</h1>
            <p className={styles.pageSubtitle}>
              จัดการและติดตามอุปกรณ์ทั้งหมดในคลินิก
            </p>
          </div>
          <div className={styles.headerActions}>
            <button 
              className={styles.secondaryButton}
              onClick={handleExport}
            >
              <Download size={18} />
              ส่งออกข้อมูล
            </button>
            <button className={styles.secondaryButton}>
              <Upload size={18} />
              นำเข้าข้อมูล
            </button>
            <Link href="/admin/equipment/add" className={styles.primaryButton}>
              <Plus size={18} />
              เพิ่มอุปกรณ์ใหม่
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{equipment.length}</div>
            <div className={styles.statLabel}>อุปกรณ์ทั้งหมد</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {equipment.filter(e => e.status === 'AVAILABLE').length}
            </div>
            <div className={styles.statLabel}>พร้อมใช้</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📋</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {equipment.filter(e => e.status === 'BORROWED').length}
            </div>
            <div className={styles.statLabel}>ถูกยืม</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔧</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {equipment.filter(e => e.status === 'MAINTENANCE').length}
            </div>
            <div className={styles.statLabel}>ซ่อมบำรุง</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.controlsSection}>
        <div className={styles.searchSection}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="ค้นหาอุปกรณ์ด้วยชื่อ, รหัส, หรือหมวดหมู่..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button
            className={`${styles.filterButton} ${showFilters ? styles.active : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            ตัวกรอง
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className={styles.filtersSection}>
            <div className={styles.filterGroup}>
              <label>หมวดหมู่:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.filterSelect}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>สถานะ:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={styles.filterSelect}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'ทั้งหมด' ? status : getStatusDisplay(status as any)?.text || status}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>สภาพ:</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className={styles.filterSelect}
              >
                {conditions.map(condition => (
                  <option key={condition} value={condition}>
                    {condition === 'ทั้งหมด' ? condition : getConditionDisplay(condition as any)?.text || condition}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className={styles.bulkActions}>
            <span className={styles.selectedCount}>
              เลือกแล้ว {selectedItems.length} รายการ
            </span>
            <div className={styles.bulkButtons}>
              <button
                className={styles.bulkButton}
                onClick={() => handleBulkAction('export')}
              >
                ส่งออก
              </button>
              <button
                className={styles.bulkButton}
                onClick={() => handleBulkAction('update-status')}
              >
                เปลี่ยนสถานะ
              </button>
              <button
                className={`${styles.bulkButton} ${styles.danger}`}
                onClick={() => handleBulkAction('delete')}
              >
                ลบ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Equipment Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>
            รายการอุปกรณ์ ({filteredEquipment.length} รายการ)
          </div>
          <div className={styles.tableActions}>
            <button 
              className={`${styles.viewToggle} ${viewMode === 'table' ? styles.active : ''}`}
              onClick={() => setViewMode('table')}
            >
              ตาราง
            </button>
            <button 
              className={`${styles.viewToggle} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              กริด
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
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
                  <th>สภาพ</th>
                  <th>การใช้งาน</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((item) => {
                  const statusInfo = getStatusDisplay(item.status)
                  const conditionInfo = getConditionDisplay(item.condition)
                  
                  return (
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
                        <span className={styles.equipmentCode}>{item.code}</span>
                      </td>
                      <td className={styles.nameCell}>
                        <div className={styles.equipmentName}>
                          <span className={styles.categoryIcon}>
                            {item.category.icon}
                          </span>
                          <div>
                            <div className={styles.name}>{item.name}</div>
                            {item.lastBorrow && (
                              <div className={styles.lastBorrow}>
                                ยืมโดย: {item.lastBorrow.user}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.category}>
                          {item.category.name}
                        </span>
                      </td>
                      <td>{item.location.name}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[statusInfo.class]}`}>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.conditionBadge} ${styles[conditionInfo.class]}`}>
                          {conditionInfo.text}
                        </span>
                      </td>
                      <td className={styles.usageCell}>
                        <div className={styles.usageStats}>
                          <span className={styles.borrowCount}>
                            {item.totalBorrows} ครั้ง
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <Link
                            href={`/admin/equipment/${item.id}`}
                            className={styles.actionButton}
                            title="ดูรายละเอียด"
                          >
                            <Eye size={16} />
                          </Link>
                          <Link
                            href={`/admin/equipment/edit/${item.id}`}
                            className={styles.actionButton}
                            title="แก้ไข"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            className={`${styles.actionButton} ${styles.danger}`}
                            onClick={() => handleDelete(item.id)}
                            title="ลบ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredEquipment.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📦</div>
                <h3>ไม่พบอุปกรณ์</h3>
                <p>ไม่มีอุปกรณ์ที่ตรงกับเงื่อนไขการค้นหา</p>
                <button
                  className={styles.primaryButton}
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('ทั้งหมด')
                    setSelectedStatus('ทั้งหมด')
                    setSelectedCondition('ทั้งหมด')
                  }}
                >
                  ล้างตัวกรอง
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}