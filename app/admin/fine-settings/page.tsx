// app/admin/fine-settings/page.tsx
'use client'

import { useState } from 'react'
import { 
  Calculator, Save, RotateCcw, Clock, 
  AlertTriangle, Package, Settings, 
  Plus, Trash2, Edit, Mail, Bell,
  Eye, Play, Pause, Calendar,
  Timer, Watch, DollarSign
} from 'lucide-react'
import styles from './fine-settings.module.css'

interface FineRule {
  id: string
  name: string
  description: string
  amount: number
  timeUnit: 'minute' | 'hour' | 'day' | 'week'
  type: 'fixed' | 'time-based' | 'percentage'
  category: 'overdue' | 'damage' | 'lost' | 'misuse'
  gracePeriod: number // ระยะเวลาให้อภัยก่อนเริ่มคิดค่าปรับ
  gracePeriodUnit: 'minute' | 'hour' | 'day'
  maxAmount: number // ค่าปรับสูงสุด
  isActive: boolean
  applyToWeekends: boolean
  studentDiscount: number // ส่วนลดนักเรียน %
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: 'warning' | 'overdue' | 'fine_issued' | 'payment_reminder'
  isActive: boolean
}

export default function AdvancedFineSettings() {
  const [activeTab, setActiveTab] = useState<'rules' | 'email' | 'preview'>('rules')
  
  const [fineRules, setFineRules] = useState<FineRule[]>([
    {
      id: '1',
      name: 'คืนอุปกรณ์ล่าช้า - ทั่วไป',
      description: 'ค่าปรับสำหรับการคืนอุปกรณ์ล่าช้า (อุปกรณ์ทั่วไป)',
      amount: 10,
      timeUnit: 'hour',
      type: 'time-based',
      category: 'overdue',
      gracePeriod: 30,
      gracePeriodUnit: 'minute',
      maxAmount: 1000,
      isActive: true,
      applyToWeekends: false,
      studentDiscount: 20
    },
    {
      id: '2',
      name: 'คืนอุปกรณ์ล่าช้า - อุปกรณ์แพง',
      description: 'ค่าปรับสำหรับการคืนอุปกรณ์ล่าช้า (อุปกรณ์มูลค่าสูง)',
      amount: 50,
      timeUnit: 'hour',
      type: 'time-based',
      category: 'overdue',
      gracePeriod: 15,
      gracePeriodUnit: 'minute',
      maxAmount: 5000,
      isActive: true,
      applyToWeekends: true,
      studentDiscount: 10
    },
    {
      id: '3',
      name: 'อุปกรณ์ชำรุด',
      description: 'ค่าปรับสำหรับอุปกรณ์ที่ชำรุดจากการใช้งาน',
      amount: 50,
      timeUnit: 'day',
      type: 'percentage',
      category: 'damage',
      gracePeriod: 0,
      gracePeriodUnit: 'minute',
      maxAmount: 10000,
      isActive: true,
      applyToWeekends: true,
      studentDiscount: 15
    }
  ])

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'แจ้งเตือนก่อนครบกำหนดคืน',
      subject: '[RSU Medical] แจ้งเตือน: อุปกรณ์ใกล้ครบกำหนดคืน',
      content: `เรียน {{user_name}},

อุปกรณ์ {{equipment_name}} (รหัส: {{equipment_id}}) ที่คุณยืมไว้จะครบกำหนดคืนในวันที่ {{due_date}}

กรุณาจัดส่งคืนอุปกรณ์ภายในเวลาที่กำหนด หากคืนล่าช้าจะมีค่าปรับ {{fine_amount}} บาท{{time_unit}}

ขอบคุณครับ`,
      type: 'warning',
      isActive: true
    },
    {
      id: '2',
      name: 'แจ้งเตือนเกินกำหนดคืน',
      subject: '[RSU Medical] เร่งด่วน: อุปกรณ์เกินกำหนดคืน',
      content: `เรียน {{user_name}},

อุปกรณ์ {{equipment_name}} (รหัส: {{equipment_id}}) ที่คุณยืมไว้เกินกำหนดคืนแล้ว {{overdue_time}}

ค่าปรับปัจจุบัน: {{current_fine}} บาท
อัตราค่าปรับ: {{fine_rate}} บาท{{time_unit}}

กรุณาติดต่อเจ้าหน้าที่โดยด่วน เพื่อจัดการคืนอุปกรณ์`,
      type: 'overdue',
      isActive: true
    },
    {
      id: '3',
      name: 'แจ้งการออกใบแจ้งค่าปรับ',
      subject: '[RSU Medical] ใบแจ้งค่าปรับ #{{fine_id}}',
      content: `เรียน {{user_name}},

ระบบได้ออกใบแจ้งค่าปรับสำหรับ:
- อุปกรณ์: {{equipment_name}}
- เหตุผล: {{fine_reason}}
- จำนวนเงิน: {{fine_amount}} บาท
- กำหนดชำระ: {{payment_due}}

กรุณาชำระค่าปรับภายในกำหนดเวลา`,
      type: 'fine_issued',
      isActive: true
    }
  ])

  const [generalSettings, setGeneralSettings] = useState({
    emailEnabled: true,
    smsEnabled: false,
    autoCalculate: true,
    businessHoursOnly: true,
    businessStart: '08:00',
    businessEnd: '17:00',
    excludeWeekends: false,
    excludeHolidays: true,
    reminderDays: [1, 3, 7], // แจ้งเตือนก่อนครบกำหนดกี่วัน
    escalationLevels: 3, // จำนวนครั้งที่ส่งอีเมลแจ้งเตือน
    emailFrom: 'noreply@rsu.ac.th',
    emailReplyTo: 'admin@rsu.ac.th'
  })

  const [previewData, setPreviewData] = useState({
    equipment: 'เครื่องวัดความดันโลหิต OMRON',
    borrowDate: '2025-08-01 09:00',
    dueDate: '2025-08-03 17:00',
    returnDate: '2025-08-05 14:30',
    selectedRule: '1'
  })

  const getTimeUnitName = (unit: string) => {
    switch (unit) {
      case 'minute': return 'นาที'
      case 'hour': return 'ชั่วโมง'
      case 'day': return 'วัน'
      case 'week': return 'สัปดาห์'
      default: return unit
    }
  }

  const getTimeUnitIcon = (unit: string) => {
    switch (unit) {
      case 'minute': return <Timer size={16} />
      case 'hour': return <Watch size={16} />
      case 'day': return <Calendar size={16} />
      case 'week': return <Calendar size={16} />
      default: return <Clock size={16} />
    }
  }

  const calculatePreviewFine = () => {
    const rule = fineRules.find(r => r.id === previewData.selectedRule)
    if (!rule) return { amount: 0, breakdown: 'ไม่พบกฎที่เลือก' }

    const dueTime = new Date(previewData.dueDate).getTime()
    const returnTime = new Date(previewData.returnDate).getTime()
    const overdueMs = Math.max(0, returnTime - dueTime)
    
    // คำนวณระยะเวลาให้อภัย
    const graceMs = rule.gracePeriod * (
      rule.gracePeriodUnit === 'minute' ? 60000 :
      rule.gracePeriodUnit === 'hour' ? 3600000 : 86400000
    )
    
    const chargeableMs = Math.max(0, overdueMs - graceMs)
    
    // แปลงเป็นหน่วยที่ใช้คิดค่าปรับ
    const chargeableTime = chargeableMs / (
      rule.timeUnit === 'minute' ? 60000 :
      rule.timeUnit === 'hour' ? 3600000 :
      rule.timeUnit === 'day' ? 86400000 : 604800000
    )
    
    let fineAmount = 0
    let breakdown = ''
    
    if (rule.type === 'time-based') {
      fineAmount = Math.ceil(chargeableTime) * rule.amount
      breakdown = `${Math.ceil(chargeableTime)} ${getTimeUnitName(rule.timeUnit)} × ${rule.amount} บาท = ${fineAmount} บาท`
    } else if (rule.type === 'fixed') {
      fineAmount = chargeableTime > 0 ? rule.amount : 0
      breakdown = chargeableTime > 0 ? `ค่าปรับคงที่ ${rule.amount} บาท` : 'ไม่มีค่าปรับ'
    }
    
    // ส่วนลดนักเรียน
    const discountAmount = (fineAmount * rule.studentDiscount) / 100
    const finalAmount = Math.min(fineAmount - discountAmount, rule.maxAmount)
    
    if (rule.studentDiscount > 0) {
      breakdown += `\nหัก ส่วนลดนักเรียน ${rule.studentDiscount}% (-${discountAmount} บาท)`
    }
    
    if (finalAmount >= rule.maxAmount) {
      breakdown += `\nจำกัดที่ ${rule.maxAmount} บาท สูงสุด`
    }
    
    return { amount: finalAmount, breakdown }
  }

  const handleSaveSettings = () => {
    alert('บันทึกการตั้งค่าเรียบร้อย')
  }

  const handleTestEmail = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId)
    if (template) {
      alert(`ส่งอีเมลทดสอบ: ${template.subject}`)
    }
  }

  return (
    <div className={styles.fineSettingsPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.pageTitle}>
            <Calculator size={28} />
            ตั้งค่าค่าปรับขั้นสูง
          </h1>
          <p className={styles.pageSubtitle}>
            จัดการกฎค่าปรับแบบยืดหยุ่น พร้อมระบบแจ้งเตือนอัตโนมัติ
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.resetBtn} onClick={() => setGeneralSettings({...generalSettings})}>
            <RotateCcw size={18} />
            รีเซ็ต
          </button>
          <button className={styles.saveBtn} onClick={handleSaveSettings}>
            <Save size={18} />
            บันทึก
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'rules' ? styles.active : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <Settings size={18} />
            กฎค่าปรับ
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'email' ? styles.active : ''}`}
            onClick={() => setActiveTab('email')}
          >
            <Mail size={18} />
            แจ้งเตือนอีเมล
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'preview' ? styles.active : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={18} />
            ตัวอย่างการคิดค่าปรับ
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'rules' && (
        <div className={styles.tabContent}>
          {/* General Settings */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h2>การตั้งค่าทั่วไป</h2>
            </div>
            
            <div className={styles.settingsGrid}>
              <div className={styles.settingGroup}>
                <h3>เวลาทำการ</h3>
                <div className={styles.timeSettings}>
                  <div className={styles.settingItem}>
                    <label>เวลาเริ่มทำการ</label>
                    <input
                      type="time"
                      value={generalSettings.businessStart}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        businessStart: e.target.value
                      })}
                      className={styles.timeInput}
                    />
                  </div>
                  <div className={styles.settingItem}>
                    <label>เวลาสิ้นสุดทำการ</label>
                    <input
                      type="time"
                      value={generalSettings.businessEnd}
                      onChange={(e) => setGeneralSettings({
                        ...generalSettings,
                        businessEnd: e.target.value
                      })}
                      className={styles.timeInput}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.settingGroup}>
                <h3>การแจ้งเตือน</h3>
                <div className={styles.reminderSettings}>
                  <label>แจ้งเตือนก่อนครบกำหนด (วัน)</label>
                  <div className={styles.reminderDays}>
                    {[1, 2, 3, 5, 7].map(day => (
                      <label key={day} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={generalSettings.reminderDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setGeneralSettings({
                                ...generalSettings,
                                reminderDays: [...generalSettings.reminderDays, day].sort()
                              })
                            } else {
                              setGeneralSettings({
                                ...generalSettings,
                                reminderDays: generalSettings.reminderDays.filter(d => d !== day)
                              })
                            }
                          }}
                        />
                        {day} วัน
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.toggleSettings}>
              <div className={styles.toggleItem}>
                <label>คิดค่าปรับเฉพาะเวลาทำการ</label>
                <input
                  type="checkbox"
                  checked={generalSettings.businessHoursOnly}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    businessHoursOnly: e.target.checked
                  })}
                  className={styles.toggle}
                />
              </div>
              
              <div className={styles.toggleItem}>
                <label>ไม่คิดค่าปรับในวันหยุดสุดสัปดาห์</label>
                <input
                  type="checkbox"
                  checked={generalSettings.excludeWeekends}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    excludeWeekends: e.target.checked
                  })}
                  className={styles.toggle}
                />
              </div>

              <div className={styles.toggleItem}>
                <label>ไม่คิดค่าปรับในวันหยุดนักขัตฤกษ์</label>
                <input
                  type="checkbox"
                  checked={generalSettings.excludeHolidays}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    excludeHolidays: e.target.checked
                  })}
                  className={styles.toggle}
                />
              </div>
            </div>
          </div>

          {/* Fine Rules */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h2>กฎการคิดค่าปรับ</h2>
              <button className={styles.addRuleBtn}>
                <Plus size={18} />
                เพิ่มกฎใหม่
              </button>
            </div>

            <div className={styles.rulesTable}>
              {fineRules.map((rule) => (
                <div key={rule.id} className={styles.ruleCard}>
                  <div className={styles.ruleHeader}>
                    <div className={styles.ruleTitle}>
                      <span className={styles.ruleName}>{rule.name}</span>
                      <span className={`${styles.statusBadge} ${rule.isActive ? styles.active : styles.inactive}`}>
                        {rule.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                      </span>
                    </div>
                    <div className={styles.ruleActions}>
                      <button className={styles.editBtn}>
                        <Edit size={16} />
                      </button>
                      <button className={styles.deleteBtn}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className={styles.ruleDetails}>
                    <p className={styles.ruleDescription}>{rule.description}</p>
                    
                    <div className={styles.ruleSettings}>
                      <div className={styles.ruleSetting}>
                        <label>อัตราค่าปรับ</label>
                        <div className={styles.rateInput}>
                          <input
                            type="number"
                            value={rule.amount}
                            onChange={(e) => {
                              const newRules = fineRules.map(r => 
                                r.id === rule.id ? {...r, amount: parseInt(e.target.value)} : r
                              )
                              setFineRules(newRules)
                            }}
                            className={styles.numberInput}
                          />
                          <span>บาท/</span>
                          <select
                            value={rule.timeUnit}
                            onChange={(e) => {
                              const newRules = fineRules.map(r => 
                                r.id === rule.id ? {...r, timeUnit: e.target.value as any} : r
                              )
                              setFineRules(newRules)
                            }}
                            className={styles.selectInput}
                          >
                            <option value="minute">นาที</option>
                            <option value="hour">ชั่วโมง</option>
                            <option value="day">วัน</option>
                            <option value="week">สัปดาห์</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.ruleSetting}>
                        <label>ระยะเวลาให้อภัย</label>
                        <div className={styles.rateInput}>
                          <input
                            type="number"
                            value={rule.gracePeriod}
                            onChange={(e) => {
                              const newRules = fineRules.map(r => 
                                r.id === rule.id ? {...r, gracePeriod: parseInt(e.target.value)} : r
                              )
                              setFineRules(newRules)
                            }}
                            className={styles.numberInput}
                          />
                          <select
                            value={rule.gracePeriodUnit}
                            onChange={(e) => {
                              const newRules = fineRules.map(r => 
                                r.id === rule.id ? {...r, gracePeriodUnit: e.target.value as any} : r
                              )
                              setFineRules(newRules)
                            }}
                            className={styles.selectInput}
                          >
                            <option value="minute">นาที</option>
                            <option value="hour">ชั่วโมง</option>
                            <option value="day">วัน</option>
                          </select>
                        </div>
                      </div>

                      <div className={styles.ruleSetting}>
                        <label>ค่าปรับสูงสุด</label>
                        <div className={styles.rateInput}>
                          <input
                            type="number"
                            value={rule.maxAmount}
                            onChange={(e) => {
                              const newRules = fineRules.map(r => 
                                r.id === rule.id ? {...r, maxAmount: parseInt(e.target.value)} : r
                              )
                              setFineRules(newRules)
                            }}
                            className={styles.numberInput}
                          />
                          <span>บาท</span>
                        </div>
                      </div>

                      <div className={styles.ruleSetting}>
                        <label>ส่วนลดนักเรียน</label>
                        <div className={styles.rateInput}>
                          <input
                            type="number"
                            value={rule.studentDiscount}
                            onChange={(e) => {
                              const newRules = fineRules.map(r => 
                                r.id === rule.id ? {...r, studentDiscount: parseInt(e.target.value)} : r
                              )
                              setFineRules(newRules)
                            }}
                            className={styles.numberInput}
                          />
                          <span>%</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.ruleToggles}>
                      <label className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={rule.applyToWeekends}
                          onChange={(e) => {
                            const newRules = fineRules.map(r => 
                              r.id === rule.id ? {...r, applyToWeekends: e.target.checked} : r
                            )
                            setFineRules(newRules)
                          }}
                        />
                        คิดค่าปรับในวันหยุดสุดสัปดาห์
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'email' && (
        <div className={styles.tabContent}>
          {/* Email Settings */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h2>การตั้งค่าอีเมล</h2>
            </div>
            
            <div className={styles.emailSettings}>
              <div className={styles.settingItem}>
                <label>อีเมลผู้ส่ง</label>
                <input
                  type="email"
                  value={generalSettings.emailFrom}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    emailFrom: e.target.value
                  })}
                  className={styles.textInput}
                />
              </div>
              
              <div className={styles.settingItem}>
                <label>อีเมลตอบกลับ</label>
                <input
                  type="email"
                  value={generalSettings.emailReplyTo}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    emailReplyTo: e.target.value
                  })}
                  className={styles.textInput}
                />
              </div>
            </div>

            <div className={styles.toggleSettings}>
              <div className={styles.toggleItem}>
                <label>เปิดการแจ้งเตือนทางอีเมล</label>
                <input
                  type="checkbox"
                  checked={generalSettings.emailEnabled}
                  onChange={(e) => setGeneralSettings({
                    ...generalSettings,
                    emailEnabled: e.target.checked
                  })}
                  className={styles.toggle}
                />
              </div>
            </div>
          </div>

          {/* Email Templates */}
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h2>เทมเพลตอีเมล</h2>
              <button className={styles.addRuleBtn}>
                <Plus size={18} />
                เพิ่มเทมเพลต
              </button>
            </div>

            <div className={styles.emailTemplates}>
              {emailTemplates.map((template) => (
                <div key={template.id} className={styles.templateCard}>
                  <div className={styles.templateHeader}>
                    <div className={styles.templateInfo}>
                      <h3>{template.name}</h3>
                      <span className={styles.templateType}>{template.type}</span>
                    </div>
                    <div className={styles.templateActions}>
                      <button 
                        className={styles.testBtn}
                        onClick={() => handleTestEmail(template.id)}
                      >
                        <Play size={16} />
                        ทดสอบ
                      </button>
                      <button className={styles.editBtn}>
                        <Edit size={16} />
                      </button>
                      <button 
                        className={styles.toggleBtn}
                        onClick={() => {
                          const newTemplates = emailTemplates.map(t => 
                            t.id === template.id ? {...t, isActive: !t.isActive} : t
                          )
                          setEmailTemplates(newTemplates)
                        }}
                      >
                        {template.isActive ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.templateContent}>
                    <div className={styles.templateField}>
                      <label>หัวข้อ</label>
                      <input
                        type="text"
                        value={template.subject}
                        onChange={(e) => {
                          const newTemplates = emailTemplates.map(t => 
                            t.id === template.id ? {...t, subject: e.target.value} : t
                          )
                          setEmailTemplates(newTemplates)
                        }}
                        className={styles.textInput}
                      />
                    </div>
                    
                    <div className={styles.templateField}>
                      <label>เนื้อหา</label>
                      <textarea
                        value={template.content}
                        onChange={(e) => {
                          const newTemplates = emailTemplates.map(t => 
                            t.id === template.id ? {...t, content: e.target.value} : t
                          )
                          setEmailTemplates(newTemplates)
                        }}
                        className={styles.textArea}
                        rows={6}
                      />
                    </div>
                    
                    <div className={styles.templateVars}>
                      <small>{`ตัวแปรที่ใช้ได้: {{user_name}}, {{equipment_name}}, {{equipment_id}}, {{due_date}}, {{fine_amount}}, {{current_fine}}, {{fine_rate}}`}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className={styles.tabContent}>
          <div className={styles.settingsCard}>
            <div className={styles.cardHeader}>
              <h2>ตัวอย่างการคิดค่าปรับ</h2>
            </div>
            
            <div className={styles.previewSection}>
              <div className={styles.previewInputs}>
                <h3>ข้อมูลทดสอบ</h3>
                
                <div className={styles.settingItem}>
                  <label>อุปกรณ์</label>
                  <input
                    type="text"
                    value={previewData.equipment}
                    onChange={(e) => setPreviewData({
                      ...previewData,
                      equipment: e.target.value
                    })}
                    className={styles.textInput}
                  />
                </div>
                
                <div className={styles.dateTimeGrid}>
                  <div className={styles.settingItem}>
                    <label>วันที่ยืม</label>
                    <input
                      type="datetime-local"
                      value={previewData.borrowDate}
                      onChange={(e) => setPreviewData({
                        ...previewData,
                        borrowDate: e.target.value
                      })}
                      className={styles.datetimeInput}
                    />
                  </div>
                  
                  <div className={styles.settingItem}>
                    <label>กำหนดคืน</label>
                    <input
                      type="datetime-local"
                      value={previewData.dueDate}
                      onChange={(e) => setPreviewData({
                        ...previewData,
                        dueDate: e.target.value
                      })}
                      className={styles.datetimeInput}
                    />
                  </div>
                  
                  <div className={styles.settingItem}>
                    <label>วันที่คืนจริง</label>
                    <input
                      type="datetime-local"
                      value={previewData.returnDate}
                      onChange={(e) => setPreviewData({
                        ...previewData,
                        returnDate: e.target.value
                      })}
                      className={styles.datetimeInput}
                    />
                  </div>
                </div>
                
                <div className={styles.settingItem}>
                  <label>กฎค่าปรับที่ใช้</label>
                  <select
                    value={previewData.selectedRule}
                    onChange={(e) => setPreviewData({
                      ...previewData,
                      selectedRule: e.target.value
                    })}
                    className={styles.selectInput}
                  >
                    {fineRules.map(rule => (
                      <option key={rule.id} value={rule.id}>
                        {rule.name} ({rule.amount} บาท/{getTimeUnitName(rule.timeUnit)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className={styles.previewResult}>
                <h3>ผลการคำนวณ</h3>
                <div className={styles.fineCalculation}>
                  {(() => {
                    const result = calculatePreviewFine()
                    return (
                      <div className={styles.calculationResult}>
                        <div className={styles.fineAmount}>
                          <DollarSign size={24} />
                          <span>{result.amount.toLocaleString()} บาท</span>
                        </div>
                        <div className={styles.calculationBreakdown}>
                          <pre>{result.breakdown}</pre>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}