// app/user/search/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Calendar, Star } from 'lucide-react'
import styles from './search.module.css'

interface Equipment {
  id: string
  name: string
  category: string
  description: string
  location: string
  status: 'available' | 'borrowed' | 'maintenance'
  rating: number
  image?: string
  borrowedUntil?: string
  features?: string[]
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data
  const mockEquipment: Equipment[] = [
    {
      id: 'EQ001',
      name: 'เครื่องวัดความดันโลหิต OMRON',
      category: 'การตรวจวัด',
      description: 'เครื่องวัดความดันโลหิตดิจิทัล แม่นยำสูง เหมาะสำหรับการวิจัยปฏิบัติ',
      location: 'ห้องตรวจ A',
      status: 'available',
      rating: 4.8,
      image: '/images/blood-pressure.jpg',
      features: ['แม่นยำสูง', 'จอแสดงผลดิจิทัล', 'บันทึกค่าได้']
    },
    {
      id: 'EQ002', 
      name: 'เครื่องวัดน้ำตาลในเลือด',
      category: 'การตรวจวัด',
      description: 'เครื่องวัดน้ำตาลในเลือด ผลลัพธ์รวดเร็ว',
      location: 'ห้องตรวจ A',
      status: 'borrowed',
      rating: 4.6,
      borrowedUntil: '2025-01-25',
      features: ['ผลลัพธ์รวดเร็ว', 'ใช้เลือดน้อย', 'แม่นยำ']
    },
    {
      id: 'EQ003',
      name: 'เครื่อง Ultrasound พกพา',
      category: 'การวินิจฉัย',
      description: 'เครื่องอัลตราซาวด์พกพา คุณภาพการแสดงผลสูง',
      location: 'ห้องตรวจ B',
      status: 'available',
      rating: 4.9,
      features: ['คุณภาพสูง', 'พกพาสะดวก', 'แบตเตอรี่ยาวนาน']
    },
    {
      id: 'EQ004',
      name: 'ชุดตรวจหูคอจมูก',
      category: 'การตรวจพาอาร์ก',
      description: 'ชุดตรวจหูคอจมูกครบครัน พร้อมอุปกรณ์เสริม',
      location: 'ห้องตรวจ C',
      status: 'maintenance',
      rating: 4.7,
      features: ['ครบครัน', 'คุณภาพดี', 'ทำความสะอาดง่าย']
    }
  ]

  const categories = [
    { value: 'all', label: 'หมวดหมู่ทั้งหมด' },
    { value: 'การตรวจวัด', label: 'การตรวจวัด' },
    { value: 'การวินิจฉัย', label: 'การวินิจฉัย' },
    { value: 'การตรวจพาอาร์ก', label: 'การตรวจพาอาร์ก' }
  ]

  const locations = [
    { value: 'all', label: 'ทุกสถานที่' },
    { value: 'ห้องตรวจ A', label: 'ห้องตรวจ A' },
    { value: 'ห้องตรวจ B', label: 'ห้องตรวจ B' },
    { value: 'ห้องตรวจ C', label: 'ห้องตรวจ C' }
  ]

  const statuses = [
    { value: 'all', label: 'สถานะทั้งหมด' },
    { value: 'available', label: 'พร้อมใช้งาน' },
    { value: 'borrowed', label: 'ถูกยืม' },
    { value: 'maintenance', label: 'บำรุงรักษา' }
  ]

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setEquipment(mockEquipment)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus

    return matchesSearch && matchesCategory && matchesLocation && matchesStatus
  })

  const getStatusBadge = (status: string, borrowedUntil?: string) => {
    switch (status) {
      case 'available':
        return <span className={styles.statusAvailable}>พร้อมใช้งาน</span>
      case 'borrowed':
        return (
          <span className={styles.statusBorrowed}>
            ถูกยืม {borrowedUntil && `ถึง ${borrowedUntil}`}
          </span>
        )
      case 'maintenance':
        return <span className={styles.statusMaintenance}>บำรุงรักษา</span>
      default:
        return null
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available': return styles.cardAvailable
      case 'borrowed': return styles.cardBorrowed
      case 'maintenance': return styles.cardMaintenance
      default: return ''
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>กำลังโหลดข้อมูลอุปกรณ์...</p>
      </div>
    )
  }

  return (
    <div className={styles.searchPage}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          <Search size={32} />
          ค้นหาอุปกรณ์
        </h1>
        <p className={styles.pageSubtitle}>
          ค้นหาและยืมอุปกรณ์การแพทย์ที่ต้องการ
        </p>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchBox}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="ค้นหาอุปกรณ์..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.filtersContainer}>
          <div className={styles.filterGroup}>
            <Filter size={18} />
            <span>ตัวกรอง:</span>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className={styles.filterSelect}
          >
            {locations.map(location => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.filterSelect}
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <h2>ผลการค้นหา ({filteredEquipment.length} รายการ)</h2>
        </div>

        {filteredEquipment.length === 0 ? (
          <div className={styles.noResults}>
            <Search size={48} />
            <h3>ไม่พบอุปกรณ์ที่ค้นหา</h3>
            <p>ลองเปลี่ยนคำค้นหาหรือตัวกรองใหม่</p>
          </div>
        ) : (
          <div className={styles.equipmentGrid}>
            {filteredEquipment.map(item => (
              <div key={item.id} className={`${styles.equipmentCard} ${getStatusClass(item.status)}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardImage}>
                    <div className={styles.imagePlaceholder}>
                      📦
                    </div>
                  </div>
                  <div className={styles.cardRating}>
                    <Star size={14} fill="currentColor" />
                    {item.rating}
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.name}</h3>
                  <p className={styles.cardId}>{item.id}</p>
                  <p className={styles.cardCategory}>{item.category}</p>
                  <p className={styles.cardDescription}>{item.description}</p>
                  
                  <div className={styles.cardLocation}>
                    <MapPin size={14} />
                    {item.location}
                  </div>

                  {item.features && (
                    <div className={styles.cardFeatures}>
                      {item.features.map((feature, index) => (
                        <span key={index} className={styles.featureTag}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  {getStatusBadge(item.status, item.borrowedUntil)}
                  
                  <div className={styles.cardActions}>
                    {item.status === 'available' ? (
                      <>
                        <button className={styles.borrowBtn}>
                          ยืมเลย
                        </button>
                        <button className={styles.bookBtn}>
                          <Calendar size={16} />
                          จองล่วงหน้า
                        </button>
                      </>
                    ) : item.status === 'borrowed' ? (
                      <button className={styles.waitBtn}>
                        <Calendar size={16} />
                        จองคิว
                      </button>
                    ) : (
                      <button className={styles.disabledBtn} disabled>
                        ไม่สามารถยืมได้
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}