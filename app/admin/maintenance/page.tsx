// app/admin/maintenance/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus,
  Calendar,
  Wrench, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  Bell,
  Settings,
  AlertCircle
} from 'lucide-react'
import styles from '@/styles/pages/admin-maintenance.module.css'

interface MaintenanceRecord {
  id: string
  equipment: {
    id: string
    name: string
    code: string
    category: {
      name: string
      icon: string
    }
  }
  location: {
    name: string
    building: string
  }
  type: 'scheduled' | 'corrective' | 'preventive' | 'emergency'
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'critical'
  scheduledDate: string
  completedDate?: string
  estimatedDuration: number // in hours
  actualDuration?: number
  technician: {
    id: string
    name: string
    specialization: string
  }
  description: string
  notes?: string
  cost?: number
  partsUsed?: string[]
  nextMaintenanceDate?: string
  createdAt: string
  updatedAt: string
}

export default function MaintenancePage() {
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MaintenanceRecord[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

  // Mock data
  const mockMaintenanceData: MaintenanceRecord[] = [
    {
      id: 'MAINT001',
      equipment: {
        id: 'EQ001',
        name: 'เครื่องวัดความดันโลหิตดิจิทัล',
        code: 'BP-DIG-001',
        category: {
          name: 'การตรวจวัด',
          icon: 'stethoscope'
        }
      },
      location: {
        name: 'ห้องตรวจ A',
        building: 'อาคาร 1'
      },
      type: 'scheduled',
      status: 'pending',
      priority: 'medium',
      scheduledDate: '2025-01-30',
      estimatedDuration: 2,
      technician: {
        id: 'TECH001',
        name: 'วิทยา เครื่องมือ',
        specialization: 'อิเล็กทรอนิกส์การแพทย์'
      },
      description: 'ตรวจสอบความแม่นยำการวัดและสอบเทียบเครื่องมือ',
      createdAt: '2025-01-20',
      updatedAt: '2025-01-25',
      nextMaintenanceDate: '2025-04-30'
    },
    {
      id: 'MAINT002',
      equipment: {
        id: 'EQ002',
        name: 'เครื่อง Ultrasound',
        code: 'US-001',
        category: {
          name: 'การตรวจภาพ',
          icon: 'monitor'
        }
      },
      location: {
        name: 'ห้องตรวจ B',
        building: 'อาคาร 1'
      },
      type: 'corrective',
      status: 'in-progress',
      priority: 'high',
      scheduledDate: '2025-01-28',
      estimatedDuration: 4,
      technician: {
        id: 'TECH002',
        name: 'สมชาย ซ่อมแซม',
        specialization: 'เครื่องมือถ่ายภาพ'
      },
      description: 'ซ่อมแซมจอแสดงผลที่มีปัญหาแสดงภาพไม่ชัด',
      notes: 'ต้องสั่งจอใหม่จากผู้ผลิต',
      cost: 45000,
      createdAt: '2025-01-25',
      updatedAt: '2025-01-27'
    },
    {
      id: 'MAINT003',
      equipment: {
        id: 'EQ003',
        name: 'เครื่องตรวจหูคอจมูก',
        code: 'ENT-001',
        category: {
          name: 'ตรวจเฉพาะทาง',
          icon: 'eye'
        }
      },
      location: {
        name: 'ห้องตรวจพิเศษ',
        building: 'อาคาร 2'
      },
      type: 'preventive',
      status: 'completed',
      priority: 'low',
      scheduledDate: '2025-01-15',
      completedDate: '2025-01-15',
      estimatedDuration: 1,
      actualDuration: 1.5,
      technician: {
        id: 'TECH001',
        name: 'วิทยา เครื่องมือ',
        specialization: 'อิเล็กทรอนิกส์การแพทย์'
      },
      description: 'ทำความสะอาดเลนส์และตรวจสอบระบบไฟ',
      notes: 'เปลี่ยนหลอดไฟแล้ว',
      cost: 1200,
      partsUsed: ['หลอดไฟ LED'],
      createdAt: '2025-01-10',
      updatedAt: '2025-01-15',
      nextMaintenanceDate: '2025-04-15'
    },
    {
      id: 'MAINT004',
      equipment: {
        id: 'EQ004',
        name: 'เครื่องวัดน้ำตาลในเลือด',
        code: 'GLU-001',
        category: {
          name: 'การตรวจวัด',
          icon: 'droplet'
        }
      },
      location: {
        name: 'ห้องคัดกรอง',
        building: 'อาคาร 1'
      },
      type: 'emergency',
      status: 'overdue',
      priority: 'critical',
      scheduledDate: '2025-01-20',
      estimatedDuration: 3,
      technician: {
        id: 'TECH003',
        name: 'นิคม ช่างเทคนิค',
        specialization: 'เครื่องมือตรวจวัด'
      },
      description: 'เครื่องแสดงค่าผิดพลาด Error Code 05',
      notes: 'รอการติดต่อกับผู้ผลิต',
      createdAt: '2025-01-18',
      updatedAt: '2025-01-25'
    }
  ]

  // Initialize data
  useEffect(() => {
    const timer = setTimeout(() => {
      setMaintenanceRecords(mockMaintenanceData)
      setFilteredRecords(mockMaintenanceData)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = maintenanceRecords

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.equipment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(record => record.type === typeFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(record => record.priority === priorityFilter)
    }

    setFilteredRecords(filtered)
  }, [maintenanceRecords, searchTerm, statusFilter, typeFilter, priorityFilter])

  // Status badge component
  const StatusBadge = ({ status }: { status: MaintenanceRecord['status'] }) => {
    const getStatusConfig = (status: MaintenanceRecord['status']) => {
      switch (status) {
        case 'pending':
          return { icon: Clock, text: 'รอดำเนินการ', className: styles.statusPending }
        case 'in-progress':
          return { icon: Settings, text: 'กำลังดำเนินการ', className: styles.statusInProgress }
        case 'completed':
          return { icon: CheckCircle, text: 'เสร็จสิ้น', className: styles.statusCompleted }
        case 'cancelled':
          return { icon: AlertCircle, text: 'ยกเลิก', className: styles.statusCancelled }
        case 'overdue':
          return { icon: AlertTriangle, text: 'เกินกำหนด', className: styles.statusOverdue }
        default:
          return { icon: Clock, text: status, className: styles.statusPending }
      }
    }

    const { icon: Icon, text, className } = getStatusConfig(status)

    return (
      <span className={`${styles.statusBadge} ${className}`}>
        <Icon size={14} />
        {text}
      </span>
    )
  }

  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: MaintenanceRecord['priority'] }) => {
    const getPriorityConfig = (priority: MaintenanceRecord['priority']) => {
      switch (priority) {
        case 'low':
          return { text: 'ต่ำ', className: styles.priorityLow }
        case 'medium':
          return { text: 'ปานกลาง', className: styles.priorityMedium }
        case 'high':
          return { text: 'สูง', className: styles.priorityHigh }
        case 'critical':
          return { text: 'วิกฤต', className: styles.priorityCritical }
        default:
          return { text: priority, className: styles.priorityMedium }
      }
    }

    const { text, className } = getPriorityConfig(priority)

    return (
      <span className={`${styles.priorityBadge} ${className}`}>
        {text}
      </span>
    )
  }

  // Type badge component
  const TypeBadge = ({ type }: { type: MaintenanceRecord['type'] }) => {
    const getTypeConfig = (type: MaintenanceRecord['type']) => {
      switch (type) {
        case 'scheduled':
          return { text: 'ตามกำหนด', className: styles.typeScheduled }
        case 'corrective':
          return { text: 'ซ่อมแซม', className: styles.typeCorrective }
        case 'preventive':
          return { text: 'ป้องกัน', className: styles.typePreventive }
        case 'emergency':
          return { text: 'ฉุกเฉิน', className: styles.typeEmergency }
        default:
          return { text: type, className: styles.typeScheduled }
      }
    }

    const { text, className } = getTypeConfig(type)

    return (
      <span className={`${styles.typeBadge} ${className}`}>
        {text}
      </span>
    )
  }

  // Statistics summary
  const getStatistics = () => {
    return {
      total: maintenanceRecords.length,
      pending: maintenanceRecords.filter(r => r.status === 'pending').length,
      inProgress: maintenanceRecords.filter(r => r.status === 'in-progress').length,
      overdue: maintenanceRecords.filter(r => r.status === 'overdue').length,
      completed: maintenanceRecords.filter(r => r.status === 'completed').length,
      critical: maintenanceRecords.filter(r => r.priority === 'critical').length
    }
  }

  const stats = getStatistics()

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>กำลังโหลดข้อมูลการบำรุงรักษา...</p>
      </div>
    )
  }

  return (
    <div className={styles.maintenancePage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>
            <Wrench size={32} />
            การบำรุงรักษาอุปกรณ์
          </h1>
          <p className={styles.pageSubtitle}>จัดการแผนและรายการบำรุงรักษาอุปกรณ์การแพทย์</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn}>
            <Download size={18} />
            ส่งออกรายงาน
          </button>
          <button className={styles.scheduleBtn}>
            <Calendar size={18} />
            จัดตารางบำรุงรักษา
          </button>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            เพิ่มรายการบำรุงรักษา
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Wrench size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>รายการทั้งหมด</h3>
            <p className={styles.statNumber}>{stats.total}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>รอดำเนินการ</h3>
            <p className={styles.statNumber}>{stats.pending}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Settings size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>กำลังดำเนินการ</h3>
            <p className={styles.statNumber}>{stats.inProgress}</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <AlertTriangle size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>เกินกำหนด</h3>
            <p className={styles.statNumber}>{stats.overdue}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.filtersSection}>
        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="ค้นหาอุปกรณ์, ช่างเทคนิค หรือรายละเอียด..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="pending">รอดำเนินการ</option>
            <option value="in-progress">กำลังดำเนินการ</option>
            <option value="completed">เสร็จสิ้น</option>
            <option value="cancelled">ยกเลิก</option>
            <option value="overdue">เกินกำหนด</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">ประเภททั้งหมด</option>
            <option value="scheduled">ตามกำหนด</option>
            <option value="corrective">ซ่อมแซม</option>
            <option value="preventive">ป้องกัน</option>
            <option value="emergency">ฉุกเฉิน</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">ความสำคัญทั้งหมด</option>
            <option value="low">ต่ำ</option>
            <option value="medium">ปานกลาง</option>
            <option value="high">สูง</option>
            <option value="critical">วิกฤต</option>
          </select>
        </div>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${viewMode === 'table' ? styles.active : ''}`}
            onClick={() => setViewMode('table')}
          >
            ตาราง
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === 'cards' ? styles.active : ''}`}
            onClick={() => setViewMode('cards')}
          >
            การ์ด
          </button>
        </div>
      </div>

      {/* Maintenance Records Table */}
      <div className={styles.tableContainer}>
        <table className={styles.maintenanceTable}>
          <thead>
            <tr>
              <th>อุปกรณ์</th>
              <th>ประเภท</th>
              <th>สถานะ</th>
              <th>ความสำคัญ</th>
              <th>วันที่กำหนด</th>
              <th>ช่างเทคนิค</th>
              <th>ระยะเวลา</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className={styles.tableRow}>
                <td>
                  <div className={styles.equipmentInfo}>
                    <div className={styles.equipmentName}>{record.equipment.name}</div>
                    <div className={styles.equipmentCode}>รหัส: {record.equipment.code}</div>
                    <div className={styles.equipmentLocation}>
                      📍 {record.location.name}
                    </div>
                  </div>
                </td>
                <td>
                  <TypeBadge type={record.type} />
                </td>
                <td>
                  <StatusBadge status={record.status} />
                </td>
                <td>
                  <PriorityBadge priority={record.priority} />
                </td>
                <td>
                  <div className={styles.dateInfo}>
                    <div>{new Date(record.scheduledDate).toLocaleDateString('th-TH')}</div>
                    {record.status === 'overdue' && (
                      <div className={styles.overdueText}>
                        เกิน {Math.ceil((new Date().getTime() - new Date(record.scheduledDate).getTime()) / (1000 * 60 * 60 * 24))} วัน
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.technicianInfo}>
                    <div className={styles.technicianName}>{record.technician.name}</div>
                    <div className={styles.technicianSpecialty}>{record.technician.specialization}</div>
                  </div>
                </td>
                <td>
                  <div className={styles.durationInfo}>
                    <div>ประเมิน: {record.estimatedDuration} ชม.</div>
                    {record.actualDuration && (
                      <div>จริง: {record.actualDuration} ชม.</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.actionBtn}
                      onClick={() => setSelectedRecord(record)}
                      title="ดูรายละเอียด"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className={styles.actionBtn}
                      title="แก้ไข"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className={styles.actionBtn}
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
        
        {filteredRecords.length === 0 && (
          <div className={styles.emptyState}>
            <Wrench size={48} />
            <h3>ไม่พบรายการบำรุงรักษา</h3>
            <p>ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
          </div>
        )}
      </div>
    </div>
  )
}