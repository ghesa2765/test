'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, User } from 'lucide-react';
import styles from './register.module.css';

// TypeScript interfaces
interface Program {
  id: string;
  name: string;
  degree: string;
  duration: number;
}

interface Department {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  programs: Program[];
}

interface Organization {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  code: string;
  departments: Department[];
}

interface FormData {
  title: string;
  name: string;
  organizationId: string;
  departmentId: string;
  programId: string;
  email: string;
  phone: string;
  studentStaffId: string;
  status: string;
  gender: string;
  year: string;
  password: string;
  confirmPassword: string;
}

// Mock data สำหรับโครงสร้าง RSU - ในระบบจริงจะดึงจาก API
const rsuOrganizations: Organization[] = [
  {
    id: '1',
    name: 'วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี',
    nameEn: 'College of Digital Innovation Technology',
    type: 'COLLEGE',
    code: 'DIT',
    departments: [
      {
        id: '1',
        name: 'วิทยาการคอมพิวเตอร์',
        nameEn: 'Computer Science',
        code: 'CS',
        programs: [
          { id: '1', name: 'วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการคอมพิวเตอร์', degree: 'ปริญญาตรี', duration: 4 }
        ]
      },
      {
        id: '2',
        name: 'เทคโนโลยีสารสนเทศ',
        nameEn: 'Information Technology',
        code: 'IT',
        programs: [
          { id: '2', name: 'วิทยาศาสตรบัณฑิต สาขาวิชาเทคโนโลยีสารสนเทศ', degree: 'ปริญญาตรี', duration: 4 }
        ]
      },
      {
        id: '3',
        name: 'วิศวกรรมซอฟต์แวร์',
        nameEn: 'Software Engineering',
        code: 'SE',
        programs: [
          { id: '3', name: 'วิทยาศาสตรบัณฑิต สาขาวิชาวิศวกรรมซอฟต์แวร์', degree: 'ปริญญาตรี', duration: 4 }
        ]
      },
      {
        id: '4',
        name: 'วิทยาการข้อมูลและปัญญาประดิษฐ์',
        nameEn: 'Data Science and Artificial Intelligence',
        code: 'DSAI',
        programs: [
          { id: '4', name: 'วิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการข้อมูลและปัญญาประดิษฐ์', degree: 'ปริญญาตรี', duration: 4 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'คณะบริหารธุรกิจ',
    nameEn: 'Faculty of Business Administration',
    type: 'FACULTY',
    code: 'BBA',
    departments: [
      {
        id: '5',
        name: 'การจัดการ',
        nameEn: 'Management',
        code: 'MGT',
        programs: [
          { id: '5', name: 'บริหารธุรกิจบัณฑิต สาขาวิชาการจัดการ', degree: 'ปริญญาตรี', duration: 4 }
        ]
      },
      {
        id: '6',
        name: 'การตลาด',
        nameEn: 'Marketing',
        code: 'MKT',
        programs: [
          { id: '6', name: 'บริหารธุรกิจบัณฑิต สาขาวิชาการตลาด', degree: 'ปริญญาตรี', duration: 4 }
        ]
      },
      {
        id: '7',
        name: 'การเงิน',
        nameEn: 'Finance',
        code: 'FIN',
        programs: [
          { id: '7', name: 'บริหารธุรกิจบัณฑิต สาขาวิชาการเงิน', degree: 'ปริญญาตรี', duration: 4 }
        ]
      },
      {
        id: '8',
        name: 'การจัดการโลจิสติกส์และซัพพลายเชน',
        nameEn: 'Logistics and Supply Chain Management',
        code: 'LSM',
        programs: [
          { id: '8', name: 'บริหารธุรกิจบัณฑิต สาขาวิชาการจัดการโลจิสติกส์และซัพพลายเชน', degree: 'ปริญญาตรี', duration: 4 }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'วิทยาลัยวิศวกรรมศาสตร์',
    nameEn: 'College of Engineering',
    type: 'COLLEGE',
    code: 'ENG',
    departments: [
      {
        id: '9',
        name: 'วิศวกรรมโยธา',
        nameEn: 'Civil Engineering',
        code: 'CE',
        programs: [
          { id: '9', name: 'วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมโยธา', degree: 'ปริญญาตรี', duration: 4 }
        ]
      },
      {
        id: '10',
        name: 'วิศวกรรมคอมพิวเตอร์',
        nameEn: 'Computer Engineering',
        code: 'CPE',
        programs: [
          { id: '10', name: 'วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์', degree: 'ปริญญาตรี', duration: 4 }
        ]
      },
      {
        id: '11',
        name: 'วิศวกรรมเครื่องกล',
        nameEn: 'Mechanical Engineering',
        code: 'ME',
        programs: [
          { id: '11', name: 'วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมเครื่องกล', degree: 'ปริญญาตรี', duration: 4 }
        ]
      },
      {
        id: '12',
        name: 'วิศวกรรมไฟฟ้า',
        nameEn: 'Electrical Engineering',
        code: 'EE',
        programs: [
          { id: '12', name: 'วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมไฟฟ้า', degree: 'ปริญญาตรี', duration: 4 }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'วิทยาลัยแพทยศาสตร์',
    nameEn: 'College of Medicine',
    type: 'COLLEGE',
    code: 'MED',
    departments: [
      {
        id: '13',
        name: 'แพทยศาสตร์',
        nameEn: 'Medicine',
        code: 'MD',
        programs: [
          { id: '13', name: 'แพทยศาสตรบัณฑิต', degree: 'ปริญญาตรี', duration: 6 }
        ]
      }
    ]
  },
  {
    id: '5',
    name: 'คณะพยาบาลศาสตร์',
    nameEn: 'Faculty of Nursing Science',
    type: 'FACULTY',
    code: 'NURS',
    departments: [
      {
        id: '14',
        name: 'พยาบาลศาสตร์',
        nameEn: 'Nursing Science',
        code: 'NS',
        programs: [
          { id: '14', name: 'พยาบาลศาสตรบัณฑิต', degree: 'ปริญญาตรี', duration: 4 }
        ]
      }
    ]
  },
  {
    id: '6',
    name: 'สำนักบริการเทคโนโลยีสารสนเทศ',
    nameEn: 'Information Technology Services Center',
    type: 'OFFICE',
    code: 'ITSC',
    departments: [
      {
        id: '15',
        name: 'ฝ่ายพัฒนาระบบและโปรแกรม',
        nameEn: 'System and Software Development Division',
        code: 'SSD',
        programs: []
      },
      {
        id: '16',
        name: 'ฝ่ายบริการเทคโนโลยีสารสนเทศ',
        nameEn: 'IT Services Division',
        code: 'ITS',
        programs: []
      },
      {
        id: '17',
        name: 'ฝ่ายโครงสร้างพื้นฐานและเครือข่าย',
        nameEn: 'Infrastructure and Network Division',
        code: 'IND',
        programs: []
      },
      {
        id: '18',
        name: 'ฝ่ายสื่อการเรียนการสอนและนวัตกรรม',
        nameEn: 'Educational Media and Innovation Division',
        code: 'EMI',
        programs: []
      }
    ]
  }
];

export default function AuthRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  // Form state for cascade dropdown
  const [formData, setFormData] = useState<FormData>({
    title: '',
    name: '',
    organizationId: '',
    departmentId: '',
    programId: '',
    email: '',
    phone: '',
    studentStaffId: '',
    status: '',
    gender: '',
    year: '',
    password: '',
    confirmPassword: ''
  });

  // Properly typed state variables
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([]);
  const [availablePrograms, setAvailablePrograms] = useState<Program[]>([]);

  // เมื่อเลือกหน่วยงาน - CASCADE LEVEL 1
  useEffect(() => {
    if (formData.organizationId) {
      const selectedOrg = rsuOrganizations.find(org => org.id === formData.organizationId);
      if (selectedOrg) {
        setAvailableDepartments(selectedOrg.departments);
        setFormData(prev => ({
          ...prev,
          departmentId: '',
          programId: ''
        }));
        setAvailablePrograms([]);
      }
    } else {
      setAvailableDepartments([]);
      setAvailablePrograms([]);
    }
  }, [formData.organizationId]);

  // เมื่อเลือกแผนก/สาขา - CASCADE LEVEL 2
  useEffect(() => {
    if (formData.departmentId) {
      const selectedDept = availableDepartments.find(dept => dept.id === formData.departmentId);
      if (selectedDept) {
        setAvailablePrograms(selectedDept.programs);
        setFormData(prev => ({
          ...prev,
          programId: ''
        }));
      }
    } else {
      setAvailablePrograms([]);
    }
  }, [formData.departmentId, availableDepartments]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // ตรวจสอบว่าผู้ใช้ยอมรับเงื่อนไขหรือไม่
    if (!acceptTerms) {
      alert('กรุณายอมรับเงื่อนไขการใช้งานก่อนลงทะเบียน');
      return;
    }

    // ตรวจสอบรหัสผ่าน
    if (formData.password !== formData.confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน');
      return;
    }

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!formData.name || !formData.email || !formData.organizationId || !formData.departmentId || !formData.status) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    // ตรวจสอบหลักสูตรสำหรับนักศึกษา
    if (formData.status === 'student' && availablePrograms.length > 0 && !formData.programId) {
      alert('กรุณาเลือกหลักสูตร');
      return;
    }

    // ตรวจสอบชั้นปีสำหรับนักศึกษา
    if (formData.status === 'student' && !formData.year) {
      alert('กรุณาเลือกชั้นปี');
      return;
    }

    console.log('Form Data:', formData);
    
    // แสดงข้อความสำเร็จ
    setShowSuccess(true);
    
    // รอ 3 วินาที แล้ว redirect ไปหน้า login
    setTimeout(() => {
      router.push('/auth/login');
    }, 3000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getOrgTypeName = (type: string): string => {
    const types: Record<string, string> = {
      'FACULTY': 'คณะ',
      'COLLEGE': 'วิทยาลัย', 
      'INSTITUTE': 'สถาบัน',
      'OFFICE': 'สำนักงาน',
      'CENTER': 'ศูนย์'
    };
    return types[type] || type;
  };

  return (
    <div className={styles.container}>
      {/* Admin Login Link */}
      <Link href="/admin/login" className={styles.adminLink}>
        <User size={18} />
        เข้าสู่ระบบแอดมิน
      </Link>

      {/* Logo and Language Section */}
      <div className={styles.logoWrapper}>
        <div className={styles.logoSection}>
          <img 
            src="/logo.png" 
            alt="RSU Logo" 
            className={styles.logo}
          />
          <p className={styles.clinicText}>คลินิกเวชกรรมมหาวิทยาลัยรังสิต</p>
          <p className={styles.clinicTextEn}>RSU MEDICAL CLINIC</p>
          
          <div className={styles.langButtons}>
            <button className={`${styles.langBtn} ${styles.langBtnActive}`}>
              <span className={styles.checkIcon}>✓</span>
              ภาษาไทย
            </button>
            <button className={styles.langBtn}>
              <span className={styles.checkIconHidden}>✓</span>
              English
            </button>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>ลงทะเบียนผู้ใช้งาน</h2>
        
        <form onSubmit={handleSubmit} id="registerForm">
          <div className={styles.formGrid}>
            {/* Left Column */}
            <div className={styles.formColumn}>
              {/* Title and Name */}
              <div className={styles.formGroupRow}>
                <div className={styles.formGroupSmall}>
                  <label className={styles.label}>คำนำหน้า :</label>
                  <select 
                    className={styles.select}
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  >
                    <option value="">เลือก</option>
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                    <option value="ดร.">ดร.</option>
                    <option value="ผศ.">ผศ.</option>
                    <option value="รศ.">รศ.</option>
                    <option value="ศ.">ศ.</option>
                  </select>
                </div>
                <div className={styles.formGroupLarge}>
                  <label className={styles.label}>ชื่อ-นามสกุล :</label>
                  <input 
                    type="text" 
                    placeholder="ชื่อ-นามสกุล"
                    className={styles.input}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Faculty/Organization - CASCADE LEVEL 1 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>คณะ/หน่วยงาน/สถาบัน/วิทยาลัย :</label>
                <select 
                  className={styles.select} 
                  value={formData.organizationId}
                  onChange={(e) => handleInputChange('organizationId', e.target.value)}
                  required
                >
                  <option value="">เลือกหน่วยงาน</option>
                  <optgroup label="วิทยาศาสตร์ - สุขภาพ">
                    {rsuOrganizations
                      .filter(org => ['MED', 'NURS'].includes(org.code))
                      .map((org) => (
                        <option key={org.id} value={org.id}>
                          {getOrgTypeName(org.type)}{org.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="วิศวกรรมศาสตร์ - เทคโนโลยี">
                    {rsuOrganizations
                      .filter(org => ['DIT', 'ENG'].includes(org.code))
                      .map((org) => (
                        <option key={org.id} value={org.id}>
                          {getOrgTypeName(org.type)}{org.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="เศรษฐกิจ - ธุรกิจ">
                    {rsuOrganizations
                      .filter(org => ['BBA'].includes(org.code))
                      .map((org) => (
                        <option key={org.id} value={org.id}>
                          {getOrgTypeName(org.type)}{org.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="สำนักงาน - ศูนย์บริการ">
                    {rsuOrganizations
                      .filter(org => ['ITSC'].includes(org.code))
                      .map((org) => (
                        <option key={org.id} value={org.id}>
                          {getOrgTypeName(org.type)}{org.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              {/* Department/Branch - CASCADE LEVEL 2 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>แผนก/สาขาวิชา :</label>
                <select 
                  className={`${styles.select} ${!formData.organizationId ? styles.selectDisabled : ''}`}
                  value={formData.departmentId}
                  onChange={(e) => handleInputChange('departmentId', e.target.value)}
                  disabled={!formData.organizationId}
                  required
                >
                  <option value="">
                    {!formData.organizationId ? 'กรุณาเลือกหน่วยงานก่อน' : 'เลือกแผนก/สาขา'}
                  </option>
                  {availableDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name} ({dept.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Program - CASCADE LEVEL 3 (เฉพาะนักศึกษา) */}
              {formData.status === 'student' && availablePrograms.length > 0 && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>หลักสูตร :</label>
                  <select 
                    className={`${styles.select} ${!formData.departmentId ? styles.selectDisabled : ''}`}
                    value={formData.programId}
                    onChange={(e) => handleInputChange('programId', e.target.value)}
                    disabled={!formData.departmentId}
                    required
                  >
                    <option value="">
                      {!formData.departmentId ? 'กรุณาเลือกสาขาวิชาก่อน' : 'เลือกหลักสูตร'}
                    </option>
                    {availablePrograms.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Email */}
              <div className={styles.formGroup}>
                <label className={styles.label}>อีเมล :</label>
                <input 
                  type="email" 
                  placeholder="example@rsu.ac.th"
                  className={styles.input}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                />
              </div>

              {/* Phone */}
              <div className={styles.formGroup}>
                <label className={styles.label}>เบอร์โทรศัพท์ :</label>
                <input 
                  type="tel" 
                  placeholder="0812345678"
                  className={styles.input}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.formColumn}>
              {/* Student/Staff ID */}
              <div className={styles.formGroup}>
                <label className={styles.label}>รหัสนักศึกษา/บุคลากร :</label>
                <input 
                  type="text" 
                  placeholder="รหัส 7-11 หลัก"
                  className={styles.input}
                  value={formData.studentStaffId}
                  onChange={(e) => handleInputChange('studentStaffId', e.target.value)}
                  required
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                <span className={styles.helperText}>กรอกรหัสนักศึกษา/พนักงาน</span>
              </div>

              {/* Status */}
              <div className={styles.formGroup}>
                <label className={styles.label}>สถานะ :</label>
                <select 
                  className={styles.select} 
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  required
                >
                  <option value="">เลือกสถานะ</option>
                  <option value="student">นักศึกษา</option>
                  <option value="staff">บุคลากร</option>
                  <option value="faculty">อาจารย์</option>
                </select>
              </div>

              {/* Year (เฉพาะนักศึกษา) */}
              {formData.status === 'student' && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>ชั้นปี :</label>
                  <select 
                    className={styles.select}
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    required
                  >
                    <option value="">เลือกชั้นปี</option>
                    <option value="1">ปี 1</option>
                    <option value="2">ปี 2</option>
                    <option value="3">ปี 3</option>
                    <option value="4">ปี 4</option>
                    <option value="5">ปี 5</option>
                    <option value="6">ปี 6</option>
                  </select>
                </div>
              )}

              {/* Gender */}
              <div className={styles.formGroup}>
                <label className={styles.label}>เพศ :</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="gender" 
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    />
                    <span>ชาย</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="gender" 
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    />
                    <span>หญิง</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input 
                      type="radio" 
                      name="gender" 
                      value="other"
                      checked={formData.gender === 'other'}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                    />
                    <span>อื่นๆ</span>
                  </label>
                </div>
              </div>

              {/* Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>รหัสผ่าน :</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="รหัสผ่าน"
                    className={styles.input}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="ต้องมีตัวเลข, ตัวพิมพ์เล็ก, ตัวพิมพ์ใหญ่ และอย่างน้อย 8 ตัว"
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <span className={styles.helperText}>ต้องมีตัวพิมพ์เล็ก, ใหญ่, ตัวเลข อย่างน้อย 8 ตัว</span>
              </div>

              {/* Confirm Password */}
              <div className={styles.formGroup}>
                <label className={styles.label}>ยืนยันรหัสผ่าน :</label>
                <div className={styles.inputWrapper}>
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="ยืนยันรหัสผ่าน"
                    className={styles.input}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className={styles.termsSection}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
              />
              <span className={styles.checkmark}></span>
              ฉันยอมรับ
              <Link href="/terms" className={styles.termsLink}>เงื่อนไขการใช้งาน</Link>
              และ
              <Link href="/privacy" className={styles.termsLink}>นโยบายความเป็นส่วนตัว</Link>
            </label>
          </div>
        </form>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <Link href="/auth/login" className={styles.backButton}>
            <span className={styles.backIcon}>‹</span>
            มีบัญชีแล้ว? เข้าสู่ระบบ
          </Link>
          <button type="submit" form="registerForm" className={styles.registerButton}>
            ลงทะเบียน
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.modalTitle}>ลงทะเบียนสำเร็จ!</h3>
            <p className={styles.modalText}>
              ระบบได้ส่งข้อมูลการลงทะเบียนไปยังอีเมลของคุณแล้ว
            </p>
            <p className={styles.modalSubtext}>
              กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}