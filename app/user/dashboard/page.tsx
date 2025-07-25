// app/user/dashboard/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Search, Package, Plus, Calendar, ClipboardList, 
  CheckCircle, Clock, AlertTriangle 
} from 'lucide-react'
import SearchBox from '@/components/dashboard/SearchBox'
import QuickActionCard from '@/components/dashboard/QuickActionCard'
import ActivityItem from '@/components/dashboard/ActivityItem'
import EquipmentCard from '@/components/dashboard/EquipmentCard'
import styles from '@/styles/components/dashboard.module.css'

// Type definitions
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

interface IconProps {
  size?: number
  style?: React.CSSProperties
}

// Mock equipment data - อุปกรณ์จริงที่มีในระบบ
const equipmentData: Equipment[] = [
  {
    id: 'EQ001',
    name: 'เครื่องวัดความดันโลหิต OMRON',
    code: 'HEM-7120',
    category: 'การตรวจ',
    status: 'available',
    location: 'ห้องตรวจ A',
    rating: 4.8,
    description: 'เครื่องวัดความดันโลหิตดิจิตอล แม่นยำสูง เหมาะสำหรับการใช้ปฏิบัติ'
  },
  {
    id: 'EQ002',
    name: 'เครื่องวัดน้ำตาลในเลือด',
    code: 'Accu-Chek Active',
    category: 'การตรวจ',
    status: 'available',
    location: 'ห้องตรวจ A',
    rating: 4.6,
    description: 'เครื่องวัดน้ำตาลในเลือด ผลลัพธ์แม่นยำและแปลงออกมาอย่างรวดเร็ว'
  },
  {
    id: 'EQ003',
    name: 'เครื่อง Ultrasound พกพา',
    code: 'SonoSite MicroMaxx',
    category: 'การตรวจ',
    status: 'available',
    location: 'ห้องตรวจ B',
    rating: 4.9,
    description: 'เครื่องอัลตราซาวด์พกพา คุณภาพการแสดงผลสูง'
  },
  {
    id: 'EQ004',
    name: 'ชุดตรวจหูคอจมูก',
    code: 'Welch Allyn 3.5V',
    category: 'การตรวจทางการ',
    status: 'borrowed',
    location: 'ห้องตรวจ C',
    rating: 4.7,
    description: 'ชุดตรวจหูคอจมูกครบครัน พร้อมอุปกรณ์เสริม',
    dueDate: '2025-01-20',
    borrower: 'นพ. สมศักดิ์'
  },
  {
    id: 'EQ005',
    name: 'หุ่น CPR (ตัว)',
    code: 'CPR001',
    category: 'อุปกรณ์ฝึกอบรม',
    status: 'available',
    location: 'ห้องฝึกปฏิบัติ',
    rating: 4.8,
    description: 'หุ่นฝึกปฏิบัติการช่วยชีวิตขั้นพื้นฐาน (CPR) พร้อมเซนเซอร์'
  },
  {
    id: 'EQ006',
    name: 'กระเป๋าน้ำร้อน',
    code: 'HB001',
    category: 'อุปกรณ์การแพทย์',
    status: 'available',
    location: 'ห้องฟิสิโอเธอราปี',
    rating: 4.7,
    description: 'กระเป๋าน้ำร้อนแบบน้ำร้อน เสาขนาดกลาง สำหรับใช้ในการอบร้อน'
  },
  {
    id: 'EQ007',
    name: 'เลา็น้ำเก็ยา',
    code: 'IV001',
    category: 'การตรวจ',
    status: 'maintenance',
    location: 'ห้องตรวจ B',
    rating: 4.5,
    description: 'เลื่อนน้ำเกลือ ปรับความแรงดูนำมาอพุอุปกรณ์',
    maintenanceUntil: '2025-01-25'
  }
]

// Mock recent activities
const recentActivities = [
  {
    type: 'return',
    user: 'นิคม ใจดี',
    action: 'คืน',
    equipment: 'เครื่องวัดความดันโลหิต',
    time: '2 ชั่วโมงที่แล้ว'
  },
  {
    type: 'book',
    user: 'สมหญิง เก่งมาก',
    action: 'จอง',
    equipment: 'เครื่อง Ultrasound',
    time: '4 ชั่วโมงที่แล้ว'
  },
  {
    type: 'borrow',
    user: 'วิทยา ฉลาด',
    action: 'ยืม',
    equipment: 'ชุดตรวจหูคอจมูก',
    time: '6 ชั่วโมงที่แล้ว'
  }
]

