// app/user/borrow/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  Search, Filter, Package, MapPin, Star, Clock, 
  CheckCircle, AlertTriangle, XCircle, Plus, Calendar,
  AlertCircle, DollarSign  // เพิ่ม icons ใหม่
} from 'lucide-react'
import styles from './borrow.module.css'

// ✨ อัปเดต Interface ใหม่
interface Equipment {
  id: string
  name: string
  category: string
  model: string
  serialNumber: string
  location: string
  status: 'available' | 'borrowed' | 'maintenance' | 'damaged'
  description: string
  rating: number
  borrowCount: number
  image?: string
  specifications?: Record<string, string>
  
  // ✨ ฟีเจอร์ใหม่: วันหมดอายุการใช้งาน
  purchaseDate: string
  warrantyPeriod: number
  lifespan: number
  expiryDate: string
  isNearExpiry?: boolean
  isExpired?: boolean
  
  // ✨ ฟีเจอร์ใหม่: จำนวนอุปกรณ์
  totalQuantity: number
  availableQuantity: number
  borrowedQuantity: number
  maintenanceQuantity: number
  damagedQuantity: number
  
  // ข้อมูลการยืมปัจจุบัน (ถ้ามี)
  borrowedBy?: string
  dueDate?: string
  maintenanceNote?: string
}

