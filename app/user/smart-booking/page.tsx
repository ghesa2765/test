// app/user/smart-booking/page.tsx
'use client'

import { useState } from 'react'
import { Calendar, Clock, CheckCircle, MapPin, X } from 'lucide-react'
import styles from './smart-booking.module.css'

export default function SmartBookingPage() {
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '08:00',
    endTime: '10:00',
    purpose: ''
  })

  const equipment = [
    { 
      id: 'EQ001', 
      code: 'CR001',
      name: 'ไม้ค้ำยัน (คู่)', 
      fullName: 'ไม้ค้ายันสำหรับผู้ป่วยที่มีปัญหาการเดิน',
      location: 'ห้องเก็บอุปกรณ์ A',
      available: true,
      icon: '🦯'
    },
    { 
      id: 'EQ002', 
      code: 'WK004',
      name: 'Walker 4 ขา', 
      fullName: 'เครื่องช่วยเดิน 4 ขา สำหรับผู้ป่วยที่ต้องการความคงตัว',
      location: 'ห้องกายภาพบำบัด',
      available: false,
      icon: '🚶'
    },
    { 
      id: 'EQ003', 
      code: 'WK001',
      name: 'Walker 1 ขา', 
      fullName: 'เครื่องช่วยเดิน 1 ขา น้ำหนักเบา เหมาะสำหรับผู้สูงอายุ',
      location: 'ห้องกายภาพบำบัด',
      available: true,
      icon: '🚶'
    },
    { 
      id: 'EQ004', 
      code: 'CPR001',
      name: 'หุ่น CPR (ตัว)', 
      fullName: 'หุ่นฝึกปฏิบัติการช่วยชีวิตขั้นพื้นฐาน (CPR) พร้อมเซนเซอร์',
      location: 'ห้องฝึกปฏิบัติ',
      available: true,
      icon: '🫁'
    },
    { 
      id: 'EQ005', 
      code: 'WC001',
      name: 'วิลแชร์', 
      fullName: 'รถเข็นผู้ป่วย สำหรับผู้ป่วยที่ไม่สามารถเดินได้',
      location: 'ห้องผู้ป่วยนอก',
      available: false,
      icon: '♿'
    },
    { 
      id: 'EQ006', 
      code: 'BP001',
      name: 'เครื่องวัดความดัน', 
      fullName: 'เครื่องวัดความดันโลหิตแบบดิจิทัล แม่นยำสูง',
      location: 'ห้องตรวจทั่วไป',
      available: true,
      icon: '🩺'
    },
    { 
      id: 'EQ007', 
      code: 'EB001',
      name: 'กระเป๋าวัคซีน', 
      fullName: 'กระเป๋าเก็บวัคซีนแบบควบคุมอุณหภูมิ',
      location: 'ห้องเวชภัณฑ์',
      available: false,
      icon: '💉'
    },
    { 
      id: 'EQ008', 
      code: 'HB001',
      name: 'กระเป๋าน้ำร้อน', 
      fullName: 'กระเป๋าน้ำร้อนสำหรับบำบัดอาการปวดกล้ามเนื้อ',
      location: 'ห้องฟิสิโอเธอราปี',
      available: true,
      icon: '🔥'
    },
    { 
      id: 'EQ009', 
      code: 'PC001',
      name: 'วัดอุณหภูมิศีรษะดิจิทัล', 
      fullName: 'เครื่องวัดอุณหภูมิแบบดิจิทัล วัดจากศีรษะแบบไม่สัมผัส',
      location: 'ห้องตรวจทั่วไป',
      available: true,
      icon: '🌡️'
    },
    { 
      id: 'EQ010', 
      code: 'TH001',
      name: 'ปรอทวัดไข้', 
      fullName: 'เทอร์โมมิเตอร์แบบดิจิทัล สำหรับวัดอุณหภูมิร่างกาย',
      location: 'ห้องพยาบาล',
      available: false,
      icon: '🌡️'
    },
    { 
      id: 'EQ011', 
      code: 'IV001',
      name: 'เสาน้ำเกลือ', 
      fullName: 'เสาแขวนถุงน้ำเกลือ ปรับความสูงได้ มีล้อเลื่อน',
      location: 'ห้องฉีดยา',
      available: true,
      icon: '💧'
    }
  ]

  const handleEquipmentClick = (item: any) => {
    if (item.available) {
      setSelectedEquipment(item)
      setShowModal(true)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setBookingData({
      date: '',
      startTime: '08:00',
      endTime: '10:00',
      purpose: ''
    })
  }

  const handleConfirmBooking = () => {
    if (bookingData.date && bookingData.purpose.trim()) {
      alert(`จองสำเร็จ!\n\nอุปกรณ์: ${selectedEquipment.fullName}\nวันที่: ${new Date(bookingData.date).toLocaleDateString('th-TH')}\nเวลา: ${bookingData.startTime} - ${bookingData.endTime}\nวัตถุประสงค์: ${bookingData.purpose}`)
      handleModalClose()
    } else {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
    }
  }

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Calendar size={28} />
        </div>
        <div className={styles.headerText}>
          <h1>จองอุปกรณ์ล่วงหน้า</h1>
          <p>เลือกอุปกรณ์และเวลาที่ต้องการใช้งาน</p>
        </div>
      </div>

      {/* Equipment Selection */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>🔸 เลือกอุปกรณ์ที่ต้องการ</h2>
        </div>
        <div className={styles.equipmentGrid}>
          {equipment.map(item => (
            <div
              key={item.id}
              className={`${styles.equipmentCard} ${!item.available ? styles.unavailable : ''}`}
              onClick={() => handleEquipmentClick(item)}
            >
              <div className={styles.equipmentIcon}>{item.icon}</div>
              <div className={styles.equipmentInfo}>
                <h3>{item.name}</h3>
                <p className={styles.equipmentId}>{item.code}</p>
                <div className={styles.equipmentLocation}>
                  <MapPin size={14} />
                  <span>{item.location}</span>
                </div>
              </div>
              <div className={styles.equipmentStatus}>
                {item.available ? (
                  <span className={styles.statusAvailable}>พร้อมใช้</span>
                ) : (
                  <span className={styles.statusBusy}>ไม่ว่าง</span>
                )}
              </div>
              {item.available && (
                <div className={styles.clickHint}>คลิกเพื่อจอง</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && selectedEquipment && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>จองอุปกรณ์</h3>
              <button className={styles.closeButton} onClick={handleModalClose}>
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalContent}>
              {/* Equipment Info */}
              <div className={styles.equipmentDetails}>
                <h4>{selectedEquipment.fullName}</h4>
                <p>{selectedEquipment.code}</p>
                <p>{selectedEquipment.location}</p>
              </div>

              {/* Date Selection */}
              <div className={styles.formGroup}>
                <label>วันที่ต้องการใช้</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className={styles.dateInput}
                />
              </div>

              {/* Time Selection */}
              <div className={styles.timeRow}>
                <div className={styles.formGroup}>
                  <label>เวลาเริ่มต้น</label>
                  <select
                    value={bookingData.startTime}
                    onChange={(e) => setBookingData({...bookingData, startTime: e.target.value})}
                    className={styles.timeSelect}
                  >
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
                  <select
                    value={bookingData.endTime}
                    onChange={(e) => setBookingData({...bookingData, endTime: e.target.value})}
                    className={styles.timeSelect}
                  >
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>
              </div>

              {/* Purpose */}
              <div className={styles.formGroup}>
                <label>วัตถุประสงค์การใช้งาน</label>
                <textarea
                  value={bookingData.purpose}
                  onChange={(e) => setBookingData({...bookingData, purpose: e.target.value})}
                  placeholder="กรุณาระบุวัตถุประสงค์ในการจอง..."
                  className={styles.purposeTextarea}
                  rows={3}
                />
              </div>

              {/* Rules */}
              <div className={styles.rulesBox}>
                <h5>ข้อปฏิบัติในการจอง</h5>
                <ul>
                  <li>การจองจะได้รับการยืนยันภายใน 24 ชั่วโมง</li>
                  <li>หากไม่มาใช้อุปกรณ์ตรงเวลาที่จอง</li>
                  <li>หากไม่มาภายใน 15 นาที จะยกเลิกการจอง</li>
                </ul>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={handleModalClose}
              >
                ยกเลิก
              </button>
              <button 
                className={styles.confirmButton}
                onClick={handleConfirmBooking}
                disabled={!bookingData.date || !bookingData.purpose.trim()}
              >
                <CheckCircle size={16} />
                ยืนยันการจอง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}