// app/admin/equipment/add/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Package, Upload, AlertCircle, Save, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import styles from './add-equipment.module.css'

interface FormData {
  name: string
  category: string
  model: string
  serialNumber: string
  status: 'AVAILABLE' | 'BORROWED' | 'MAINTENANCE' | 'DAMAGED'
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED'
  location: string
  description: string
  manufacturer: string
  purchaseDate: string
  warrantUntil: string
  price: string
  imageUrl?: string
}

export default function AddEquipmentPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    model: '',
    serialNumber: '',
    status: 'AVAILABLE',
    condition: 'EXCELLENT',
    location: '',
    description: '',
    manufacturer: '',
    purchaseDate: '',
    warrantUntil: '',
    price: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  // ข้อมูล dropdown options
  const categories = [
    'การตรวจวัด',
    'การตรวจภาพ', 
    'การตรวจเฉพาะทาง',
    'เครื่องมือผ่าตัด',
    'อุปกรณ์ช่วยเหลือ',
    'อุปกรณ์ฝึกอบรม',
    'เครื่องมือทั่วไป'
  ]

  const locations = [
    'ห้องตรวจ A',
    'ห้องตรวจ B', 
    'ห้องตรวจ C',
    'ห้องตรวจพิเศษ',
    'ห้องคัดกรอง',
    'ห้องกายภาพบำบัด',
    'ห้องฝึกปฏิบัติ',
    'ห้องผู้ป่วยนอก',
    'ห้องเก็บอุปกรณ์ A',
    'ห้องเก็บอุปกรณ์ B',
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

    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'กรุณากรอกผู้ผลิต'
    }

    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'กรุณาเลือกวันที่จัดซื้อ'
    }

    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = 'กรุณากรอกราคาเป็นตัวเลข'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // จำลองการส่งข้อมูลไป API
      await new Promise(resolve => setTimeout(resolve, 2000))

      // สร้าง ID ใหม่สำหรับอุปกรณ์
      const newEquipment = {
        id: `EQ${Date.now().toString().slice(-6)}`,
        ...formData,
        addedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString(),
        borrowCount: 0,
        rating: 5.0
      }

      console.log('New Equipment Added:', newEquipment)
      
      // แสดงข้อความสำเร็จ
      alert('เพิ่มอุปกรณ์เรียบร้อยแล้ว!')
      
      // กลับไปหน้า equipment list
      router.push('/admin/equipment')
      
    } catch (error) {
      console.error('Error adding equipment:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มอุปกรณ์')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      category: '',
      model: '',
      serialNumber: '',
      status: 'AVAILABLE',
      condition: 'EXCELLENT',
      location: '',
      description: '',
      manufacturer: '',
      purchaseDate: '',
      warrantUntil: '',
      price: ''
    })
    setErrors({})
    setImagePreview('')
  }

  return (
    <div className={styles.addEquipmentPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <Link href="/admin/equipment" className={styles.backButton}>
            <ArrowLeft size={20} />
            กลับ
          </Link>
          <div className={styles.headerInfo}>
            <h1 className={styles.pageTitle}>
              <Package size={28} />
              เพิ่มอุปกรณ์ใหม่
            </h1>
            <p className={styles.pageSubtitle}>
              กรอกข้อมูลอุปกรณ์การแพทย์ที่ต้องการเพิ่มเข้าระบบ
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.equipmentForm}>
        <div className={styles.formContainer}>
          
          {/* Basic Information Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>ข้อมูลพื้นฐาน</h2>
            
            <div className={styles.formGrid}>
              {/* Equipment Name */}
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

              {/* Category */}
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

              {/* Model */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  รุ่น/โมเดล <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className={`${styles.input} ${errors.model ? styles.inputError : ''}`}
                  placeholder="เช่น OMRON HEM-7120"
                />
                {errors.model && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.model}
                  </span>
                )}
              </div>

              {/* Serial Number */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  หมายเลขเครื่อง <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.serialNumber}
                  onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                  className={`${styles.input} ${errors.serialNumber ? styles.inputError : ''}`}
                  placeholder="เช่น SN123456789"
                />
                {errors.serialNumber && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.serialNumber}
                  </span>
                )}
              </div>

              {/* Manufacturer */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  ผู้ผลิต <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  className={`${styles.input} ${errors.manufacturer ? styles.inputError : ''}`}
                  placeholder="เช่น OMRON"
                />
                {errors.manufacturer && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.manufacturer}
                  </span>
                )}
              </div>

              {/* Location */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  สถานที่เก็บ <span className={styles.required}>*</span>
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
            </div>
          </div>

          {/* Status & Condition Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>สถานะและสภาพ</h2>
            
            <div className={styles.formGrid}>
              {/* Status */}
              <div className={styles.formGroup}>
                <label className={styles.label}>สถานะ</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as FormData['status'])}
                  className={styles.select}
                >
                  <option value="AVAILABLE">พร้อมใช้</option>
                  <option value="BORROWED">ถูกยืม</option>
                  <option value="MAINTENANCE">ซ่อมบำรุง</option>
                  <option value="DAMAGED">เสียหาย</option>
                </select>
              </div>

              {/* Condition */}
              <div className={styles.formGroup}>
                <label className={styles.label}>สภาพ</label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value as FormData['condition'])}
                  className={styles.select}
                >
                  <option value="EXCELLENT">ดีเยี่ยม</option>
                  <option value="GOOD">ดี</option>
                  <option value="FAIR">พอใช้</option>
                  <option value="POOR">แย่</option>
                  <option value="DAMAGED">เสียหาย</option>
                </select>
              </div>
            </div>
          </div>

          {/* Purchase Information Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>ข้อมูลการจัดซื้อ</h2>
            
            <div className={styles.formGrid}>
              {/* Purchase Date */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  วันที่จัดซื้อ <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                  className={`${styles.input} ${errors.purchaseDate ? styles.inputError : ''}`}
                />
                {errors.purchaseDate && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.purchaseDate}
                  </span>
                )}
              </div>

              {/* Warrant Until */}
              <div className={styles.formGroup}>
                <label className={styles.label}>วันหมดประกัน</label>
                <input
                  type="date"
                  value={formData.warrantUntil}
                  onChange={(e) => handleInputChange('warrantUntil', e.target.value)}
                  className={styles.input}
                />
              </div>

              {/* Price */}
              <div className={styles.formGroup}>
                <label className={styles.label}>ราคา (บาท)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                {errors.price && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} />
                    {errors.price}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description & Image Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>รายละเอียดเพิ่มเติม</h2>
            
            {/* Description */}
            <div className={styles.formGroup}>
              <label className={styles.label}>คำอธิบาย</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={styles.textarea}
                placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับอุปกรณ์ เช่น คุณสมบัติพิเศษ วิธีการใช้งาน ข้อควรระวัง"
                rows={4}
              />
            </div>

            {/* Image Upload */}
            <div className={styles.formGroup}>
              <label className={styles.label}>รูปภาพอุปกรณ์</label>
              
              <div className={styles.uploadArea}>
                {imagePreview ? (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                    <button 
                      type="button"
                      onClick={() => {
                        setImagePreview('')
                        setFormData(prev => ({ ...prev, imageUrl: '' }))
                      }}
                      className={styles.removeImageBtn}
                    >
                      ลบรูป
                    </button>
                  </div>
                ) : (
                  <label className={styles.uploadLabel}>
                    <Upload size={24} />
                    <span>คลิกเพื่อเลือกรูปภาพ หรือลากมาวางที่นี่</span>
                    <small>รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</small>
                    <input 
                      type="file" 
                      className={styles.fileInput} 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className={styles.formActions}>
          <button
            type="button"
            onClick={handleReset}
            className={styles.resetButton}
            disabled={isSubmitting}
          >
            <RotateCcw size={18} />
            ล้างข้อมูล
          </button>
          
          <div className={styles.actionGroup}>
            <Link 
              href="/admin/equipment" 
              className={styles.cancelButton}
            >
              ยกเลิก
            </Link>
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className={styles.spinner} />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save size={18} />
                  บันทึกอุปกรณ์
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}