// app/admin/users/page.tsx
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
  UserCheck,
  UserX,
  Mail,
  Phone,
  Shield,
  User
} from 'lucide-react'
import styles from '@/styles/pages/admin-users.module.css'

interface UserData {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'STAFF' | 'USER'
  department: string
  position: string
  phone?: string
  isActive: boolean
  isVerified: boolean
  lastLogin?: string
  totalBookings: number
  activeBookings: number
  createdAt: string
}

// Mock data สำหรับผู้ใช้
const mockUsers: UserData[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@rsu.ac.th',
    firstName: 'ผู้ดูแล',
    lastName: 'ระบบ',
    role: 'ADMIN',
    department: 'IT',
    position: 'ผู้ดูแลระบบ',
    phone: '02-997-2200',
    isActive: true,
    isVerified: true,
    lastLogin: '2024-01-26 08:30:00',
    totalBookings: 0,
    activeBookings: 0,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    username: 'doctor1',
    email: 'doctor1@rsu.ac.th',
    firstName: 'นพ.สมชาย',
    lastName: 'ใจดี',
    role: 'USER',
    department: 'อายุรกรรม',
    position: 'แพทย์ประจำ',
    phone: '02-997-2201',
    isActive: true,
    isVerified: true,
    lastLogin: '2024-01-25 16:45:00',
    totalBookings: 45,
    activeBookings: 2,
    createdAt: '2024-01-05'
  },
  {
    id: '3',
    username: 'nurse1',
    email: 'nurse1@rsu.ac.th',
    firstName: 'พย.สุดา',
    lastName: 'จริงใจ',
    role: 'USER',
    department: 'พยาบาล',
    position: 'พยาบาลวิชาชีพ',
    phone: '02-997-2202',
    isActive: true,
    isVerified: true,
    lastLogin: '2024-01-26 07:15:00',
    totalBookings: 67,
    activeBookings: 1,
    createdAt: '2024-01-03'
  },
  {
    id: '4',
    username: 'staff1',
    email: 'staff1@rsu.ac.th',
    firstName: 'วิไล',
    lastName: 'มานะดี',
    role: 'USER',
    department: 'กายภาพบำบัด',
    position: 'นักกายภาพบำบัด',
    phone: '02-997-2203',
    isActive: true,
    isVerified: true,
    lastLogin: '2024-01-24 14:30:00',
    totalBookings: 23,
    activeBookings: 0,
    createdAt: '2024-01-08'
  },
  {
    id: '5',
    username: 'student1',
    email: 'student1@rsu.ac.th',
    firstName: 'นิคม',
    lastName: 'เรียนดี',
    role: 'USER',
    department: 'แพทยศาสตร์',
    position: 'นักศึกษาแพทย์',
    phone: '02-997-2204',
    isActive: true,
    isVerified: false,
    lastLogin: '2024-01-22 10:00:00',
    totalBookings: 12,
    activeBookings: 1,
    createdAt: '2024-01-15'
  },
  {
    id: '6',
    username: 'intern1',
    email: 'intern1@rsu.ac.th',
    firstName: 'สมใจ',
    lastName: 'รักงาน',
    role: 'USER',
    department: 'อายุรกรรม',
    position: 'แพทย์ฝึกหัด',
    phone: '02-997-2205',
    isActive: false,
    isVerified: true,
    lastLogin: '2024-01-10 09:30:00',
    totalBookings: 8,
    activeBookings: 0,
    createdAt: '2024-01-12'
  }
]

