// app/admin/settings/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { 
  Settings,
  Users,
  Bell,
  Shield,
  Database,
  Globe,
  Wrench,
  FileText,
  Save,
  RotateCcw,
  Upload,
  Download,
  Mail,
  MessageSquare,
  Key,
  Lock,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  AlertTriangle,
  Info,
  Calendar,
  Clock,
  Building,
  Phone,
  MapPin,
  User,
  Camera,
  Palette,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Laptop
} from 'lucide-react'
import styles from '@/styles/pages/admin-settings.module.css'

interface SettingsData {
  general: {
    hospitalName: string
    hospitalCode: string
    address: string
    phone: string
    email: string
    logo: string
    timezone: string
    language: string
    currency: string
    theme: 'light' | 'dark' | 'auto'
  }
  notifications: {
    emailEnabled: boolean
    smsEnabled: boolean
    pushEnabled: boolean
    maintenanceReminders: boolean
    overdueAlerts: boolean
    warrantyExpiration: boolean
    emergencyAlerts: boolean
    reminderDays: number
    quietHours: {
      enabled: boolean
      startTime: string
      endTime: string
    }
  }
  maintenance: {
    defaultDuration: number
    autoSchedule: boolean
    reminderDays: number
    workingHours: {
      start: string
      end: string
    }
    workingDays: string[]
    emergencyContactEnabled: boolean
    emergencyPhone: string
  }
  security: {
    sessionTimeout: number
    passwordMinLength: number
    requireUppercase: boolean
    requireNumbers: boolean
    requireSymbols: boolean
    twoFactorEnabled: boolean
    loginAttempts: number
    lockoutDuration: number
  }
  backup: {
    autoBackup: boolean
    backupInterval: 'daily' | 'weekly' | 'monthly'
    backupTime: string
    retentionDays: number
    cloudSync: boolean
    lastBackup: string
  }
  reports: {
    autoGenerate: boolean
    reportTypes: string[]
    schedule: 'daily' | 'weekly' | 'monthly'
    recipients: string[]
    format: 'pdf' | 'excel' | 'both'
  }
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'technician' | 'viewer'
  status: 'active' | 'inactive'
  lastLogin: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      hospitalName: 'โรงพยาบาลศรีนครินทร์',
      hospitalCode: 'SNH001',
      address: '123 ถ.ศรีนครินทร์ เขตวัฒนา กรุงเทพฯ 10110',
      phone: '02-123-4567',
      email: 'admin@srinakarin.hospital.th',
      logo: '',
      timezone: 'Asia/Bangkok',
      language: 'th',
      currency: 'THB',
      theme: 'light'
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      maintenanceReminders: true,
      overdueAlerts: true,
      warrantyExpiration: true,
      emergencyAlerts: true,
      reminderDays: 7,
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '08:00'
      }
    },
    maintenance: {
      defaultDuration: 2,
      autoSchedule: true,
      reminderDays: 3,
      workingHours: {
        start: '08:00',
        end: '17:00'
      },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      emergencyContactEnabled: true,
      emergencyPhone: '02-123-4567'
    },
    security: {
      sessionTimeout: 120,
      passwordMinLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: false,
      twoFactorEnabled: false,
      loginAttempts: 5,
      lockoutDuration: 30
    },
    backup: {
      autoBackup: true,
      backupInterval: 'daily',
      backupTime: '02:00',
      retentionDays: 30,
      cloudSync: false,
      lastBackup: '2025-01-27T02:00:00'
    },
    reports: {
      autoGenerate: true,
      reportTypes: ['maintenance', 'equipment', 'cost'],
      schedule: 'weekly',
      recipients: ['admin@hospital.th'],
      format: 'pdf'
    }
  })

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'ผู้ดูแลระบบ',
      email: 'admin@hospital.th',
      role: 'admin',
      status: 'active',
      lastLogin: '2025-01-27T10:30:00'
    },
    {
      id: '2',
      name: 'วิทยา เครื่องมือ',
      email: 'technician@hospital.th',
      role: 'technician',
      status: 'active',
      lastLogin: '2025-01-27T09:15:00'
    }
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)

  const tabs = [
    { id: 'general', icon: Settings, label: 'ทั่วไป' },
    { id: 'users', icon: Users, label: 'ผู้ใช้งาน' },
    { id: 'notifications', icon: Bell, label: 'การแจ้งเตือน' },
    { id: 'maintenance', icon: Wrench, label: 'การบำรุงรักษา' },
    { id: 'security', icon: Shield, label: 'ความปลอดภัย' },
    { id: 'backup', icon: Database, label: 'สำรองข้อมูล' },
    { id: 'reports', icon: FileText, label: 'รายงาน' }
  ]

  const handleSettingChange = (category: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const handleNestedSettingChange = (category: keyof SettingsData, nested: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [nested]: {
          ...prev[category][nested],
          [field]: value
        }
      }
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setHasChanges(false)
    alert('บันทึกการตั้งค่าเรียบร้อยแล้ว')
  }

  const handleReset = () => {
    if (confirm('คุณต้องการรีเซ็ตการตั้งค่าหรือไม่?')) {
      // Reset to default values
      setHasChanges(false)
    }
  }

  const getRoleLabel = (role: User['role']) => {
    const roles = {
      admin: 'ผู้ดูแลระบบ',
      manager: 'ผู้จัดการ',
      technician: 'ช่างเทคนิค',
      viewer: 'ผู้ดู'
    }
    return roles[role] || role
  }

  const getRoleBadgeClass = (role: User['role']) => {
    const classes = {
      admin: styles.roleAdmin,
      manager: styles.roleManager, 
      technician: styles.roleTechnician,
      viewer: styles.roleViewer
    }
    return classes[role] || styles.roleViewer
  }

  const renderGeneralSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>
        <Building size={20} />
        ข้อมูลโรงพยาบาล
      </h3>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>ชื่อโรงพยาบาล</label>
          <input
            type="text"
            value={settings.general.hospitalName}
            onChange={(e) => handleSettingChange('general', 'hospitalName', e.target.value)}
            className={styles.formInput}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>รหัสโรงพยาบาล</label>
          <input
            type="text"
            value={settings.general.hospitalCode}
            onChange={(e) => handleSettingChange('general', 'hospitalCode', e.target.value)}
            className={styles.formInput}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>ที่อยู่</label>
          <textarea
            value={settings.general.address}
            onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
            className={styles.formTextarea}
            rows={3}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>เบอร์โทรศัพท์</label>
          <input
            type="tel"
            value={settings.general.phone}
            onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
            className={styles.formInput}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>อีเมล</label>
          <input
            type="email"
            value={settings.general.email}
            onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
            className={styles.formInput}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label>เขตเวลา</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className={styles.formSelect}
          >
            <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
            <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
            <option value="UTC">UTC (GMT+0)</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>ภาษา</label>
          <select
            value={settings.general.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
            className={styles.formSelect}
          >
            <option value="th">ไทย</option>
            <option value="en">English</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label>สกุลเงิน</label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className={styles.formSelect}
          >
            <option value="THB">บาท (THB)</option>
            <option value="USD">ดอลลาร์ (USD)</option>
            <option value="EUR">ยูโร (EUR)</option>
          </select>
        </div>
      </div>

      <h3 className={styles.sectionTitle}>
        <Palette size={20} />
        รูปลักษณ์
      </h3>
      
      <div className={styles.formGroup}>
        <label>ธีม</label>
        <div className={styles.themeSelector}>
          <button
            className={`${styles.themeOption} ${settings.general.theme === 'light' ? styles.active : ''}`}
            onClick={() => handleSettingChange('general', 'theme', 'light')}
          >
            <Sun size={20} />
            สว่าง
          </button>
          <button
            className={`${styles.themeOption} ${settings.general.theme === 'dark' ? styles.active : ''}`}
            onClick={() => handleSettingChange('general', 'theme', 'dark')}
          >
            <Moon size={20} />
            มืด
          </button>
          <button
            className={`${styles.themeOption} ${settings.general.theme === 'auto' ? styles.active : ''}`}
            onClick={() => handleSettingChange('general', 'theme', 'auto')}
          >
            <Monitor size={20} />
            อัตโนมัติ
          </button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>โลโก้</label>
        <div className={styles.logoUpload}>
          <div className={styles.logoPreview}>
            {settings.general.logo ? (
              <img src={settings.general.logo} alt="Logo" />
            ) : (
              <Camera size={32} />
            )}
          </div>
          <button className={styles.uploadBtn}>
            <Upload size={16} />
            อัปโหลดโลโก้
          </button>
        </div>
      </div>
    </div>
  )

  const renderUsersSettings = () => (
    <div className={styles.settingsSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>
          <Users size={20} />
          จัดการผู้ใช้งาน
        </h3>
        <button 
          className={styles.addBtn}
          onClick={() => setShowAddUser(true)}
        >
          <Plus size={16} />
          เพิ่มผู้ใช้
        </button>
      </div>

      <div className={styles.usersTable}>
        <table>
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>อีเมล</th>
              <th>บทบาท</th>
              <th>สถานะ</th>
              <th>เข้าสู่ระบบล่าสุด</th>
              <th>การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div className={styles.userInfo}>
                    <div className={styles.userAvatar}>
                      <User size={16} />
                    </div>
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${user.status === 'active' ? styles.statusActive : styles.statusInactive}`}>
                    {user.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                  </span>
                </td>
                <td>{new Date(user.lastLogin).toLocaleString('th-TH')}</td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionBtn} title="แก้ไข">
                      <Edit size={14} />
                    </button>
                    <button className={styles.actionBtn} title="ลบ">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderNotificationsSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>
        <Bell size={20} />
        การแจ้งเตือน
      </h3>
      
      <div className={styles.toggleGroup}>
        <div className={styles.toggleItem}>
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.emailEnabled}
              onChange={(e) => handleSettingChange('notifications', 'emailEnabled', e.target.checked)}
            />
            <span className={styles.toggleSwitch}></span>
            <div className={styles.toggleContent}>
              <Mail size={18} />
              <div>
                <strong>แจ้งเตือนทางอีเมล</strong>
                <p>ส่งการแจ้งเตือนผ่านอีเมล</p>
              </div>
            </div>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.smsEnabled}
              onChange={(e) => handleSettingChange('notifications', 'smsEnabled', e.target.checked)}
            />
            <span className={styles.toggleSwitch}></span>
            <div className={styles.toggleContent}>
              <MessageSquare size={18} />
              <div>
                <strong>แจ้งเตือนทาง SMS</strong>
                <p>ส่งการแจ้งเตือนผ่าน SMS</p>
              </div>
            </div>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.pushEnabled}
              onChange={(e) => handleSettingChange('notifications', 'pushEnabled', e.target.checked)}
            />
            <span className={styles.toggleSwitch}></span>
            <div className={styles.toggleContent}>
              <Smartphone size={18} />
              <div>
                <strong>Push Notification</strong>
                <p>ส่งการแจ้งเตือนแบบ Push</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      <h4 className={styles.subTitle}>ประเภทการแจ้งเตือน</h4>
      
      <div className={styles.toggleGroup}>
        <div className={styles.toggleItem}>
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.maintenanceReminders}
              onChange={(e) => handleSettingChange('notifications', 'maintenanceReminders', e.target.checked)}
            />
            <span className={styles.toggleSwitch}></span>
            <div className={styles.toggleContent}>
              <Wrench size={18} />
              <div>
                <strong>แจ้งเตือนการบำรุงรักษา</strong>
                <p>แจ้งเตือนก่อนถึงกำหนดบำรุงรักษา</p>
              </div>
            </div>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.overdueAlerts}
              onChange={(e) => handleSettingChange('notifications', 'overdueAlerts', e.target.checked)}
            />
            <span className={styles.toggleSwitch}></span>
            <div className={styles.toggleContent}>
              <AlertTriangle size={18} />
              <div>
                <strong>แจ้งเตือนเกินกำหนด</strong>
                <p>แจ้งเตือนเมื่อเกินกำหนดบำรุงรักษา</p>
              </div>
            </div>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <label>
            <input
              type="checkbox"
              checked={settings.notifications.warrantyExpiration}
              onChange={(e) => handleSettingChange('notifications', 'warrantyExpiration', e.target.checked)}
            />
            <span className={styles.toggleSwitch}></span>
            <div className={styles.toggleContent}>
              <Shield size={18} />
              <div>
                <strong>แจ้งเตือนหมดประกัน</strong>
                <p>แจ้งเตือนก่อนหมดอายุประกัน</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>แจ้งเตือนล่วงหน้า (วัน)</label>
          <input
            type="number"
            value={settings.notifications.reminderDays}
            onChange={(e) => handleSettingChange('notifications', 'reminderDays', parseInt(e.target.value))}
            className={styles.formInput}
            min="1"
            max="30"
          />
        </div>
      </div>

      <h4 className={styles.subTitle}>ช่วงเวลาเงียบ</h4>
      
      <div className={styles.toggleItem}>
        <label>
          <input
            type="checkbox"
            checked={settings.notifications.quietHours.enabled}
            onChange={(e) => handleNestedSettingChange('notifications', 'quietHours', 'enabled', e.target.checked)}
          />
          <span className={styles.toggleSwitch}></span>
          <div className={styles.toggleContent}>
            <Clock size={18} />
            <div>
              <strong>เปิดใช้ช่วงเวลาเงียบ</strong>
              <p>ไม่ส่งการแจ้งเตือนในช่วงเวลาที่กำหนด</p>
            </div>
          </div>
        </label>
      </div>

      {settings.notifications.quietHours.enabled && (
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>เริ่มเวลา</label>
            <input
              type="time"
              value={settings.notifications.quietHours.startTime}
              onChange={(e) => handleNestedSettingChange('notifications', 'quietHours', 'startTime', e.target.value)}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label>สิ้นสุดเวลา</label>
            <input
              type="time"
              value={settings.notifications.quietHours.endTime}
              onChange={(e) => handleNestedSettingChange('notifications', 'quietHours', 'endTime', e.target.value)}
              className={styles.formInput}
            />
          </div>
        </div>
      )}
    </div>
  )

  const renderMaintenanceSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>
        <Wrench size={20} />
        การตั้งค่าการบำรุงรักษา
      </h3>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>ระยะเวลาเริ่มต้น (ชั่วโมง)</label>
          <input
            type="number"
            value={settings.maintenance.defaultDuration}
            onChange={(e) => handleSettingChange('maintenance', 'defaultDuration', parseInt(e.target.value))}
            className={styles.formInput}
            min="0.5"
            step="0.5"
          />
        </div>

        <div className={styles.formGroup}>
          <label>แจ้งเตือนล่วงหน้า (วัน)</label>
          <input
            type="number"
            value={settings.maintenance.reminderDays}
            onChange={(e) => handleSettingChange('maintenance', 'reminderDays', parseInt(e.target.value))}
            className={styles.formInput}
            min="1"
            max="30"
          />
        </div>
      </div>

      <div className={styles.toggleItem}>
        <label>
          <input
            type="checkbox"
            checked={settings.maintenance.autoSchedule}
            onChange={(e) => handleSettingChange('maintenance', 'autoSchedule', e.target.checked)}
          />
          <span className={styles.toggleSwitch}></span>
          <div className={styles.toggleContent}>
            <Calendar size={18} />
            <div>
              <strong>จัดตารางอัตโนมัติ</strong>
              <p>สร้างตารางการบำรุงรักษาอัตโนมัติ</p>
            </div>
          </div>
        </label>
      </div>

      <h4 className={styles.subTitle}>เวลาทำงาน</h4>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>เริ่มเวลาทำงาน</label>
          <input
            type="time"
            value={settings.maintenance.workingHours.start}
            onChange={(e) => handleNestedSettingChange('maintenance', 'workingHours', 'start', e.target.value)}
            className={styles.formInput}
          />
        </div>
        <div className={styles.formGroup}>
          <label>สิ้นสุดเวลาทำงาน</label>
          <input
            type="time"
            value={settings.maintenance.workingHours.end}
            onChange={(e) => handleNestedSettingChange('maintenance', 'workingHours', 'end', e.target.value)}
            className={styles.formInput}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>วันทำงาน</label>
        <div className={styles.daySelector}>
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
            const dayLabels = {
              monday: 'จันทร์',
              tuesday: 'อังคาร', 
              wednesday: 'พุธ',
              thursday: 'พฤหัสบดี',
              friday: 'ศุกร์',
              saturday: 'เสาร์',
              sunday: 'อาทิตย์'
            }
            
            return (
              <label key={day} className={styles.dayOption}>
                <input
                  type="checkbox"
                  checked={settings.maintenance.workingDays.includes(day)}
                  onChange={(e) => {
                    const newDays = e.target.checked 
                      ? [...settings.maintenance.workingDays, day]
                      : settings.maintenance.workingDays.filter(d => d !== day)
                    handleSettingChange('maintenance', 'workingDays', newDays)
                  }}
                />
                <span>{dayLabels[day]}</span>
              </label>
            )
          })}
        </div>
      </div>

      <h4 className={styles.subTitle}>การติดต่อฉุกเฉิน</h4>
      
      <div className={styles.toggleItem}>
        <label>
          <input
            type="checkbox"
            checked={settings.maintenance.emergencyContactEnabled}
            onChange={(e) => handleSettingChange('maintenance', 'emergencyContactEnabled', e.target.checked)}
          />
          <span className={styles.toggleSwitch}></span>
          <div className={styles.toggleContent}>
            <Phone size={18} />
            <div>
              <strong>เปิดใช้การติดต่อฉุกเฉิน</strong>
              <p>เปิดใช้เบอร์โทรติดต่อฉุกเฉิน</p>
            </div>
          </div>
        </label>
      </div>

      {settings.maintenance.emergencyContactEnabled && (
        <div className={styles.formGroup}>
          <label>เบอร์โทรฉุกเฉิน</label>
          <input
            type="tel"
            value={settings.maintenance.emergencyPhone}
            onChange={(e) => handleSettingChange('maintenance', 'emergencyPhone', e.target.value)}
            className={styles.formInput}
          />
        </div>
      )}
    </div>
  )

  const renderSecuritySettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>
        <Shield size={20} />
        ความปลอดภัย
      </h3>
      
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>หมดเวลาเซสชัน (นาที)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className={styles.formInput}
            min="5"
            max="480"
          />
        </div>

        <div className={styles.formGroup}>
          <label>ความยาวรหัสผ่านขั้นต่ำ</label>
          <input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
            className={styles.formInput}
            min="6"
            max="32"
          />
        </div>

        <div className={styles.formGroup}>
          <label>จำนวนครั้งที่พยายามเข้าสู่ระบบ</label>
          <input
            type="number"
            value={settings.security.loginAttempts}
            onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
            className={styles.formInput}
            min="3"
            max="10"
          />
        </div>

        <div className={styles.formGroup}>
          <label>ระยะเวลาล็อค (นาที)</label>
          <input
            type="number"
            value={settings.security.lockoutDuration}
            onChange={(e) => handleSettingChange('security', 'lockoutDuration', parseInt(e.target.value))}
            className={styles.formInput}
            min="5"
            max="1440"
          />
        </div>
      </div>

      <h4 className={styles.subTitle}>ข้อกำหนดรหัสผ่าน</h4>
      
      <div className={styles.toggleGroup}>
        <div className={styles.toggleItem}>
          <label>
            <input
              type="checkbox"
              checked={settings.security.requireUppercase}
              onChange={(e) => handleSettingChange('security', 'requireUppercase', e.target.checked)}
            />
            <span className={styles.toggleSwitch}></span>
            <div className={styles.toggleContent}>
              <div>
                <strong>ต้องมีตัวอักษรใหญ่</strong>
                <p>รหัสผ่านต้องมีตัวอักษรใหญ่อย่างน้อย 1 ตัว</p>
              </div>
            </div>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <label>
            <input
              type="checkbox"
              checked={settings.security.requireNumbers}
              onChange={(e) => handleSettingChange('security', 'requireNumbers', e.target.checked)}
            />
            <span className={styles.toggleSwitch}></span>
            <div className={styles.toggleContent}>
              <div>
                <strong>ต้องมีตัวเลข</strong>
                <p>รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว</p>
              </div>
            </div>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <label>
            <input
              type="checkbox"
              checked={settings.security.requireSymbols}
              onChange={(e) => handleSettingChange('security', 'requireSymbols', e.target.checked)}
            />
            <span className={styles.toggleSwitch}></span>
            <div className={styles.toggleContent}>
              <div>
                <strong>ต้องมีสัญลักษณ์พิเศษ</strong>
                <p>รหัสผ่านต้องมีสัญลักษณ์พิเศษอย่างน้อย 1 ตัว</p>
              </div>
            </div>
          </label>
        </div>

        <div className={styles.toggleItem}>
          <label>
            <input
              type="checkbox"
              checked={settings.security.twoFactorEnabled}
              onChange={(e) => handleSettingChange('security', 'twoFactorEnabled', e.target.checked)}
            />
            <span className={styles.toggleSwitch}></span>
            <div className={styles.toggleContent}>
              <Key size={18} />
              <div>
                <strong>การยืนยันตัวตน 2 ขั้นตอน</strong>
                <p>เพิ่มความปลอดภัยด้วย 2FA</p>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  )

  const renderBackupSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>
        <Database size={20} />
        การสำรองข้อมูล
      </h3>
      
      <div className={styles.toggleItem}>
        <label>
          <input
            type="checkbox"
            checked={settings.backup.autoBackup}
            onChange={(e) => handleSettingChange('backup', 'autoBackup', e.target.checked)}
          />
          <span className={styles.toggleSwitch}></span>
          <div className={styles.toggleContent}>
            <Database size={18} />
            <div>
              <strong>สำรองข้อมูลอัตโนมัติ</strong>
              <p>สำรองข้อมูลตามกำหนดเวลา</p>
            </div>
          </div>
        </label>
      </div>

      {settings.backup.autoBackup && (
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>ความถี่การสำรอง</label>
            <select
              value={settings.backup.backupInterval}
              onChange={(e) => handleSettingChange('backup', 'backupInterval', e.target.value)}
              className={styles.formSelect}
            >
              <option value="daily">ทุกวัน</option>
              <option value="weekly">ทุกสัปดาห์</option>
              <option value="monthly">ทุกเดือน</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>เวลาสำรอง</label>
            <input
              type="time"
              value={settings.backup.backupTime}
              onChange={(e) => handleSettingChange('backup', 'backupTime', e.target.value)}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>เก็บข้อมูลสำรอง (วัน)</label>
            <input
              type="number"
              value={settings.backup.retentionDays}
              onChange={(e) => handleSettingChange('backup', 'retentionDays', parseInt(e.target.value))}
              className={styles.formInput}
              min="7"
              max="365"
            />
          </div>
        </div>
      )}

      <div className={styles.toggleItem}>
        <label>
          <input
            type="checkbox"
            checked={settings.backup.cloudSync}
            onChange={(e) => handleSettingChange('backup', 'cloudSync', e.target.checked)}
          />
          <span className={styles.toggleSwitch}></span>
          <div className={styles.toggleContent}>
            <Globe size={18} />
            <div>
              <strong>ซิงค์กับ Cloud</strong>
              <p>สำรองข้อมูลไปยัง Cloud Storage</p>
            </div>
          </div>
        </label>
      </div>

      <div className={styles.backupStatus}>
        <div className={styles.statusItem}>
          <Clock size={16} />
          <span>สำรองครั้งล่าสุด: {new Date(settings.backup.lastBackup).toLocaleString('th-TH')}</span>
        </div>
      </div>

      <div className={styles.backupActions}>
        <button className={styles.backupBtn}>
          <Download size={16} />
          สำรองข้อมูลทันที
        </button>
        <button className={styles.restoreBtn}>
          <Upload size={16} />
          กู้คืนข้อมูล
        </button>
      </div>
    </div>
  )

  const renderReportsSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>
        <FileText size={20} />
        การตั้งค่ารายงาน
      </h3>
      
      <div className={styles.toggleItem}>
        <label>
          <input
            type="checkbox"
            checked={settings.reports.autoGenerate}
            onChange={(e) => handleSettingChange('reports', 'autoGenerate', e.target.checked)}
          />
          <span className={styles.toggleSwitch}></span>
          <div className={styles.toggleContent}>
            <FileText size={18} />
            <div>
              <strong>สร้างรายงานอัตโนมัติ</strong>
              <p>สร้างและส่งรายงานตามกำหนดเวลา</p>
            </div>
          </div>
        </label>
      </div>

      {settings.reports.autoGenerate && (
        <>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>ความถี่การสร้าง</label>
              <select
                value={settings.reports.schedule}
                onChange={(e) => handleSettingChange('reports', 'schedule', e.target.value)}
                className={styles.formSelect}
              >
                <option value="daily">ทุกวัน</option>
                <option value="weekly">ทุกสัปดาห์</option>
                <option value="monthly">ทุกเดือน</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>รูปแบบไฟล์</label>
              <select
                value={settings.reports.format}
                onChange={(e) => handleSettingChange('reports', 'format', e.target.value)}
                className={styles.formSelect}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="both">ทั้งสองแบบ</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>ประเภทรายงาน</label>
            <div className={styles.checkboxGroup}>
              {[
                { value: 'maintenance', label: 'รายงานการบำรุงรักษา' },
                { value: 'equipment', label: 'รายงานสถานะอุปกรณ์' },
                { value: 'cost', label: 'รายงานค่าใช้จ่าย' },
                { value: 'performance', label: 'รายงานประสิทธิภาพ' }
              ].map(type => (
                <label key={type.value} className={styles.checkboxOption}>
                  <input
                    type="checkbox"
                    checked={settings.reports.reportTypes.includes(type.value)}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...settings.reports.reportTypes, type.value]
                        : settings.reports.reportTypes.filter(t => t !== type.value)
                      handleSettingChange('reports', 'reportTypes', newTypes)
                    }}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>ผู้รับรายงาน (อีเมล)</label>
            <div className={styles.recipientsList}>
              {settings.reports.recipients.map((email, index) => (
                <div key={index} className={styles.recipientItem}>
                  <span>{email}</span>
                  <button
                    onClick={() => {
                      const newRecipients = settings.reports.recipients.filter((_, i) => i !== index)
                      handleSettingChange('reports', 'recipients', newRecipients)
                    }}
                    className={styles.removeBtn}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button className={styles.addRecipientBtn}>
                <Plus size={14} />
                เพิ่มผู้รับ
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings()
      case 'users':
        return renderUsersSettings()
      case 'notifications':
        return renderNotificationsSettings()
      case 'maintenance':
        return renderMaintenanceSettings()
      case 'security':
        return renderSecuritySettings()
      case 'backup':
        return renderBackupSettings()
      case 'reports':
        return renderReportsSettings()
      default:
        return renderGeneralSettings()
    }
  }

  return (
    <div className={styles.settingsPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>
            <Settings size={32} />
            ตั้งค่าระบบ
          </h1>
          <p className={styles.pageSubtitle}>จัดการการตั้งค่าและกำหนดค่าระบบ</p>
        </div>
        
        {hasChanges && (
          <div className={styles.saveActions}>
            <button className={styles.resetBtn} onClick={handleReset}>
              <RotateCcw size={16} />
              รีเซ็ต
            </button>
            <button 
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className={styles.loadingSpinner}></div>
              ) : (
                <Save size={16} />
              )}
              บันทึก
            </button>
          </div>
        )}
      </div>

      <div className={styles.settingsContainer}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <nav className={styles.tabList}>
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}