// ✨ Mock Data ที่อัปเดตแล้ว - รวมฟีเจอร์ใหม่ทั้งหมด
const mockEquipment: Equipment[] = [
  {
    id: 'EQ001',
    name: 'ไม้ค้ำยัน (คู่)',
    category: 'อุปกรณ์ช่วยเหลือ',
    model: 'CR001',
    serialNumber: 'CR001234',
    location: 'ห้องเก็บอุปกรณ์ A',
    status: 'available',
    description: 'ไม้ค้ายันสำหรับผู้ป่วยที่มีปัญหาการเดิน ปรับระดับความสูงได้',
    rating: 4.8,
    borrowCount: 156,
    image: '/equipment/crutches.jpg',
    
    // ข้อมูลวันหมดอายุ
    purchaseDate: '2020-01-15',
    warrantyPeriod: 2,
    lifespan: 5,
    expiryDate: '2025-01-15',
    isNearExpiry: false,
    isExpired: false,
    
    // ข้อมูลจำนวนอุปกรณ์
    totalQuantity: 10,
    availableQuantity: 7,
    borrowedQuantity: 2,
    maintenanceQuantity: 1,
    damagedQuantity: 0,
    
    specifications: {
      material: 'อลูมิเนียม',
      adjustable: 'ปรับได้ 10 ระดับ',
      weight: '1.2 กก./คู่'
    }
  },
  {
    id: 'EQ002',
    name: 'Walker 4 ขา',
    category: 'อุปกรณ์ช่วยเหลือ',
    model: 'WK004',
    serialNumber: 'WK004567',
    location: 'ห้องกายภาพบำบัด',
    status: 'borrowed',
    description: 'เครื่องช่วยเดิน 4 ขา สำหรับผู้ป่วยที่ต้องการความคงตัว',
    rating: 4.9,
    borrowCount: 89,
    image: '/equipment/walker4.jpg',
    borrowedBy: 'นิคม ใจดี',
    dueDate: '2025-01-25',
    
    // ข้อมูลวันหมดอายุ
    purchaseDate: '2021-03-10',
    warrantyPeriod: 3,
    lifespan: 7,
    expiryDate: '2028-03-10',
    isNearExpiry: false,
    isExpired: false,
    
    // ข้อมูลจำนวนอุปกรณ์
    totalQuantity: 8,
    availableQuantity: 5,
    borrowedQuantity: 2,
    maintenanceQuantity: 1,
    damagedQuantity: 0,
    
    specifications: {
      height: 'ปรับได้ 81-96 cm',
      weight: '2.3 กก.',
      capacity: 'รับน้ำหนักได้ 136 กก.'
    }
  },
  {
    id: 'EQ003',
    name: 'เครื่องวัดความดัน',
    category: 'อุปกรณ์ตรวจวัด',
    model: 'BP001',
    serialNumber: 'BP001789',
    location: 'ห้องตรวจทั่วไป',
    status: 'available',
    description: 'เครื่องวัดความดันโลหิตแบบดิจิทัล แม่นยำสูง',
    rating: 4.9,
    borrowCount: 423,
    image: '/equipment/blood-pressure.jpg',
    
    // ข้อมูลวันหมดอายุ (เกือบหมดอายุ)
    purchaseDate: '2020-02-01',
    warrantyPeriod: 3,
    lifespan: 5,
    expiryDate: '2025-02-01',
    isNearExpiry: true,  // เกือบหมดอายุ
    isExpired: false,
    
    // ข้อมูลจำนวนอุปกรณ์
    totalQuantity: 5,
    availableQuantity: 3,
    borrowedQuantity: 1,
    maintenanceQuantity: 0,
    damagedQuantity: 1,
    
    specifications: {
      accuracy: '±3 mmHg',
      memory: '90 ครั้ง',
      cuffSize: '22-42 cm'
    }
  },
  {
    id: 'EQ004',
    name: 'วิลแชร์',
    category: 'อุปกรณ์ช่วยเหลือ',
    model: 'WC001',
    serialNumber: 'WC001456',
    location: 'ห้องผู้ป่วยนอก',
    status: 'maintenance',
    description: 'รถเข็นผู้ป่วย สำหรับผู้ป่วยที่ไม่สามารถเดินได้',
    rating: 4.6,
    borrowCount: 198,
    image: '/equipment/wheelchair.jpg',
    maintenanceNote: 'เปลี่ยนล้อใหม่',
    
    // ข้อมูลวันหมดอายุ (หมดอายุแล้ว)
    purchaseDate: '2019-01-01',
    warrantyPeriod: 2,
    lifespan: 5,
    expiryDate: '2024-01-01',
    isNearExpiry: false,
    isExpired: true,  // หมดอายุแล้ว
    
    // ข้อมูลจำนวนอุปกรณ์
    totalQuantity: 6,
    availableQuantity: 0,  // ไม่มีให้ยืม
    borrowedQuantity: 3,
    maintenanceQuantity: 2,
    damagedQuantity: 1,
    
    specifications: {
      seat: 'กว้าง 46 cm',
      capacity: 'รับน้ำหนักได้ 100 กก.',
      brake: 'เบรกล้อหลัง'
    }
  },
  {
    id: 'EQ005',
    name: 'หุ่น CPR (ตัว)',
    category: 'อุปกรณ์ฝึกอบรม',
    model: 'CPR001',
    serialNumber: 'CPR001234',
    location: 'ห้องฝึกปฏิบัติ',
    status: 'available',
    description: 'หุ่นฝึกปฏิบัติการช่วยชีวิตขั้นพื้นฐาน (CPR) พร้อมเซนเซอร์',
    rating: 4.8,
    borrowCount: 67,
    image: '/equipment/cpr-manikin.jpg',
    
    // ข้อมูลวันหมดอายุ
    purchaseDate: '2022-06-15',
    warrantyPeriod: 5,
    lifespan: 10,
    expiryDate: '2032-06-15',
    isNearExpiry: false,
    isExpired: false,
    
    // ข้อมูลจำนวนอุปกรณ์
    totalQuantity: 3,
    availableQuantity: 2,
    borrowedQuantity: 1,
    maintenanceQuantity: 0,
    damagedQuantity: 0,
    
    specifications: {
      features: 'เซนเซอร์แรงกด',
      feedback: 'แสงและเสียงแจ้งเตือน',
      training: 'มาตรฐาน AHA'
    }
  }
]

const categories = [
  'ทั้งหมด',
  'อุปกรณ์ช่วยเหลือ',
  'อุปกรณ์ตรวจวัด',
  'อุปกรณ์ฝึกอบรม',
  'อุปกรณ์การแพทย์',
  'อุปกรณ์บำบัด'
]

const locations = [
  'ทั้งหมด',
  'ห้องเก็บอุปกรณ์ A',
  'ห้องกายภาพบำบัด',
  'ห้องฝึกปฏิบัติ',
  'ห้องผู้ป่วยนอก',
  'ห้องตรวจทั่วไป',
  'ห้องเวชภัณฑ์',
  'ห้องฟิสิโอเธอราปี',
  'ห้องพยาบาล',
  'ห้องฉีดยา'
]

