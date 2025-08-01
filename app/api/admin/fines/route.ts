// app/api/admin/fines/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { calculateFine, createFineRecord } from '@/utils/fineCalculation'
import { EmailNotificationService, defaultEmailTemplates } from '@/utils/emailService'

// Mock data - ใน production จะเชื่อมกับฐานข้อมูล
let fineRules = [
  {
    id: '1',
    name: 'คืนอุปกรณ์ล่าช้า - ทั่วไป',
    description: 'ค่าปรับสำหรับการคืนอุปกรณ์ล่าช้า (อุปกรณ์ทั่วไป)',
    amount: 10,
    timeUnit: 'hour' as const,
    type: 'time-based' as const,
    category: 'overdue' as const,
    gracePeriod: 30,
    gracePeriodUnit: 'minute' as const,
    maxAmount: 1000,
    isActive: true,
    applyToWeekends: false,
    studentDiscount: 20
  }
]

let emailSettings = {
  emailFrom: 'noreply@rsu.ac.th',
  emailReplyTo: 'admin@rsu.ac.th',
  emailEnabled: true,
  smsEnabled: false
}

let calculationSettings = {
  businessHoursOnly: true,
  businessStart: '08:00',
  businessEnd: '17:00',
  excludeWeekends: false,
  excludeHolidays: true,
  holidays: ['2025-01-01', '2025-04-13', '2025-04-14', '2025-04-15']
}

// GET /api/admin/fines - ดึงรายการค่าปรับ
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')
    
    switch (action) {
      case 'rules':
        return NextResponse.json({
          success: true,
          data: fineRules
        })
        
      case 'settings':
        return NextResponse.json({
          success: true,
          data: {
            email: emailSettings,
            calculation: calculationSettings
          }
        })
        
      default:
        // Mock fine records
        const mockFines = [
          {
            id: 'F001',
            userId: '6606276',
            userName: 'นิคม ใจดี',
            equipmentId: 'EQ001',
            equipmentName: 'เครื่องวัดความดันโลหิต OMRON',
            fineAmount: 150,
            fineReason: 'คืนอุปกรณ์ล่าช้า 15 ชั่วโมง',
            dueDate: '2025-08-15',
            status: 'pending',
            createdDate: '2025-08-01'
          }
        ]
        
        return NextResponse.json({
          success: true,
          data: mockFines
        })
    }
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/admin/fines - สร้างค่าปรับใหม่หรือดำเนินการต่างๆ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    switch (action) {
      case 'calculate':
        return await handleCalculateFine(body)
        
      case 'create':
        return await handleCreateFine(body)
        
      case 'send-email':
        return await handleSendEmail(body)
        
      case 'update-rules':
        return await handleUpdateRules(body)
        
      case 'update-settings':
        return await handleUpdateSettings(body)
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid request body'
    }, { status: 400 })
  }
}

// คำนวณค่าปรับ
async function handleCalculateFine(body: any) {
  const { 
    dueDate, 
    returnDate, 
    ruleId, 
    isStudent = false, 
    equipmentValue 
  } = body
  
  const rule = fineRules.find(r => r.id === ruleId)
  if (!rule) {
    return NextResponse.json({
      success: false,
      error: 'Rule not found'
    }, { status: 404 })
  }
  
  const calculation = calculateFine(
    new Date(dueDate),
    new Date(returnDate),
    rule,
    calculationSettings,
    isStudent,
    equipmentValue
  )
  
  return NextResponse.json({
    success: true,
    data: {
      calculation,
      rule,
      settings: calculationSettings
    }
  })
}

