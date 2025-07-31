// app/admin/fine-settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Clock, Calendar, Save, AlertCircle } from 'lucide-react'
import styles from './fine-settings.module.css'

interface FineSettings {
  id: string
  finePerDay: number
  finePerHour?: number
  unit: 'day' | 'hour'
  maxFine?: number
  gracePeriod: number
  isActive: boolean
  updatedBy: string
  updatedAt: string
}

export default function FineSettingsPage() {
  const [settings, setSettings] = useState<FineSettings>({
    id: '1',
    finePerDay: 10,
    finePerHour: 1,
    unit: 'day',
    maxFine: 500,
    gracePeriod: 24, // 24 ชั่วโมง
    isActive: true,
    updatedBy: 'admin',
    updatedAt: new Date().toISOString()
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // จำลองการบันทึกข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedSettings = {
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: 'admin' // ในอนาคตจะมาจาก user context
      }
      
      setSettings(updatedSettings)
      setMessage('บันทึกการตั้งค่าเรียบร้อยแล้ว')
      
      // ล้างข้อความหลัง 3 วินาที
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการบันทึก')
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePreview = () => {
    const daysLate = 3
    const fineAmount = settings.unit === 'day' 
      ? daysLate * settings.finePerDay
      : daysLate * 24 * (settings.finePerHour || 1)
    
    return Math.min(fineAmount, settings.maxFine || fineAmount)
  }

  return (
    <div className={styles.fineSettingsPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>ตั้งค่าค่าปรับ</h1>
        <p className={styles.description}>
          จัดการค่าปรับสำหรับการคืนอุปกรณ์ล่าช้า
        </p>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('ผิดพลาด') ? styles.error : styles.success}`}>
          <AlertCircle size={16} />
          {message}
        </div>
      )}

      <div className={styles.settingsCard}>
        <div className={styles.settingsGrid}>
          {/* หน่วยคิดค่าปรับ */}
          <div className={styles.settingGroup}>
            <label className={styles.label}>หน่วยคิดค่าปรับ</label>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="day"
                  checked={settings.unit === 'day'}
                  onChange={(e) => setSettings({...settings, unit: e.target.value as 'day' | 'hour'})}
                />
                <Calendar size={16} />
                รายวัน
              </label>
              <label className={styles.radioLabel}>
                <input
                  type="radio"
                  value="hour"
                  checked={settings.unit === 'hour'}
                  onChange={(e) => setSettings({...settings, unit: e.target.value as 'day' | 'hour'})}
                />
                <Clock size={16} />
                รายชั่วโมง
              </label>
            </div>
          </div>

          {/* อัตราค่าปรับรายวัน */}
          {settings.unit === 'day' && (
            <div className={styles.settingGroup}>
              <label className={styles.label} htmlFor="finePerDay">
                ค่าปรับต่อวัน (บาท)
              </label>
              <div className={styles.inputWrapper}>
                <DollarSign size={16} className={styles.inputIcon} />
                <input
                  id="finePerDay"
                  type="number"
                  min="0"
                  step="1"
                  value={settings.finePerDay}
                  onChange={(e) => setSettings({...settings, finePerDay: Number(e.target.value)})}
                  className={styles.input}
                />
              </div>
            </div>
          )}

          {/* อัตราค่าปรับรายชั่วโมง */}
          {settings.unit === 'hour' && (
            <div className={styles.settingGroup}>
              <label className={styles.label} htmlFor="finePerHour">
                ค่าปรับต่อชั่วโมง (บาท)
              </label>
              <div className={styles.inputWrapper}>
                <DollarSign size={16} className={styles.inputIcon} />
                <input
                  id="finePerHour"
                  type="number"
                  min="0"
                  step="0.5"
                  value={settings.finePerHour || 1}
                  onChange={(e) => setSettings({...settings, finePerHour: Number(e.target.value)})}
                  className={styles.input}
                />
              </div>
            </div>
          )}

          {/* ค่าปรับสูงสุด */}
          <div className={styles.settingGroup}>
            <label className={styles.label} htmlFor="maxFine">
              ค่าปรับสูงสุด (บาท)
            </label>
            <div className={styles.inputWrapper}>
              <DollarSign size={16} className={styles.inputIcon} />
              <input
                id="maxFine"
                type="number"
                min="0"
                step="50"
                value={settings.maxFine || ''}
                onChange={(e) => setSettings({...settings, maxFine: Number(e.target.value) || undefined})}
                className={styles.input}
                placeholder="ไม่จำกัด"
              />
            </div>
          </div>

          {/* ช่วงเวลาผ่อนผัน */}
          <div className={styles.settingGroup}>
            <label className={styles.label} htmlFor="gracePeriod">
              ช่วงเวลาผ่อนผัน (ชั่วโมง)
            </label>
            <div className={styles.inputWrapper}>
              <Clock size={16} className={styles.inputIcon} />
              <input
                id="gracePeriod"
                type="number"
                min="0"
                max="72"
                step="1"
                value={settings.gracePeriod}
                onChange={(e) => setSettings({...settings, gracePeriod: Number(e.target.value)})}
                className={styles.input}
              />
            </div>
            <small className={styles.helpText}>
              เวลาที่ให้ผ่อนผันก่อนเริ่มคิดค่าปรับ
            </small>
          </div>

          {/* สถานะเปิด/ปิด */}
          <div className={styles.settingGroup}>
            <label className={styles.label}>
              สถานะการใช้งาน
            </label>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={settings.isActive}
                onChange={(e) => setSettings({...settings, isActive: e.target.checked})}
                className={styles.toggle}
              />
              <span className={styles.toggleSlider}></span>
              {settings.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
            </label>
          </div>
        </div>

        {/* ตัวอย่างการคำนวณ */}
        <div className={styles.previewSection}>
          <h3 className={styles.previewTitle}>ตัวอย่างการคำนวณ</h3>
          <div className={styles.previewCard}>
            <p>หากคืนอุปกรณ์ช้า <strong>3 วัน</strong></p>
            <p className={styles.previewAmount}>
              ค่าปรับที่ต้องจ่าย: <strong>{calculatePreview().toLocaleString()} บาท</strong>
            </p>
          </div>
        </div>

        {/* ปุ่มบันทึก */}
        <div className={styles.actions}>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={styles.saveButton}
          >
            <Save size={16} />
            {isLoading ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
          </button>
        </div>

        {/* ข้อมูลการอัปเดตล่าสุด */}
        <div className={styles.lastUpdated}>
          อัปเดตล่าสุด: {new Date(settings.updatedAt).toLocaleString('th-TH')} 
          โดย {settings.updatedBy}
        </div>
      </div>
    </div>
  )
}