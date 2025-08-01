// app/admin/fines/page.tsx
'use client'

import { useState } from 'react'
import { 
  DollarSign, Clock, AlertTriangle, CheckCircle, 
  Search, Filter, Download, Plus, Eye, Edit, Trash2
} from 'lucide-react'
import styles from '@/styles/pages/admin-fines.module.css'

interface FineRecord {
  id: string
  userId: string
  userName: string
  equipmentId: string
  equipmentName: string
  fineAmount: number
  fineReason: string
  dueDate: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  createdDate: string
}

export default function AdminFines() {
  const [fines, setFines] = useState<FineRecord[]>([
    {
      id: 'F001',
      userId: '6606276',
      userName: 'นิคม ใจดี',
      equipmentId: 'EQ001',
      equipmentName: 'เครื่องวัดความดันโลหิต OMRON',
      fineAmount: 150,
      fineReason: 'คืนอุปกรณ์ล่าช้า 3 วัน',
      dueDate: '2025-08-15',
      status: 'pending',
      createdDate: '2025-08-01'
    },
    {
      id: 'F002',
      userId: '6612345',
      userName: 'สมหวัง จันทร์',
      equipmentId: 'EQ002',
      equipmentName: 'อุปกรณ์ Ultrasound',
      fineAmount: 300,
      fineReason: 'อุปกรณ์ชำรุดจากการใช้งาน',
      dueDate: '2025-08-10',
      status: 'overdue',
      createdDate: '2025-07-25'
    },
    {
      id: 'F003',
      userId: '6609876',
      userName: 'วิสูตร งดงาม',
      equipmentId: 'EQ003',
      equipmentName: 'เครื่องวัดอุณหภูมิ',
      fineAmount: 100,
      fineReason: 'คืนอุปกรณ์ล่าช้า 2 วัน',
      dueDate: '2025-08-20',
      status: 'paid',
      createdDate: '2025-08-05'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className={`${styles.statusBadge} ${styles.pending}`}>รอชำระ</span>
      case 'paid':
        return <span className={`${styles.statusBadge} ${styles.paid}`}>ชำระแล้ว</span>
      case 'overdue':
        return <span className={`${styles.statusBadge} ${styles.overdue}`}>เกินกำหนด</span>
      case 'cancelled':
        return <span className={`${styles.statusBadge} ${styles.cancelled}`}>ยกเลิก</span>
      default:
        return <span className={styles.statusBadge}>-</span>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount)
  }

  const filteredFines = fines.filter(fine => {
    const matchesSearch = fine.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fine.equipmentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || fine.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalFines = fines.reduce((sum, fine) => sum + fine.fineAmount, 0)
  const pendingFines = fines.filter(f => f.status === 'pending').length
  const overdueFines = fines.filter(f => f.status === 'overdue').length
  const paidFines = fines.filter(f => f.status === 'paid').length

  return (
    <div className={styles.finesPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>
            <DollarSign size={28} />
            จัดการค่าปรับ
          </h1>
          <p className={styles.pageSubtitle}>
            จัดการและติดตามค่าปรับของผู้ใช้งานอุปกรณ์
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>
            <Download size={18} />
            ส่งออกรายงาน
          </button>
          <button className={styles.addBtn}>
            <Plus size={18} />
            เพิ่มค่าปรับ
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f59e0b' }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{formatCurrency(totalFines)}</h3>
            <p>ค่าปรับทั้งหมด</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#3b82f6' }}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{pendingFines}</h3>
            <p>รอชำระ</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{overdueFines}</h3>
            <p>เกินกำหนด</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{paidFines}</h3>
            <p>ชำระแล้ว</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="ค้นหาผู้ใช้หรืออุปกรณ์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filterControls}>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.statusFilter}
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="pending">รอชำระ</option>
            <option value="overdue">เกินกำหนด</option>
            <option value="paid">ชำระแล้ว</option>
            <option value="cancelled">ยกเลิก</option>
          </select>
          
          <button className={styles.filterBtn}>
            <Filter size={18} />
            ตัวกรอง
          </button>
        </div>
      </div>

      {/* Fines Table */}
      <div className={styles.tableContainer}>
        <table className={styles.finesTable}>
          <thead>
            <tr>
              <th>รหัส</th>
              <th>ผู้ใช้</th>
              <th>อุปกรณ์</th>
              <th>จำนวนเงิน</th>
              <th>เหตุผล</th>
              <th>กำหนดชำระ</th>
              <th>สถานะ</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredFines.map((fine) => (
              <tr key={fine.id}>
                <td className={styles.codeCell}>{fine.id}</td>
                <td>
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{fine.userName}</span>
                    <span className={styles.userId}>ID: {fine.userId}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.equipmentInfo}>
                    <span className={styles.equipmentName}>{fine.equipmentName}</span>
                    <span className={styles.equipmentId}>{fine.equipmentId}</span>
                  </div>
                </td>
                <td className={styles.amountCell}>
                  {formatCurrency(fine.fineAmount)}
                </td>
                <td className={styles.reasonCell}>{fine.fineReason}</td>
                <td>{new Date(fine.dueDate).toLocaleDateString('th-TH')}</td>
                <td>{getStatusBadge(fine.status)}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.viewBtn} title="ดูรายละเอียด">
                      <Eye size={14} />
                    </button>
                    <button className={styles.editBtn} title="แก้ไข">
                      <Edit size={14} />
                    </button>
                    <button className={styles.deleteBtn} title="ลบ">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}