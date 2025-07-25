// components/dashboard/EquipmentCard.tsx
'use client'

import { useState } from 'react'
import { MapPin, Star, Clock, Calendar, Plus } from 'lucide-react'
import styles from '@/styles/components/dashboard.module.css'

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

interface EquipmentCardProps {
  equipment: Equipment
  onBorrow?: (equipment: Equipment) => void
  onBook?: (equipment: Equipment) => void
  showActions?: boolean // ใหม่: เพื่อควบคุมว่าจะแสดงปุ่มหรือไม่
}

export default function EquipmentCard({ 
  equipment, 
  onBorrow, 
  onBook, 
  showActions = true 
}: EquipmentCardProps) {
  const [showBorrowModal, setShowBorrowModal] = useState(false)
  const [showBookModal, setShowBookModal] = useState(false)

  const handleBorrowClick = () => {
    if (onBorrow) {
      onBorrow(equipment)
    } else {
      setShowBorrowModal(true)
    }
  }

  const handleBookClick = () => {
    if (onBook) {
      onBook(equipment)
    } else {
      setShowBookModal(true)
    }
  }

  const handleConfirmBorrow = () => {
    // Handle borrow confirmation
    alert('ส่งคำขอยืมเรียบร้อยแล้ว!')
    setShowBorrowModal(false)
  }

  const handleConfirmBook = () => {
    // Handle booking confirmation
    alert('จองอุปกรณ์เรียบร้อยแล้ว!')
    setShowBookModal(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#4caf50'
      case 'borrowed': return '#ff9800'
      case 'maintenance': return '#f44336'
      default: return '#757575'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'พร้อมใช้งาน'
      case 'borrowed': return 'ถูกยืม'
      case 'maintenance': return 'บำรุงรักษา'
      default: return 'ไม่ทราบสถานะ'
    }
  }

  return (
    <>
      <div className={styles.equipmentCard}>
        <div className={styles.equipmentCardHeader}>
          <div className={styles.equipmentIcon}>
            📦
          </div>
          <div className={styles.equipmentStatus}>
            <span 
              className={styles.statusBadge}
              style={{ backgroundColor: getStatusColor(equipment.status) }}
            >
              {getStatusText(equipment.status)}
            </span>
          </div>
        </div>

        <div className={styles.equipmentCardBody}>
          <h3 className={styles.equipmentName}>{equipment.name}</h3>
          <p className={styles.equipmentCode}>{equipment.code}</p>
          <p className={styles.equipmentCategory}>{equipment.category}</p>
          <p className={styles.equipmentDescription}>{equipment.description}</p>

          <div className={styles.equipmentDetails}>
            <div className={styles.detailItem}>
              <MapPin size={16} />
              <span>{equipment.location}</span>
            </div>
            <div className={styles.detailItem}>
              <Star size={16} />
              <span>{equipment.rating}</span>
            </div>
          </div>

          {equipment.status === 'borrowed' && equipment.dueDate && (
            <div className={styles.warningMessage}>
              <Clock size={16} />
              <span>กำหนดคืน: {new Date(equipment.dueDate).toLocaleDateString('th-TH')}</span>
            </div>
          )}

          {equipment.status === 'maintenance' && equipment.maintenanceUntil && (
            <div className={styles.maintenanceMessage}>
              <span>บำรุงรักษาถึง: {new Date(equipment.maintenanceUntil).toLocaleDateString('th-TH')}</span>
            </div>
          )}
        </div>

        {/* Action Buttons - แสดงเฉพาะเมื่อ showActions = true และสถานะ available */}
        {showActions && equipment.status === 'available' && (
          <div className={styles.equipmentCardActions}>
            <button 
              onClick={handleBorrowClick}
              className={styles.borrowButton}
            >
              <Plus size={16} />
              ยืม
            </button>
            <button 
              onClick={handleBookClick}
              className={styles.bookButton}
            >
              <Calendar size={16} />
              จองล่วงหน้า
            </button>
          </div>
        )}

        {/* Borrowed info */}
        {equipment.status === 'borrowed' && equipment.borrower && (
          <div className={styles.borrowerInfo}>
            <span>ยืมโดย: {equipment.borrower}</span>
          </div>
        )}

        {/* Unavailable actions for non-available equipment */}
        {showActions && equipment.status !== 'available' && (
          <div className={styles.equipmentCardActions}>
            {equipment.status === 'borrowed' && (
              <button className={styles.waitingButton} disabled>
                <Clock size={16} />
                จอง
              </button>
            )}
            {equipment.status === 'maintenance' && (
              <button className={styles.maintenanceButton} disabled>
                บำรุงรักษา
              </button>
            )}
          </div>
        )}
      </div>

      {/* Borrow Modal */}
      {showBorrowModal && (
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
                <h4>กระเป๋ำน้ำร้อน</h4>
                <p>HB001</p>
                <p>ห้องฟิสิโอเธอราปี</p>
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

      {/* Book Modal */}
      {showBookModal && (
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
                <h4>กระเป๋ำน้ำร้อน</h4>
                <p>HB001</p>
                <p>ห้องฟิสิโอเธอราปี</p>
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
                  <h5>ข้อมูลยืนในการจอง</h5>
                  <ul>
                    <li>การจองจะได้รับการยืนยันภายใน 24 ชั่วโมง</li>
                    <li>มากับอุปกรณ์ตรงเวลาที่จอง</li>
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
    </>
  )
}