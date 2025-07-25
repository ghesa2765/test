// app/user/borrow/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { 
  Search, Filter, Package, MapPin, Star, Clock, 
  CheckCircle, AlertTriangle, XCircle, Plus, Calendar
} from 'lucide-react'
import styles from './borrow.module.css'

// Mock Data - อุปกรณ์จริงที่มีในระบบ (ตรงกับ Dashboard และ Smart Booking)
const mockEquipment = [
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
    specifications: {
      height: 'ปรับได้ 81-96 cm',
      weight: '2.3 กก.',
      capacity: 'รับน้ำหนักได้ 136 กก.'
    }
  },
  {
    id: 'EQ003',
    name: 'Walker 1 ขา',
    category: 'อุปกรณ์ช่วยเหลือ',
    model: 'WK001',
    serialNumber: 'WK001789',
    location: 'ห้องกายภาพบำบัด',
    status: 'available',
    description: 'เครื่องช่วยเดิน 1 ขา น้ำหนักเบา เหมาะสำหรับผู้สูงอายุ',
    rating: 4.7,
    borrowCount: 234,
    image: '/equipment/walker1.jpg',
    specifications: {
      height: 'ปรับได้ 76-86 cm',
      weight: '0.9 กก.',
      grip: 'จับกันลื่น'
    }
  },
  {
    id: 'EQ004',
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
    specifications: {
      features: 'เซนเซอร์แรงกด',
      feedback: 'แสงและเสียงแจ้งเตือน',
      training: 'มาตรฐาน AHA'
    }
  },
  {
    id: 'EQ005',
    name: 'วิลแชร์',
    category: 'อุปกรณ์ช่วยเหลือ',
    model: 'WC001',
    serialNumber: 'WC001456',
    location: 'ห้องผู้ป่วยนอก',
    status: 'borrowed',
    description: 'รถเข็นผู้ป่วย สำหรับผู้ป่วยที่ไม่สามารถเดินได้',
    rating: 4.6,
    borrowCount: 198,
    image: '/equipment/wheelchair.jpg',
    borrowedBy: 'สมชาย ดีใจ',
    dueDate: '2025-01-23',
    specifications: {
      seat: 'กว้าง 46 cm',
      capacity: 'รับน้ำหนักได้ 100 กก.',
      brake: 'เบรกล้อหลัง'
    }
  },
  {
    id: 'EQ006',
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
    specifications: {
      accuracy: '±3 mmHg',
      memory: '90 ครั้ง',
      cuffSize: '22-42 cm'
    }
  },
  {
    id: 'EQ007',
    name: 'กระเป๋าวัคซีน',
    category: 'อุปกรณ์การแพทย์',
    model: 'EB001',
    serialNumber: 'EB001234',
    location: 'ห้องเวชภัณฑ์',
    status: 'maintenance',
    description: 'กระเป๋าเก็บวัคซีนแบบควบคุมอุณหภูมิ',
    rating: 4.7,
    borrowCount: 89,
    image: '/equipment/vaccine-bag.jpg',
    maintenanceNote: 'กำลังเปลี่ยนระบบทำความเย็น',
    specifications: {
      temperature: '2-8°C',
      capacity: '50 โดส',
      battery: '24 ชั่วโมง'
    }
  },
  {
    id: 'EQ008',
    name: 'กระเป๋าน้ำร้อน',
    category: 'อุปกรณ์บำบัด',
    model: 'HB001',
    serialNumber: 'HB001567',
    location: 'ห้องฟิสิโอเธอราปี',
    status: 'available',
    description: 'กระเป๋าน้ำร้อนสำหรับบำบัดอาการปวดกล้ามเนื้อ',
    rating: 4.5,
    borrowCount: 145,
    image: '/equipment/hot-water-bag.jpg',
    specifications: {
      material: 'ยางธรรมชาติ',
      capacity: '2 ลิตร',
      safety: 'ฝาปิดนิรภัย'
    }
  },
  {
    id: 'EQ009',
    name: 'วัดอุณหภูมิศีรษะดิจิทัล',
    category: 'อุปกรณ์ตรวจวัด',
    model: 'PC001',
    serialNumber: 'PC001890',
    location: 'ห้องตรวจทั่วไป',
    status: 'available',
    description: 'เครื่องวัดอุณหภูมิแบบดิจิทัล วัดจากศีรษะแบบไม่สัมผัส',
    rating: 4.8,
    borrowCount: 267,
    image: '/equipment/forehead-thermometer.jpg',
    specifications: {
      range: '32.0-42.9°C',
      accuracy: '±0.2°C',
      response: '1 วินาที'
    }
  },
  {
    id: 'EQ010',
    name: 'ปรอทวัดไข้',
    category: 'อุปกรณ์ตรวจวัด',
    model: 'TH001',
    serialNumber: 'TH001456',
    location: 'ห้องพยาบาล',
    status: 'borrowed',
    description: 'เทอร์โมมิเตอร์แบบดิจิทัล สำหรับวัดอุณหภูมิร่างกาย',
    rating: 4.4,
    borrowCount: 356,
    image: '/equipment/digital-thermometer.jpg',
    borrowedBy: 'พยาบาลสุดา',
    dueDate: '2025-01-22',
    specifications: {
      type: 'ปากและใต้วงแขน',
      accuracy: '±0.1°C',
      memory: '10 ครั้งล่าสุด'
    }
  },
  {
    id: 'EQ011',
    name: 'เสาน้ำเกลือ',
    category: 'อุปกรณ์การแพทย์',
    model: 'IV001',
    serialNumber: 'IV001789',
    location: 'ห้องฉีดยา',
    status: 'available',
    description: 'เสาแขวนถุงน้ำเกลือ ปรับความสูงได้ มีล้อเลื่อน',
    rating: 4.7,
    borrowCount: 178,
    image: '/equipment/iv-stand.jpg',
    specifications: {
      height: 'ปรับได้ 120-200 cm',
      wheels: '4 ล้อ มีเบรก',
      hooks: '4 ตะขอแขวน'
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

interface EquipmentCardProps {
  equipment: any
  onBorrow: (equipment: any) => void
  onBook: (equipment: any) => void
}

function EquipmentCard({ equipment, onBorrow, onBook }: EquipmentCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className={styles.statusIconAvailable} />
      case 'borrowed': return <Clock className={styles.statusIconBorrowed} />
      case 'maintenance': return <AlertTriangle className={styles.statusIconMaintenance} />
      case 'broken': return <XCircle className={styles.statusIconBroken} />
      default: return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'พร้อมใช้งาน'
      case 'borrowed': return 'ถูกยืม'
      case 'maintenance': return 'ซ่อมบำรุง'
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
      default: return ''
    }
  }

  return (
    <div className={styles.equipmentCard}>
      <div className={styles.equipmentImage}>
        <div className={styles.imagePlaceholder}>
          <Package size={48} />
        </div>
        <div className={styles.equipmentBadge}>
          <span className={`${styles.statusBadge} ${getStatusClass(equipment.status)}`}>
            {getStatusIcon(equipment.status)}
            {getStatusText(equipment.status)}
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
          {equipment.status === 'available' ? (
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
              disabled={equipment.status === 'broken'}
            >
              <Clock size={16} />
              {equipment.status === 'broken' ? 'ไม่พร้อมใช้' : 'จองคิว'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function BorrowPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด')
  const [selectedLocation, setSelectedLocation] = useState('ทั้งหมด')
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
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

  const handleBorrow = (equipment: any) => {
    setSelectedEquipment(equipment)
    setShowBorrowModal(true)
  }

  const handleBook = (equipment: any) => {
    setSelectedEquipment(equipment)
    setShowBookModal(true)
  }

  const availableCount = filteredEquipment.filter(item => item.status === 'available').length
  const totalCount = filteredEquipment.length

  return (
    <div className={styles.borrowPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>ยืมอุปกรณ์</h1>
        <p className={styles.pageDescription}>
          ค้นหาและยืมอุปกรณ์การแพทย์ที่ต้องการ
        </p>
      </div>

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
          <p className={styles.availableCount}>
            พร้อมใช้งาน: {availableCount} รายการ
          </p>
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

      {/* Borrow Modal */}
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
                  alert('ส่งคำขอยืมเรียบร้อยแล้ว!')
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
                  alert('ส่งคำขอจองเรียบร้อยแล้ว!')
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