// ✨ ฟังก์ชันคำนวณวันหมดอายุ
const calculateExpiryStatus = (expiryDate: string) => {
  const expiry = new Date(expiryDate)
  const today = new Date()
  const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  return {
    isExpired: daysUntilExpiry < 0,
    isNearExpiry: daysUntilExpiry >= 0 && daysUntilExpiry <= 30,
    daysUntilExpiry: Math.abs(daysUntilExpiry)
  }
}

// ✨ Component สำหรับแสดงสถานะอุปกรณ์
function QuantityDisplay({ equipment }: { equipment: Equipment }) {
  return (
    <div className={styles.quantityInfo}>
      <div className={styles.quantityItem}>
        <span className={styles.quantityLabel}>ยืมได้:</span>
        <span className={`${styles.quantityValue} ${equipment.availableQuantity === 0 ? styles.unavailable : styles.available}`}>
          {equipment.availableQuantity}/{equipment.totalQuantity}
        </span>
      </div>
      
      {equipment.borrowedQuantity > 0 && (
        <div className={styles.quantityItem}>
          <span className={styles.quantityLabel}>กำลังยืม:</span>
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
}

// ✨ Component สำหรับแสดงสถานะหมดอายุ
function ExpiryWarning({ equipment }: { equipment: Equipment }) {
  const expiryStatus = calculateExpiryStatus(equipment.expiryDate)
  
  if (expiryStatus.isExpired) {
    return (
      <div className={styles.expiryWarning}>
        <XCircle size={16} />
        <span>หมดอายุการใช้งานแล้ว ({expiryStatus.daysUntilExpiry} วันแล้ว)</span>
      </div>
    )
  }
  
  if (expiryStatus.isNearExpiry) {
    return (
      <div className={styles.expiryNearWarning}>
        <AlertTriangle size={16} />
        <span>เกือบหมดอายุ (อีก {expiryStatus.daysUntilExpiry} วัน)</span>
      </div>
    )
  }
  
  return null
}

interface EquipmentCardProps {
  equipment: Equipment
  onBorrow: (equipment: Equipment) => void
  onBook: (equipment: Equipment) => void
}

// ✨ อัปเดต EquipmentCard Component
function EquipmentCard({ equipment, onBorrow, onBook }: EquipmentCardProps) {
  const getStatusIcon = (status: string, equipment: Equipment) => {
    // เช็คหมดอายุก่อน
    const expiryStatus = calculateExpiryStatus(equipment.expiryDate)
    if (expiryStatus.isExpired) {
      return <XCircle className={styles.statusIconExpired} />
    }
    
    // เช็คจำนวนที่ยืมได้
    if (equipment.availableQuantity === 0 && status === 'available') {
      return <XCircle className={styles.statusIconUnavailable} />
    }
    
    switch (status) {
      case 'available': return <CheckCircle className={styles.statusIconAvailable} />
      case 'borrowed': return <Clock className={styles.statusIconBorrowed} />
      case 'maintenance': return <AlertTriangle className={styles.statusIconMaintenance} />
      case 'damaged': return <XCircle className={styles.statusIconBroken} />
      default: return null
    }
  }

  const getStatusText = (status: string, equipment: Equipment) => {
    // เช็คหมดอายุก่อน
    const expiryStatus = calculateExpiryStatus(equipment.expiryDate)
    if (expiryStatus.isExpired) {
      return 'หมดอายุ'
    }
    
    // เช็คจำนวนที่ยืมได้
    if (equipment.availableQuantity === 0 && status === 'available') {
      return 'ไม่มีให้ยืม'
    }
    
    switch (status) {
      case 'available': return 'พร้อมใช้งาน'
      case 'borrowed': return 'ถูกยืม'
      case 'maintenance': return 'ซ่อมบำรุง'
      case 'damaged': return 'เสียหาย'
      default: return 'ไม่ทราบ'
    }
  }

  const getStatusClass = (status: string, equipment: Equipment) => {
    // เช็คหมดอายุก่อน
    const expiryStatus = calculateExpiryStatus(equipment.expiryDate)
    if (expiryStatus.isExpired) {
      return styles.statusExpired
    }
    
    // เช็คจำนวนที่ยืมได้
    if (equipment.availableQuantity === 0 && status === 'available') {
      return styles.statusUnavailable
    }
    
    switch (status) {
      case 'available': return styles.statusAvailable
      case 'borrowed': return styles.statusBorrowed
      case 'maintenance': return styles.statusMaintenance
      case 'damaged': return styles.statusBroken
      default: return ''
    }
  }

  const expiryStatus = calculateExpiryStatus(equipment.expiryDate)
  const canBorrow = equipment.availableQuantity > 0 && !expiryStatus.isExpired && equipment.status === 'available'

  return (
    <div className={styles.equipmentCard}>
      <div className={styles.equipmentImage}>
        <div className={styles.imagePlaceholder}>
          <Package size={48} />
        </div>
        <div className={styles.equipmentBadge}>
          <span className={`${styles.statusBadge} ${getStatusClass(equipment.status, equipment)}`}>
            {getStatusIcon(equipment.status, equipment)}
            {getStatusText(equipment.status, equipment)}
          </span>
        </div>
      </div>

      <div className={styles.equipmentInfo}>
        <div className={styles.equipmentHeader}>
          <h3 className={styles.equipmentName}>{equipment.name}</h3>
          <div className={styles.equipmentRating}>
            <Star className={styles.starIcon} />
            <span>{equipment.rating}</span>
          </div>
        </div>

        <div className={styles.equipmentDetails}>
          <p className={styles.equipmentModel}>{equipment.model}</p>
          <p className={styles.equipmentCategory}>{equipment.category}</p>
          <p className={styles.equipmentDescription}>{equipment.description}</p>
        </div>

        <div className={styles.equipmentMeta}>
          <div className={styles.metaItem}>
            <MapPin size={16} />
            <span>{equipment.location}</span>
          </div>
          <div className={styles.metaItem}>
            <Package size={16} />
            <span>ยืม {equipment.borrowCount} ครั้ง</span>
          </div>
        </div>

        {/* ✨ แสดงจำนวนอุปกรณ์ */}
        <QuantityDisplay equipment={equipment} />

        {/* ✨ แสดงคำเตือนหมดอายุ */}
        <ExpiryWarning equipment={equipment} />

        {equipment.status === 'borrowed' && (
          <div className={styles.borrowedInfo}>
            <p className={styles.borrowedBy}>ถูกยืมโดย: {equipment.borrowedBy}</p>
            <p className={styles.dueDate}>คืนวันที่: {equipment.dueDate}</p>
          </div>
        )}

        {equipment.status === 'maintenance' && (
          <div className={styles.maintenanceInfo}>
            <p className={styles.maintenanceNote}>หมายเหตุ: {equipment.maintenanceNote}</p>
          </div>
        )}

        <div className={styles.equipmentActions}>
          {canBorrow ? (
            <>
              <button 
                onClick={() => onBorrow(equipment)}
                className={`${styles.actionButton} ${styles.borrowButton}`}
              >
                <Plus size={16} />
                ยืมเลย
              </button>
              <button 
                onClick={() => onBook(equipment)}
                className={`${styles.actionButton} ${styles.bookButton}`}
              >
                <Calendar size={16} />
                จองล่วงหน้า
              </button>
            </>
          ) : (
            <button 
              onClick={() => onBook(equipment)}
              className={`${styles.actionButton} ${styles.queueButton}`}
              disabled={expiryStatus.isExpired}
            >
              <Clock size={16} />
              {expiryStatus.isExpired ? 'หมดอายุ' : 'จองคิว'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BorrowPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด')
  const [selectedLocation, setSelectedLocation] = useState('ทั้งหมด')
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const [showBookModal, setShowBookModal] = useState(false)

  const filteredEquipment = mockEquipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory
    const matchesLocation = selectedLocation === 'ทั้งหมด' || item.location === selectedLocation
    const matchesStatus = selectedStatus === 'ทั้งหมด' || item.status === selectedStatus

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus
  })

  const sortedEquipment = [...filteredEquipment].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'rating':
        return b.rating - a.rating
      case 'popular':
        return b.borrowCount - a.borrowCount
      case 'available':
        return a.status === 'available' ? -1 : 1
      default:
        return 0
    }
  })

  const handleBorrow = (equipment: Equipment) => {
    // ✨ เช็คสถานะก่อนยืม
    const expiryStatus = calculateExpiryStatus(equipment.expiryDate)
    
    if (expiryStatus.isExpired) {
      alert('⚠️ ไม่สามารถยืมได้\nเนื่องจากอุปกรณ์หมดอายุการใช้งานแล้ว')
      return
    }
    
    if (equipment.availableQuantity === 0) {
      alert('⚠️ ไม่สามารถยืมได้\nเนื่องจากอุปกรณ์ไม่มีให้บริการ')
      return
    }
    
    setSelectedEquipment(equipment)
    setShowBorrowModal(true)
  }

  const handleBook = (equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setShowBookModal(true)
  }

  const availableCount = filteredEquipment.filter(item => {
    const expiryStatus = calculateExpiryStatus(item.expiryDate)
    return item.availableQuantity > 0 && !expiryStatus.isExpired
  }).length
  
  const totalCount = filteredEquipment.length
  const expiredCount = filteredEquipment.filter(item => {
    const expiryStatus = calculateExpiryStatus(item.expiryDate)
    return expiryStatus.isExpired
  }).length
  
  const nearExpiryCount = filteredEquipment.filter(item => {
    const expiryStatus = calculateExpiryStatus(item.expiryDate)
    return expiryStatus.isNearExpiry
  }).length

  return (
    <div className={styles.borrowPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>ยืมอุปกรณ์</h1>
        <p className={styles.pageDescription}>
          ค้นหาและยืมอุปกรณ์การแพทย์ที่ต้องการ
        </p>
      </div>

      {/* ✨ แจ้งเตือนอุปกรณ์หมดอายุ */}
      {(expiredCount > 0 || nearExpiryCount > 0) && (
        <div className={styles.alertSection}>
          {expiredCount > 0 && (
            <div className={styles.alertExpired}>
              <XCircle size={20} />
              <span>มีอุปกรณ์หมดอายุ {expiredCount} รายการ</span>
            </div>
          )}
          {nearExpiryCount > 0 && (
            <div className={styles.alertNearExpiry}>
              <AlertTriangle size={20} />
              <span>มีอุปกรณ์เกือบหมดอายุ {nearExpiryCount} รายการ</span>
            </div>
          )}
        </div>
      )}

      {/* Search and Filters */}
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="ค้นหาอุปกรณ์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={styles.filterToggle}
          >
            <Filter size={20} />
            ตัวกรอง
          </button>
        </div>

        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>หมวดหมู่</label>
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
              <label className={styles.filterLabel}>สถานที่</label>
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
                className={styles.filterSelect}
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>สถานะ</label>
              <select 
                value={selectedStatus} 
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="ทั้งหมด">ทั้งหมด</option>
                <option value="available">พร้อมใช้งาน</option>
                <option value="borrowed">ถูกยืม</option>
                <option value="maintenance">ซ่อมบำรุง</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>เรียงตาม</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="name">ชื่อ A-Z</option>
                <option value="rating">คะแนนสูงสุด</option>
                <option value="popular">ยืมมากที่สุด</option>
                <option value="available">พร้อมใช้งาน</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className={styles.resultsHeader}>
        <div className={styles.resultsCount}>
          <h2>ผลการค้นหา ({totalCount} รายการ)</h2>
          <div className={styles.statsGrid}>
            <p className={styles.availableCount}>
              <CheckCircle size={16} />
              พร้อมใช้งาน: {availableCount} รายการ
            </p>
            {nearExpiryCount > 0 && (
              <p className={styles.nearExpiryCount}>
                <AlertTriangle size={16} />
                เกือบหมดอายุ: {nearExpiryCount} รายการ
              </p>
            )}
            {expiredCount > 0 && (
              <p className={styles.expiredCount}>
                <XCircle size={16} />
                หมดอายุ: {expiredCount} รายการ
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className={styles.equipmentGrid}>
        {sortedEquipment.length > 0 ? (
          sortedEquipment.map(equipment => (
            <EquipmentCard
              key={equipment.id}
              equipment={equipment}
              onBorrow={handleBorrow}
              onBook={handleBook}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            <Package size={64} />
            <h3>ไม่พบอุปกรณ์ที่ตรงกับเงื่อนไข</h3>
            <p>ลองเปลี่ยนคำค้นหาหรือปรับตัวกรอง</p>
          </div>
        )}
      </div>

      {/* ✨ Borrow Modal - เพิ่มคำเตือนค่าปรับ */}
      {showBorrowModal && selectedEquipment && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>ยืมอุปกรณ์</h3>
              <button 
                onClick={() => setShowBorrowModal(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.equipmentSummary}>
                <h4>{selectedEquipment.name}</h4>
                <p>{selectedEquipment.model}</p>
                <p>{selectedEquipment.location}</p>
                <div className={styles.availableInfo}>
                  <CheckCircle size={16} />
                  <span>มีให้ยืม: {selectedEquipment.availableQuantity} ชิ้น</span>
                </div>
              </div>

              <div className={styles.borrowForm}>
                <div className={styles.formGroup}>
                  <label>วัตถุประสงค์การใช้งาน</label>
                  <textarea 
                    placeholder="กรุณาระบุวัตถุประสงค์ในการยืม..."
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>ระยะเวลาที่ต้องการยืม</label>
                  <select className={styles.select}>
                    <option value="1">1 วัน</option>
                    <option value="2">2 วัน</option>
                    <option value="3">3 วัน</option>
                    <option value="7">1 สัปดาห์</option>
                  </select>
                </div>

                {/* ✨ คำเตือนค่าปรับ */}
                <div className={styles.fineWarning}>
                  <div className={styles.fineWarningHeader}>
                    <DollarSign size={20} />
                    <h5>ข้อมูลค่าปรับ</h5>
                  </div>
                  <div className={styles.fineDetails}>
                    <p>• ค่าปรับการคืนล่าช้า: <strong>10 บาทต่อวัน</strong></p>
                    <p>• ช่วงเวลาผ่อนผัน: <strong>24 ชั่วโมง</strong></p>
                    <p>• กรุณาคืนตรงเวลาเพื่อหลีกเลี่ยงค่าปรับ</p>
                  </div>
                </div>

                <div className={styles.noteBox}>
                  <h5>ข้อปฏิบัติในการยืม</h5>
                  <ul>
                    <li>นำรหัสนักศึกษามาแสดงที่เคาน์เตอร์</li>
                    <li>ตรวจสอบอุปกรณ์ให้เรียบร้อย</li>
                    <li>ส่งคืนให้ตรงเวลา</li>
                    <li>แจ้งทันทีหากเกิดความเสียหาย</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                onClick={() => setShowBorrowModal(false)}
                className={styles.cancelButton}
              >
                ยกเลิก
              </button>
              <button 
                onClick={() => {
                  alert('✅ ส่งคำขอยืมเรียบร้อยแล้ว!\nกรุณารอการอนุมัติจากเจ้าหน้าที่')
                  setShowBorrowModal(false)
                }}
                className={styles.confirmButton}
              >
                ยืนยันการยืม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book Modal */}
      {showBookModal && selectedEquipment && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>จองอุปกรณ์</h3>
              <button 
                onClick={() => setShowBookModal(false)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.equipmentSummary}>
                <h4>{selectedEquipment.name}</h4>
                <p>{selectedEquipment.model}</p>
                <p>{selectedEquipment.location}</p>
              </div>

              <div className={styles.bookingForm}>
                <div className={styles.formGroup}>
                  <label>วันที่ต้องการใช้</label>
                  <input 
                    type="date" 
                    className={styles.input}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>เวลาเริ่มต้น</label>
                    <select className={styles.select}>
                      <option value="08:00">08:00</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="13:00">13:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>เวลาสิ้นสุด</label>
                    <select className={styles.select}>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="12:00">12:00</option>
                      <option value="13:00">13:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>วัตถุประสงค์การใช้งาน</label>
                  <textarea 
                    placeholder="กรุณาระบุวัตถุประสงค์ในการจอง..."
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.noteBox}>
                  <h5>ข้อปฏิบัติในการจอง</h5>
                  <ul>
                    <li>การจองจะได้รับการยืนยันภายใน 24 ชั่วโมง</li>
                    <li>มาเก็บอุปกรณ์ตรงเวลาที่จอง</li>
                    <li>หากไม่มารับภายใน 15 นาที จะยกเลิกการจอง</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button 
                onClick={() => setShowBookModal(false)}
                className={styles.cancelButton}
              >
                ยกเลิก
              </button>
              <button 
                onClick={() => {
                  alert('✅ ส่งคำขอจองเรียบร้อยแล้ว!\nกรุณารอการยืนยันจากเจ้าหน้าที่')
                  setShowBookModal(false)
                }}
                className={styles.confirmButton}
              >
                ยืนยันการจอง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}