export default function UserDashboard() {
  const router = useRouter()
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Equipment[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  
  // Modal states for equipment actions
  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const [showBookModal, setShowBookModal] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  // Loading states
  const [isLoading, setIsLoading] = useState(true)

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    
    if (query.trim() === '') {
      setShowSearchResults(false)
      setSearchResults([])
      return
    }

    const filtered = equipmentData.filter(equipment => 
      equipment.name.toLowerCase().includes(query.toLowerCase()) ||
      equipment.code.toLowerCase().includes(query.toLowerCase()) ||
      equipment.category.toLowerCase().includes(query.toLowerCase()) ||
      equipment.description.toLowerCase().includes(query.toLowerCase())
    )
    
    setSearchResults(filtered)
    setShowSearchResults(true)
  }, [])

  // Equipment action handlers
  const handleBorrow = useCallback((equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setShowBorrowModal(true)
  }, [])

  const handleBook = useCallback((equipment: Equipment) => {
    setSelectedEquipment(equipment)
    setShowBookModal(true)
  }, [])

  const handleConfirmBorrow = useCallback(() => {
    if (selectedEquipment) {
      alert(`ส่งคำขอยืม ${selectedEquipment.name} เรียบร้อยแล้ว!`)
      setShowBorrowModal(false)
      setSelectedEquipment(null)
    }
  }, [selectedEquipment])

  const handleConfirmBook = useCallback(() => {
    if (selectedEquipment) {
      alert(`จอง ${selectedEquipment.name} เรียบร้อยแล้ว!`)
      setShowBookModal(false)
      setSelectedEquipment(null)
    }
  }, [selectedEquipment])

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
  }, [])

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    )
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* =============== SEARCH SECTION =============== */}
      <section className={styles.searchSection}>
        <SearchBox 
          onSearch={handleSearch}
          placeholder="ค้นหาอุปกรณ์..."
          value={searchQuery}
        />
      </section>

      {/* =============== SEARCH RESULTS - แสดงเมื่อมีการค้นหา =============== */}
      {showSearchResults && (
        <section className={styles.searchResults}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              ผลการค้นหา ({searchResults.length} รายการ)
            </h2>
            {searchQuery && (
              <p className={styles.searchQuery}>
                ผลการค้นหาสำหรับ: "{searchQuery}"
              </p>
            )}
          </div>
          
          {searchResults.length > 0 ? (
            <div className={styles.equipmentGrid}>
              {searchResults.map(equipment => (
                <EquipmentCard 
                  key={equipment.id} 
                  equipment={equipment}
                  onBorrow={handleBorrow}
                  onBook={handleBook}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <Package size={48} style={{color: '#9ca3af', marginBottom: '16px'}} />
              <h3>ไม่พบอุปกรณ์ที่ตรงกับการค้นหา</h3>
              <p>ลองเปลี่ยนคำค้นหาหรือตรวจสอบการสะกดใหม่</p>
            </div>
          )}
        </section>
      )}

      {/* =============== QUICK ACTIONS - แสดงเมื่อไม่ค้นหา =============== */}
      {!showSearchResults && (
        <section className={styles.quickActions}>
          <h2 className={styles.sectionTitle}>ใช้งานด่วน</h2>
          <div className={styles.actionGrid}>
            <QuickActionCard 
              href="/user/borrow" 
              icon={<Plus size={24} />} 
              title="ยืมอุปกรณ์ทันที" 
              description="Walk-in ยืมอุปกรณ์โดยไม่ต้องจอง" 
            />
            <QuickActionCard 
              href="/user/smart-booking" 
              icon={<Calendar size={24} />} 
              title="จองล่วงหน้า" 
              description="จองอุปกรณ์พร้อมเลือกเวลาได้" 
            />
            <QuickActionCard 
              href="/user/history" 
              icon={<ClipboardList size={24} />} 
              title="ประวัติการใช้งาน" 
              description="ดูรายการยืม-คืนและสถานะ" 
            />
          </div>
        </section>
      )}

      {/* =============== FEATURED EQUIPMENT - แสดงเมื่อไม่ค้นหา =============== */}
      {!showSearchResults && (
        <section className={styles.featuredEquipment}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>อุปกรณ์แนะนำ</h2>
            <p className={styles.sectionSubtitle}>อุปกรณ์ยอดนิยมและพร้อมใช้งาน</p>
          </div>
          
          <div className={styles.equipmentGrid}>
            {equipmentData
              .filter(equipment => equipment.status === 'available')
              .slice(0, 6)
              .map(equipment => (
                <EquipmentCard 
                  key={equipment.id} 
                  equipment={equipment}
                  onBorrow={handleBorrow}
                  onBook={handleBook}
                  showActions={true}
                />
              ))}
          </div>
          
          <div className={styles.sectionFooter}>
            <button 
              onClick={() => router.push('/user/borrow')}
              className={styles.viewAllButton}
            >
              ดูอุปกรณ์ทั้งหมด
            </button>
          </div>
        </section>
      )}

      {/* =============== RECENT ACTIVITIES - แสดงเมื่อไม่ค้นหา =============== */}
      {!showSearchResults && (
        <section className={styles.recentActivities}>
          <h2 className={styles.sectionTitle}>กิจกรรมล่าสุด</h2>
          <div className={styles.activityList}>
            {recentActivities.map((activity, index) => (
              <ActivityItem 
                key={index}
                icon={
                  activity.type === 'return' ? <CheckCircle size={20} /> :
                  activity.type === 'book' ? <Calendar size={20} /> :
                  <Plus size={20} />
                }
                text={`${activity.user} ${activity.action} ${activity.equipment}`}
                time={activity.time}
                type={
                  activity.type === 'return' ? 'success' :
                  activity.type === 'book' ? 'info' :
                  activity.type === 'borrow' ? 'info' :
                  'warning'
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* =============== BORROW MODAL =============== */}
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
                <p>{selectedEquipment.code}</p>
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
                onClick={handleConfirmBorrow}
                className={styles.confirmButton}
              >
                ยืนยันการยืม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============== BOOK MODAL =============== */}
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
                <p>{selectedEquipment.code}</p>
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
                  <h5>ข้อมูลที่ในการจอง</h5>
                  <ul>
                    <li>การจองจะได้รับการยืนยันภายใน 24 ชั่วโมง</li>
                    <li>มาที่อุปกรณ์ตรงเวลาที่จอง</li>
                    <li>ส่งคืนให้ตรงเวลา</li>
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
                onClick={handleConfirmBook}
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
