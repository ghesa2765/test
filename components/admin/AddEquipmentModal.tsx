// components/admin/AddEquipmentModal.tsx
'use client'

import { useState } from 'react'
import { X, Upload, Package, AlertCircle } from 'lucide-react'
import styles from '@/styles/components/admin-modal.module.css'

interface Equipment {
  name: string
  category: string
  model: string
  serialNumber: string
  status: 'available' | 'borrowed' | 'maintenance' | 'broken'
  location: string
  description: string
  imageUrl?: string
  addedDate: string
  borrowCount: number
}

interface AddEquipmentModalProps {
  onAdd: (equipment: Equipment) => void
  onClose: () => void
}

export default function AddEquipmentModal({ onAdd, onClose }: AddEquipmentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    model: '',
    serialNumber: '',
    status: 'available' as const,
    location: '',
    description: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = [
    'การตรวจวัด',
    'การตรวจภาพ',
    'การตรวจเฉพาะทาง',
    'เครื่องมือผ่าตัด',
    'อุปกรณ์ช่วยเหลือ',
    'เครื่องมือทั่วไป'
  ]

  const locations = [
    'ห้องตรวจ A',
    'ห้องตรวจ B', 
    'ห้องตรวจ C',
    'ห้องตรวจพิเศษ',
    'ห้องคัดกรอง',
    'คลังอุปกรณ์',
    'ห้องซ่อมบำรุง'
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่ออุปกรณ์'
    }
    
    if (!formData.category) {
      newErrors.category = 'กรุณาเลือกหมวดหมู่'
    }
    
    if (!formData.model.trim()) {
      newErrors.model = 'กรุณากรอกรุ่น/โมเดล'
    }
    
    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = 'กรุณากรอกหมายเลขเครื่อง'
    }
    
    if (!formData.location) {
      newErrors.location = 'กรุณาเลือกสถานที่'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newEquipment: Equipment = {
        ...formData,
        addedDate: new Date().toISOString().split('T')[0],
        borrowCount: 0
      }
      
      onAdd(newEquipment)
    } catch (error) {
      console.error('Error adding equipment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitleGroup}>
            <Package size={24} className={styles.modalIcon} />
            <h2 className={styles.modalTitle}>เพิ่มอุปกรณ์ใหม่</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGrid}>
            {/* Left Column */}
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  ชื่ออุปกรณ์ <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="เช่น เครื่องวัดความดันโลหิต"
                />
                {errors.name && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.name}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  หมวดหมู่ <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.category}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  รุ่น/โมเดล <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className={`${styles.input} ${errors.model ? styles.inputError : ''}`}
                  placeholder="เช่น Omron HEM-7120"
                />
                {errors.model && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.model}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  หมายเลขเครื่อง <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  className={`${styles.input} ${errors.serialNumber ? styles.inputError : ''}`}
                  placeholder="เช่น HEM001234"
                />
                {errors.serialNumber && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.serialNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.formColumn}>
              <div className={styles.formGroup}>
                <label className={styles.label}>สถานะ</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className={styles.select}
                >
                  <option value="available">พร้อมใช้งาน</option>
                  <option value="maintenance">ซ่อมบำรุง</option>
                  <option value="broken">เสียหาย</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  สถานที่ <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`${styles.select} ${errors.location ? styles.inputError : ''}`}
                >
                  <option value="">เลือกสถานที่</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {errors.location && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.location}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>คำอธิบาย</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={styles.textarea}
                  placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับอุปกรณ์"
                  rows={4}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>รูปภาพ</label>
                <div className={styles.uploadArea}>
                  <Upload size={24} />
                  <span>คลิกเพื่ือเลือกรูปภาพ หรือลากมาวางที่นี่</span>
                  <input type="file" className={styles.fileInput} accept="image/*" />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={isSubmitting}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner} />
                  กำลังเพิ่ม...
                </>
              ) : (
                <>
                  <Package size={18} />
                  เพิ่มอุปกรณ์
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}