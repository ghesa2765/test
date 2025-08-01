// utils/emailService.ts

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  type: 'warning' | 'overdue' | 'fine_issued' | 'payment_reminder' | 'return_reminder'
  isActive: boolean
}

export interface EmailNotificationData {
  user_name: string
  user_email: string
  user_id: string
  equipment_name: string
  equipment_id: string
  borrow_date: string
  due_date: string
  return_date?: string
  fine_amount?: number
  current_fine?: number
  fine_rate?: string
  fine_id?: string
  fine_reason?: string
  payment_due?: string
  overdue_time?: string
  time_unit?: string
  grace_period?: string
  remaining_time?: string
}

export interface EmailSettings {
  emailFrom: string
  emailReplyTo: string
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPassword?: string
  emailEnabled: boolean
  smsEnabled: boolean
}

// ฟังก์ชันสำหรับแทนที่ตัวแปรในเทมเพลต
export const replaceTemplateVariables = (
  template: string,
  data: EmailNotificationData
): string => {
  let result = template
  
  // แทนที่ตัวแปรทั้งหมด
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g')
    result = result.replace(regex, String(value || ''))
  })
  
  // จัดรูปแบบวันที่
  result = result.replace(/\{\{(\w+)_formatted\}\}/g, (match, key) => {
    const dateValue = data[key as keyof EmailNotificationData]
    if (dateValue && typeof dateValue === 'string') {
      try {
        const date = new Date(dateValue)
        return date.toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch {
        return String(dateValue)
      }
    }
    return match
  })
  
  // จัดรูปแบบตัวเลข
  result = result.replace(/\{\{(\w+)_currency\}\}/g, (match, key) => {
    const numValue = data[key as keyof EmailNotificationData]
    if (typeof numValue === 'number') {
      return numValue.toLocaleString('th-TH', {
        style: 'currency',
        currency: 'THB'
      })
    }
    return match
  })
  
  return result
}

// ฟังก์ชันสำหรับสร้างอีเมลจากเทมเพลต
export const generateEmailFromTemplate = (
  template: EmailTemplate,
  data: EmailNotificationData
) => {
  return {
    to: data.user_email,
    subject: replaceTemplateVariables(template.subject, data),
    content: replaceTemplateVariables(template.content, data),
    type: template.type,
    templateId: template.id
  }
}

