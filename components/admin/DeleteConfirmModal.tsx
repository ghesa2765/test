// components/admin/DeleteConfirmModal.tsx
'use client'

import { useState } from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import styles from '@/styles/components/admin-modal.module.css'

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
  borrowCount: number
}

interface DeleteConfirmModalProps {
  equipment: Equipment
  onConfirm: () => void
  onClose: () => void
}

export default function DeleteConfirmModal({ equipment, onConfirm, onClose }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmText, setConfirmText] = useState('')

  const handleConfirm = async () => {
    setIsDeleting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      onConfirm()
    } catch (error) {
      console.error('Error deleting equipment:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const isConfirmDisabled = confirmText !== equipment.name || isDeleting

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles.deleteModal}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleGroup}>
            <div className={styles.deleteIcon}>
              <Trash2 size={24} />
            </div>
            <h2 className={styles.modalTitle}>ยืนยันการลบอุปกรณ์</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn} disabled={isDeleting}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.deleteContent}>
          <p className={styles.deleteText}>
            คุณแน่ใจหรือไม่ที่จะลบอุปกรณ์ 
            <span className={styles.deleteEquipmentName}> "{equipment.name}"</span> ออกจากระบบ?
          </p>
          
          <div className={styles.deleteWarning}>
            <AlertTriangle size={20} />
            <div>
              <strong>การดำเนินการนี้ไม่สามารถยกเลิกได้!</strong>
              <br />
              ข้อมูลทั้งหมดของอุปกรณ์นี้จะถูกลบอย่างถาวร รวมถึงประวัติการยืม-คืน
            </div>
          </div>

          {/* Equipment Info */}
          <div className={styles.equipmentSummary}>
            <h4>ข้อมูลอุปกรณ์ที่จะลบ:</h4>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>รหัส:</span>
                <span className={styles.summaryValue}>{equipment.id}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>รุ่น:</span>
                <span className={styles.summaryValue}>{equipment.model}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>หมายเลขเครื่อง:</span>
                <span className={styles.summaryValue}>{equipment.serialNumber}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>จำนวนครั้งที่ยืม:</span>
                <span className={styles.summaryValue}>{equipment.borrowCount} ครั้ง</span>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className={styles.confirmationSection}>
            <label className={styles.confirmLabel}>
              พิมพ์ชื่ออุปกรณ์ <strong>"{equipment.name}"</strong> เพื่อยืนยัน:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className={styles.confirmInput}
              placeholder="พิมพ์ชื่ออุปกรณ์ที่นี่"
              disabled={isDeleting}
            />
          </div>
        </div>

        <div className={styles.deleteActions}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelBtn}
            disabled={isDeleting}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleConfirm}
            className={styles.deleteBtn}
            disabled={isConfirmDisabled}
          >
            {isDeleting ? (
              <>
                <div className={styles.spinner} />
                กำลังลบ...
              </>
            ) : (
              <>
                <Trash2 size={18} />
                ลบอุปกรณ์
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}