const roles = ['ทั้งหมด', 'ADMIN', 'STAFF', 'USER']
const departments = ['ทั้งหมด', 'IT', 'อายุรกรรม', 'พยาบาล', 'กายภาพบำบัด', 'แพทยศาสตร์']
const statuses = ['ทั้งหมด', 'active', 'inactive', 'verified', 'unverified']

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>(mockUsers)
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('ทั้งหมด')
  const [selectedDepartment, setSelectedDepartment] = useState('ทั้งหมด')
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Filter and search logic
  useEffect(() => {
    let filtered = users

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(user =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.position.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Role filter
    if (selectedRole !== 'ทั้งหมด') {
      filtered = filtered.filter(user => user.role === selectedRole)
    }

    // Department filter
    if (selectedDepartment !== 'ทั้งหมด') {
      filtered = filtered.filter(user => user.department === selectedDepartment)
    }

    // Status filter
    if (selectedStatus !== 'ทั้งหมด') {
      switch (selectedStatus) {
        case 'active':
          filtered = filtered.filter(user => user.isActive)
          break
        case 'inactive':
          filtered = filtered.filter(user => !user.isActive)
          break
        case 'verified':
          filtered = filtered.filter(user => user.isVerified)
          break
        case 'unverified':
          filtered = filtered.filter(user => !user.isVerified)
          break
      }
    }

    setFilteredUsers(filtered)
  }, [users, searchQuery, selectedRole, selectedDepartment, selectedStatus])

  const handleSelectAll = () => {
    if (selectedItems.length === filteredUsers.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredUsers.map(user => user.id))
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const getRoleDisplay = (role: UserData['role']) => {
    const roleMap = {
      'ADMIN': { text: 'ผู้ดูแลระบบ', class: 'admin' },
      'STAFF': { text: 'เจ้าหน้าที่', class: 'staff' },
      'USER': { text: 'ผู้ใช้งาน', class: 'user' }
    }
    return roleMap[role]
  }

  const getStatusDisplay = (user: UserData) => {
    if (!user.isActive) return { text: 'ระงับการใช้งาน', class: 'inactive' }
    if (!user.isVerified) return { text: 'รอยืนยัน', class: 'unverified' }
    return { text: 'ใช้งานได้', class: 'active' }
  }

  const formatLastLogin = (lastLogin?: string) => {
    if (!lastLogin) return 'ไม่เคยเข้าสู่ระบบ'
    
    const date = new Date(lastLogin)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'เมื่อสักครู่'
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`
    
    return date.toLocaleDateString('th-TH')
  }

  const handleToggleActive = (id: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    )
  }

  const handleToggleVerified = (id: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, isVerified: !user.isVerified } : user
      )
    )
  }

  const handleDelete = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) {
      setUsers(prev => prev.filter(user => user.id !== id))
      setSelectedItems(prev => prev.filter(item => item !== id))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on users:`, selectedItems)
    // Implement bulk actions
  }

  const sendResetEmail = (email: string) => {
    console.log(`Sending reset email to: ${email}`)
    // Implement email sending
  }

  return (
    <div className={styles.usersPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>👥 จัดการผู้ใช้งาน</h1>
            <p className={styles.pageSubtitle}>
              จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึงระบบ
            </p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.secondaryButton}>
              <Download size={18} />
              ส่งออกข้อมูล
            </button>
            <button className={styles.secondaryButton}>
              <Upload size={18} />
              นำเข้าข้อมูล
            </button>
            <Link href="/admin/users/add" className={styles.primaryButton}>
              <Plus size={18} />
              เพิ่มผู้ใช้ใหม่
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{users.length}</div>
            <div className={styles.statLabel}>ผู้ใช้ทั้งหมด</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {users.filter(u => u.isActive).length}
            </div>
            <div className={styles.statLabel}>ใช้งานได้</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔒</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {users.filter(u => u.role === 'ADMIN').length}
            </div>
            <div className={styles.statLabel}>ผู้ดูแลระบบ</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏰</div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>
              {users.filter(u => u.lastLogin && 
                new Date(u.lastLogin) > new Date(Date.now() - 24 * 60 * 60 * 1000)
              ).length}
            </div>
            <div className={styles.statLabel}>เข้าใช้วันนี้</div>
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
              placeholder="ค้นหาผู้ใช้ด้วยชื่อ, อีเมล, แผนก..."
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
              <label>บทบาท:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className={styles.filterSelect}
              >
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role === 'ทั้งหมด' ? role : getRoleDisplay(role as any)?.text || role}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label>แผนก:</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className={styles.filterSelect}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
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
                <option value="ทั้งหมด">ทั้งหมด</option>
                <option value="active">ใช้งานได้</option>
                <option value="inactive">ระงับการใช้งาน</option>
                <option value="verified">ยืนยันแล้ว</option>
                <option value="unverified">รอยืนยัน</option>
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
                onClick={() => handleBulkAction('activate')}
              >
                เปิดใช้งาน
              </button>
              <button
                className={styles.bulkButton}
                onClick={() => handleBulkAction('deactivate')}
              >
                ระงับใช้งาน
              </button>
              <button
                className={styles.bulkButton}
                onClick={() => handleBulkAction('export')}
              >
                ส่งออก
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

      {/* Users Table */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.tableTitle}>
            รายการผู้ใช้ ({filteredUsers.length} รายการ)
          </div>
        </div>

        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th className={styles.checkboxHeader}>
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className={styles.checkbox}
                    />
                  </th>
                  <th>ผู้ใช้</th>
                  <th>บทบาท</th>
                  <th>แผนก/ตำแหน่ง</th>
                  <th>การติดต่อ</th>
                  <th>สถานะ</th>
                  <th>การใช้งาน</th>
                  <th>เข้าสู่ระบบล่าสุด</th>
                  <th>การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const roleInfo = getRoleDisplay(user.role)
                  const statusInfo = getStatusDisplay(user)
                  
                  return (
                    <tr key={user.id} className={styles.tableRow}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(user.id)}
                          onChange={() => handleSelectItem(user.id)}
                          className={styles.checkbox}
                        />
                      </td>
                      <td className={styles.userCell}>
                        <div className={styles.userInfo}>
                          <div className={styles.userAvatar}>
                            {user.role === 'ADMIN' ? '👑' : 
                             user.role === 'STAFF' ? '👔' : '👤'}
                          </div>
                          <div className={styles.userDetails}>
                            <div className={styles.userName}>
                              {user.firstName} {user.lastName}
                            </div>
                            <div className={styles.userUsername}>
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`${styles.roleBadge} ${styles[roleInfo.class]}`}>
                          {roleInfo.text}
                        </span>
                      </td>
                      <td className={styles.departmentCell}>
                        <div className={styles.department}>{user.department}</div>
                        <div className={styles.position}>{user.position}</div>
                      </td>
                      <td className={styles.contactCell}>
                        <div className={styles.contactItem}>
                          <Mail size={14} />
                          <span>{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className={styles.contactItem}>
                            <Phone size={14} />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className={styles.statusContainer}>
                          <span className={`${styles.statusBadge} ${styles[statusInfo.class]}`}>
                            {statusInfo.text}
                          </span>
                          <div className={styles.statusIndicators}>
                            {user.isActive && (
                              <span className={styles.indicator} title="ใช้งานได้">🟢</span>
                            )}
                            {user.isVerified && (
                              <span className={styles.indicator} title="ยืนยันแล้ว">✅</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={styles.usageCell}>
                        <div className={styles.usageStats}>
                          <div className={styles.statItem}>
                            <span className={styles.statValue}>{user.totalBookings}</span>
                            <span className={styles.statLabel}>ยืมทั้งหมด</span>
                          </div>
                          <div className={styles.statItem}>
                            <span className={styles.statValue}>{user.activeBookings}</span>
                            <span className={styles.statLabel}>กำลังยืม</span>
                          </div>
                        </div>
                      </td>
                      <td className={styles.lastLoginCell}>
                        {formatLastLogin(user.lastLogin)}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <div className={styles.actionGroup}>
                            <Link
                              href={`/admin/users/${user.id}`}
                              className={styles.actionButton}
                              title="ดูรายละเอียด"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link
                              href={`/admin/users/edit/${user.id}`}
                              className={styles.actionButton}
                              title="แก้ไข"
                            >
                              <Edit size={16} />
                            </Link>
                          </div>
                          <div className={styles.actionGroup}>
                            <button
                              className={`${styles.actionButton} ${user.isActive ? styles.warning : styles.success}`}
                              onClick={() => handleToggleActive(user.id)}
                              title={user.isActive ? 'ระงับการใช้งาน' : 'เปิดใช้งาน'}
                            >
                              {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                            </button>
                            <button
                              className={styles.actionButton}
                              onClick={() => sendResetEmail(user.email)}
                              title="ส่งลิ้งรีเซ็ตรหัสผ่าน"
                            >
                              <Mail size={16} />
                            </button>
                            <button
                              className={`${styles.actionButton} ${styles.danger}`}
                              onClick={() => handleDelete(user.id)}
                              title="ลบผู้ใช้"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>👥</div>
                <h3>ไม่พบผู้ใช้</h3>
                <p>ไม่มีผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา</p>
                <button
                  className={styles.primaryButton}
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedRole('ทั้งหมด')
                    setSelectedDepartment('ทั้งหมด')
                    setSelectedStatus('ทั้งหมด')
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