// ฟังก์ชันสำหรับส่งอีเมล (Mock implementation)
export const sendEmail = async (
  to: string,
  subject: string,
  content: string,
  settings: EmailSettings
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  // ตรวจสอบว่าการส่งอีเมลเปิดใช้งานหรือไม่
  if (!settings.emailEnabled) {
    return { success: false, error: 'Email notification is disabled' }
  }
  
  try {
    // ใน production จะใช้ service เช่น Nodemailer, SendGrid, AWS SES
    console.log('📧 Sending email:', {
      from: settings.emailFrom,
      to,
      subject,
      replyTo: settings.emailReplyTo
    })
    
    // Mock การส่งอีเมล
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // สุ่มผลลัพธ์สำหรับ demo
    if (Math.random() > 0.1) { // 90% success rate
      const messageId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      console.log('✅ Email sent successfully:', messageId)
      return { success: true, messageId }
    } else {
      console.log('❌ Email failed to send')
      return { success: false, error: 'SMTP connection failed' }
    }
    
  } catch (error) {
    console.error('Email sending error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// ฟังก์ชันสำหรับส่งอีเมลแจ้งเตือนตามประเภท
export class EmailNotificationService {
  private templates: EmailTemplate[]
  private settings: EmailSettings
  
  constructor(templates: EmailTemplate[], settings: EmailSettings) {
    this.templates = templates
    this.settings = settings
  }
  
  // ส่งอีเมลแจ้งเตือนก่อนครบกำหนด
  async sendReturnReminder(data: EmailNotificationData, daysBefore: number) {
    const template = this.templates.find(t => t.type === 'warning' && t.isActive)
    if (!template) {
      return { success: false, error: 'No active warning template found' }
    }
    
    const reminderData = {
      ...data,
      remaining_time: `${daysBefore} วัน`
    }
    
    const email = generateEmailFromTemplate(template, reminderData)
    return await sendEmail(email.to, email.subject, email.content, this.settings)
  }
  
  // ส่งอีเมลแจ้งเตือนเกินกำหนด
  async sendOverdueNotification(data: EmailNotificationData) {
    const template = this.templates.find(t => t.type === 'overdue' && t.isActive)
    if (!template) {
      return { success: false, error: 'No active overdue template found' }
    }
    
    const email = generateEmailFromTemplate(template, data)
    return await sendEmail(email.to, email.subject, email.content, this.settings)
  }
  
  // ส่งอีเมลแจ้งการออกใบปรับ
  async sendFineIssued(data: EmailNotificationData) {
    const template = this.templates.find(t => t.type === 'fine_issued' && t.isActive)
    if (!template) {
      return { success: false, error: 'No active fine issued template found' }
    }
    
    const email = generateEmailFromTemplate(template, data)
    return await sendEmail(email.to, email.subject, email.content, this.settings)
  }
  
  // ส่งอีเมลแจ้งเตือนชำระค่าปรับ
  async sendPaymentReminder(data: EmailNotificationData) {
    const template = this.templates.find(t => t.type === 'payment_reminder' && t.isActive)
    if (!template) {
      return { success: false, error: 'No active payment reminder template found' }
    }
    
    const email = generateEmailFromTemplate(template, data)
    return await sendEmail(email.to, email.subject, email.content, this.settings)
  }
  
  // ส่งอีเมลทดสอบ
  async sendTestEmail(templateId: string, testData: EmailNotificationData) {
    const template = this.templates.find(t => t.id === templateId)
    if (!template) {
      return { success: false, error: 'Template not found' }
    }
    
    const email = generateEmailFromTemplate(template, {
      ...testData,
      user_name: 'ทดสอบ ระบบ',
      user_email: this.settings.emailReplyTo
    })
    
    return await sendEmail(
      this.settings.emailReplyTo,
      `[TEST] ${email.subject}`,
      `นี่คืออีเมลทดสอบ:\n\n${email.content}`,
      this.settings
    )
  }
  
  // ส่งอีเมลแจ้งเตือนแบบกำหนดเอง
  async sendCustomNotification(
    templateId: string,
    recipients: string[],
    data: EmailNotificationData
  ) {
    const template = this.templates.find(t => t.id === templateId && t.isActive)
    if (!template) {
      return { success: false, error: 'Template not found or inactive' }
    }
    
    const results = []
    
    for (const recipient of recipients) {
      const email = generateEmailFromTemplate(template, {
        ...data,
        user_email: recipient
      })
      
      const result = await sendEmail(email.to, email.subject, email.content, this.settings)
      results.push({ recipient, ...result })
      
      // รอระหว่างการส่งเพื่อไม่ให้ spam
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    return {
      success: results.some(r => r.success),
      results
    }
  }
}

// ฟังก์ชันสำหรับสร้างตารางการแจ้งเตือน
export const createNotificationSchedule = (
  borrowRecords: Array<{
    id: string
    userId: string
    userName: string
    userEmail: string
    equipmentId: string
    equipmentName: string
    borrowDate: string
    dueDate: string
    status: string
  }>,
  reminderDays: number[] = [1, 3, 7]
) => {
  const now = new Date()
  const notifications: Array<{
    type: 'reminder' | 'overdue'
    recordId: string
    userEmail: string
    scheduleDate: Date
    daysBefore?: number
    daysOverdue?: number
    data: EmailNotificationData
  }> = []
  
  borrowRecords.forEach(record => {
    if (record.status !== 'borrowed') return
    
    const dueDate = new Date(record.dueDate)
    
    // สร้างการแจ้งเตือนก่อนครบกำหนด
    reminderDays.forEach(days => {
      const reminderDate = new Date(dueDate)
      reminderDate.setDate(reminderDate.getDate() - days)
      
      if (reminderDate > now) {
        notifications.push({
          type: 'reminder',
          recordId: record.id,
          userEmail: record.userEmail,
          scheduleDate: reminderDate,
          daysBefore: days,
          data: {
            user_name: record.userName,
            user_email: record.userEmail,
            user_id: record.userId,
            equipment_name: record.equipmentName,
            equipment_id: record.equipmentId,
            borrow_date: record.borrowDate,
            due_date: record.dueDate
          }
        })
      }
    })
    
    // สร้างการแจ้งเตือนหลังเกินกำหนด
    if (dueDate < now) {
      const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000))
      
      notifications.push({
        type: 'overdue',
        recordId: record.id,
        userEmail: record.userEmail,
        scheduleDate: now,
        daysOverdue,
        data: {
          user_name: record.userName,
          user_email: record.userEmail,
          user_id: record.userId,
          equipment_name: record.equipmentName,
          equipment_id: record.equipmentId,
          borrow_date: record.borrowDate,
          due_date: record.dueDate,
          overdue_time: `${daysOverdue} วัน`
        }
      })
    }
  })
  
  return notifications.sort((a, b) => a.scheduleDate.getTime() - b.scheduleDate.getTime())
}

// Default email templates
export const defaultEmailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'แจ้งเตือนก่อนครบกำหนดคืน',
    subject: '[RSU Medical] แจ้งเตือน: อุปกรณ์ใกล้ครบกำหนดคืน',
    content: `เรียน {{user_name}},

อุปกรณ์ {{equipment_name}} (รหัส: {{equipment_id}}) ที่คุณยืมไว้จะครบกำหนดคืนในวันที่ {{due_date_formatted}}

กรุณาจัดส่งคืนอุปกรณ์ภายในเวลาที่กำหนด หากคืนล่าช้าจะมีค่าปรับตามระเบียบของคลินิก

หากมีข้อสงสัยกรุณาติดต่อเจ้าหน้าที่ที่ {{emailReplyTo}}

ขอบคุณครับ/ค่ะ
คลินิกเวชกรรมมหาวิทยาลัยรังสิต`,
    type: 'warning',
    isActive: true
  },
  {
    id: '2',
    name: 'แจ้งเตือนเกินกำหนดคืน',
    subject: '[RSU Medical] เร่งด่วน: อุปกรณ์เกินกำหนดคืน',
    content: `เรียน {{user_name}},

อุปกรณ์ {{equipment_name}} (รหัส: {{equipment_id}}) ที่คุณยืมไว้เกินกำหนดคืนแล้ว {{overdue_time}}

กรุณาติดต่อเจ้าหน้าที่โดยด่วน เพื่อจัดการคืนอุปกรณ์
โทร: 02-997-2200
อีเมล: {{emailReplyTo}}

หากไม่ดำเนินการภายใน 24 ชั่วโมง อาจมีค่าปรับเพิ่มเติม

ขอบคุณครับ/ค่ะ
คลินิกเวชกรรมมหาวิทยาลัยรังสิต`,
    type: 'overdue',
    isActive: true
  },
  {
    id: '3',
    name: 'แจ้งการออกใบแจ้งค่าปรับ',
    subject: '[RSU Medical] ใบแจ้งค่าปรับ #{{fine_id}}',
    content: `เรียน {{user_name}},

ระบบได้ออกใบแจ้งค่าปรับสำหรับ:
- รหัสใบปรับ: {{fine_id}}
- อุปกรณ์: {{equipment_name}} ({{equipment_id}})
- เหตุผล: {{fine_reason}}
- จำนวนเงิน: {{fine_amount_currency}}
- กำหนดชำระ: {{payment_due_formatted}}

วิธีการชำระ:
1. ชำระที่เคาน์เตอร์คลินิก
2. โอนเงินผ่านธนาคาร (แจ้งหลักฐาน)

กรุณาชำระค่าปรับภายในกำหนดเวลา หากมีข้อสงสัยติดต่อ {{emailReplyTo}}

ขอบคุณครับ/ค่ะ
คลินิกเวชกรรมมหาวิทยาลัยรังสิต`,
    type: 'fine_issued',
    isActive: true
  },
  {
    id: '4',
    name: 'แจ้งเตือนชำระค่าปรับ',
    subject: '[RSU Medical] แจ้งเตือนชำระค่าปรับ #{{fine_id}}',
    content: `เรียน {{user_name}},

ค่าปรับ #{{fine_id}} จำนวน {{fine_amount_currency}} ยังไม่ได้รับการชำระ

กรุณาชำระภายในวันที่ {{payment_due_formatted}} เพื่อหลีกเลี่ยงค่าปรับเพิ่มเติม

หากชำระแล้ว กรุณาแจ้งหลักฐานการชำระที่ {{emailReplyTo}}

ขอบคุณครับ/ค่ะ
คลินิกเวชกรรมมหาวิทยาลัยรังสิต`,
    type: 'payment_reminder',
    isActive: true
  }
]