// สร้างค่าปรับ
async function handleCreateFine(body: any) {
  const {
    userId,
    userName,
    equipmentId,
    equipmentName,
    dueDate,
    returnDate,
    ruleId,
    isStudent = false,
    equipmentValue,
    reason
  } = body
  
  const rule = fineRules.find(r => r.id === ruleId)
  if (!rule) {
    return NextResponse.json({
      success: false,
      error: 'Rule not found'
    }, { status: 404 })
  }
  
  const calculation = calculateFine(
    new Date(dueDate),
    new Date(returnDate),
    rule,
    calculationSettings,
    isStudent,
    equipmentValue
  )
  
  if (calculation.totalFine === 0) {
    return NextResponse.json({
      success: false,
      error: 'No fine required'
    }, { status: 400 })
  }
  
  const fineRecord = createFineRecord(
    userId,
    userName,
    equipmentId,
    equipmentName,
    calculation,
    rule,
    reason
  )
  
  // ส่งอีเมลแจ้งเตือน
  const emailService = new EmailNotificationService(defaultEmailTemplates, emailSettings)
  
  try {
    await emailService.sendFineIssued({
      user_name: userName,
      user_email: `${userId}@student.rsu.ac.th`, // Mock email
      user_id: userId,
      equipment_name: equipmentName,
      equipment_id: equipmentId,
      fine_amount: calculation.totalFine,
      fine_id: fineRecord.id,
      fine_reason: fineRecord.fineReason,
      payment_due: fineRecord.dueDate,
      borrow_date: new Date(dueDate).toISOString().split('T')[0],
      due_date: dueDate
    })
  } catch (emailError) {
    console.warn('Failed to send fine notification email:', emailError)
  }
  
  return NextResponse.json({
    success: true,
    data: {
      fine: fineRecord,
      calculation
    }
  })
}

// ส่งอีเมล
async function handleSendEmail(body: any) {
  const { templateId, recipients, data, type = 'custom' } = body
  
  const emailService = new EmailNotificationService(defaultEmailTemplates, emailSettings)
  
  try {
    let result
    
    switch (type) {
      case 'test':
        result = await emailService.sendTestEmail(templateId, data)
        break
        
      case 'reminder':
        result = await emailService.sendReturnReminder(data, data.daysBefore || 1)
        break
        
      case 'overdue':
        result = await emailService.sendOverdueNotification(data)
        break
        
      case 'fine':
        result = await emailService.sendFineIssued(data)
        break
        
      case 'payment':
        result = await emailService.sendPaymentReminder(data)
        break
        
      default:
        result = await emailService.sendCustomNotification(templateId, recipients, data)
        break
    }
    
    return NextResponse.json({
      success: result.success,
      data: result
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to send email'
    }, { status: 500 })
  }
}

// อัปเดตกฎค่าปรับ
async function handleUpdateRules(body: any) {
  const { rules } = body
  
  if (!Array.isArray(rules)) {
    return NextResponse.json({
      success: false,
      error: 'Rules must be an array'
    }, { status: 400 })
  }
  
  // Validate rules
  for (const rule of rules) {
    if (!rule.id || !rule.name || !rule.amount || !rule.timeUnit) {
      return NextResponse.json({
        success: false,
        error: 'Invalid rule format'
      }, { status: 400 })
    }
  }
  
  fineRules = rules
  
  return NextResponse.json({
    success: true,
    data: fineRules
  })
}

// อัปเดตการตั้งค่า
async function handleUpdateSettings(body: any) {
  const { email, calculation } = body
  
  if (email) {
    emailSettings = { ...emailSettings, ...email }
  }
  
  if (calculation) {
    calculationSettings = { ...calculationSettings, ...calculation }
  }
  
  return NextResponse.json({
    success: true,
    data: {
      email: emailSettings,
      calculation: calculationSettings
    }
  })
}

// PUT /api/admin/fines/[id] - อัปเดตค่าปรับ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { status, paymentDate, notes } = body
    
    // Mock update
    console.log('Updating fine:', body)
    
    return NextResponse.json({
      success: true,
      data: {
        id: 'mock-id',
        status,
        paymentDate,
        notes,
        updatedAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update fine'
    }, { status: 500 })
  }
}

// DELETE /api/admin/fines/[id] - ลบค่าปรับ
export async function DELETE(request: NextRequest) {
  try {
    // Mock delete
    return NextResponse.json({
      success: true,
      message: 'Fine deleted successfully'
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to delete fine'
    }, { status: 500 })
  }
}