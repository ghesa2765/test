// components/admin/EquipmentTable.tsx
'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, MoreHorizontal, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react'
import styles from '@/styles/components/equipment-table.module.css'

interface Equipment {
  id: string
  name: string
  category: string
  model: string
  serialNumber: string
  status: 'available' | 'borrowed' | 'maintenance' | 'broken'
  location: string
  description: string
  addedDate: string
  lastMaintenance?: string
  borrowCount: number
}

interface EquipmentTableProps {
  equipment: Equipment[]
  onEdit: (equipment: Equipment) => void
  onDelete: (equipment: Equipment) => void
}

export default function EquipmentTable({ equipment, onEdit, onDelete }: EquipmentTableProps) {
  const [sortField, setSortField] = useState<keyof Equipment>('addedDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleSort = (field: keyof Equipment) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedEquipment = [...equipment].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const getStatusIcon = (status: Equipment['status']) => {
    switch (status) {
      case 'available':
        return <CheckCircle size={16} className={styles.statusIconAvailable} />
      case 'borrowed':
        return <Clock size={16} className={styles.statusIconBorrowed} />
      case 'maintenance':
        return <AlertTriangle size={16} className={styles.statusIconMaintenance} />
      case 'broken':
        return <XCircle size={16} className={styles.statusIconBroken} />
      default:
        return null
    }
  }

  const getStatusText = (status: Equipment['status']) => {
    switch (status) {
      case 'available': return 'พร้อมใช้งาน'
      case 'borrowed': return 'ถูกยืม'
      case 'maintenance': return 'ซ่อมบำรุง'
      case 'broken': return 'เสียหาย'
      default: return status
    }
  }

  const getStatusClass = (status: Equipment['status']) => {
    switch (status) {
      case 'available': return styles.statusAvailable
      case 'borrowed': return styles.statusBorrowed
      case 'maintenance': return styles.statusMaintenance
      case 'broken': return styles.statusBroken
      default: return ''
    }
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === equipment.length 
        ? []
        : equipment.map(item => item.id)
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className={styles.tableContainer}>
      {/* Table Actions */}
      <div className={styles.tableActions}>
        <div className={styles.tableInfo}>
          <span className={styles.resultCount}>
            แสดง {equipment.length} รายการ
            {selectedItems.length > 0 && (
              <span className={styles.selectedCount}>
                ({selectedItems.length} รายการที่เลือก)
              </span>
            )}
          </span>
        </div>
        
        {selectedItems.length > 0 && (
          <div className={styles.bulkActions}>
            <button className={styles.bulkActionBtn}>
              <Edit size={16} />
              แก้ไขแบบกลุ่ม
            </button>
            <button className={styles.bulkActionBtn}>
              <Trash2 size={16} />
              ลบที่เลือก
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th className={styles.checkboxCell}>
                <input
                  type="checkbox"
                  checked={selectedItems.length === equipment.length && equipment.length > 0}
                  onChange={toggleSelectAll}
                  className={styles.checkbox}
                />
              </th>
              <th 
                className={`${styles.sortableHeader} ${sortField === 'name' ? styles.sorted : ''}`}
                onClick={() => handleSort('name')}
              >
                ชื่ออุปกรณ์
                <span className={styles.sortIndicator}>
                  {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th 
                className={`${styles.sortableHeader} ${sortField === 'category' ? styles.sorted : ''}`}
                onClick={() => handleSort('category')}
              >
                หมวดหมู่
                <span className={styles.sortIndicator}>
                  {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th className={styles.tableHeader}>รุ่น/SN</th>
              <th 
                className={`${styles.sortableHeader} ${sortField === 'status' ? styles.sorted : ''}`}
                onClick={() => handleSort('status')}
              >
                สถานะ
                <span className={styles.sortIndicator}>
                  {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th className={styles.tableHeader}>สถานที่</th>
              <th 
                className={`${styles.sortableHeader} ${sortField === 'borrowCount' ? styles.sorted : ''}`}
                onClick={() => handleSort('borrowCount')}
              >
                ยืม
                <span className={styles.sortIndicator}>
                  {sortField === 'borrowCount' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th 
                className={`${styles.sortableHeader} ${sortField === 'addedDate' ? styles.sorted : ''}`}
                onClick={() => handleSort('addedDate')}
              >
                วันที่เพิ่ม
                <span className={styles.sortIndicator}>
                  {sortField === 'addedDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th className={styles.actionsHeader}>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {sortedEquipment.map((item) => (
              <tr 
                key={item.id} 
                className={`${styles.tableRow} ${selectedItems.includes(item.id) ? styles.selectedRow : ''}`}
              >
                <td className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    className={styles.checkbox}
                  />
                </td>
                <td className={styles.nameCell}>
                  <div className={styles.equipmentInfo}>
                    <div className={styles.equipmentName}>{item.name}</div>
                    <div className={styles.equipmentId}>#{item.id}</div>
                  </div>
                </td>
                <td className={styles.categoryCell}>
                  <span className={styles.categoryTag}>{item.category}</span>
                </td>
                <td className={styles.modelCell}>
                  <div className={styles.modelInfo}>
                    <div className={styles.modelName}>{item.model}</div>
                    <div className={styles.serialNumber}>{item.serialNumber}</div>
                  </div>
                </td>
                <td className={styles.statusCell}>
                  <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                    {getStatusIcon(item.status)}
                    {getStatusText(item.status)}
                  </span>
                </td>
                <td className={styles.locationCell}>
                  {item.location}
                </td>
                <td className={styles.borrowCountCell}>
                  <span className={styles.borrowCount}>{item.borrowCount}</span>
                </td>
                <td className={styles.dateCell}>
                  {formatDate(item.addedDate)}
                </td>
                <td className={styles.actionsCell}>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => onEdit(item)}
                      title="แก้ไข"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className={styles.actionBtn}
                      title="ดูรายละเอียด"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => onDelete(item)}
                      title="ลบ"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {equipment.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h3 className={styles.emptyTitle}>ไม่พบอุปกรณ์</h3>
          <p className={styles.emptyText}>ยังไม่มีอุปกรณ์ในระบบ หรือลองปรับเงื่อนไขการค้นหา</p>
        </div>
      )}
    </div>
  )
}