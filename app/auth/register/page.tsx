'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, User } from 'lucide-react';
import styles from './register.module.css';

export default function AuthRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // ตรวจสอบว่าผู้ใช้ยอมรับเงื่อนไขหรือไม่
    if (!acceptTerms) {
      alert('กรุณายอมรับเงื่อนไขการใช้งานก่อนลงทะเบียน');
      return;
    }
    
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
                  <select className={styles.select}>
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
                    required
                  />
                </div>
              </div>

              {/* Faculty - abbreviated for brevity */}
              <div className={styles.formGroup}>
                <label className={styles.label}>คณะ/หน่วยงาน/สถาบัน/วิทยาลัย :</label>
                <select className={styles.select} required>
                  <option value="">เลือกหน่วยงาน</option>
                  <optgroup label="วิทยาศาสตร์ - สุขภาพ">
                    <option value="วิทยาลัยแพทยศาสตร์">วิทยาลัยแพทยศาสตร์</option>
                    <option value="วิทยาลัยการแพทย์แผนตะวันออก">วิทยาลัยการแพทย์แผนตะวันออก</option>
                    <option value="วิทยาลัยเภสัชศาสตร์">วิทยาลัยเภสัชศาสตร์</option>
                    <option value="พยาบาลศาสตร์">คณะพยาบาลศาสตร์</option>
                    <option value="วิทยาศาสตร์">คณะวิทยาศาสตร์</option>
                  </optgroup>
                  <optgroup label="วิศวกรรมศาสตร์ - เทคโนโลยี">
                    <option value="สถาบันการบิน">สถาบันการบิน</option>
                    <option value="วิทยาลัยวิศวกรรมศาสตร์">วิทยาลัยวิศวกรรมศาสตร์</option>
                    <option value="วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี">วิทยาลัยนวัตกรรมดิจิทัลเทคโนโลยี</option>
                  </optgroup>
                  <optgroup label="มนุษยศาสตร์ - สังคมศาสตร์">
                    <option value="วิทยาลัยนิเทศศาสตร์">วิทยาลัยนิเทศศาสตร์</option>
                    <option value="นิติศาสตร์">คณะนิติศาสตร์</option>
                    <option value="วิทยาลัยศิลปศาสตร์">วิทยาลัยศิลปศาสตร์</option>
                  </optgroup>
                  <optgroup label="เศรษฐกิจ - ธุรกิจ">
                    <option value="บริหารธุรกิจ">คณะบริหารธุรกิจ</option>
                    <option value="บัญชี">คณะบัญชี</option>
                    <option value="เศรษฐศาสตร์">คณะเศรษฐศาสตร์</option>
                  </optgroup>
                </select>
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label className={styles.label}>อีเมล :</label>
                <input 
                  type="email" 
                  placeholder="example@rsu.ac.th"
                  className={styles.input}
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
                  placeholder="รหัส 7 หลัก"
                  className={styles.input}
                  pattern="[0-9]{7}"
                  maxLength={7}
                  required
                  onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                <span className={styles.helperText}>กรอกตัวเลข 7 หลัก</span>
              </div>

              {/* Status */}
              <div className={styles.formGroup}>
                <label className={styles.label}>สถานะ :</label>
                <select className={styles.select} required>
                  <option value="">เลือกสถานะ</option>
                  <option value="student">นักศึกษา</option>
                  <option value="staff">บุคลากร</option>
                  <option value="faculty">อาจารย์</option>
                </select>
              </div>

              {/* Gender */}
              <div className={styles.formGroup}>
                <label className={styles.label}>เพศ :</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="gender" value="male" />
                    <span>ชาย</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="gender" value="female" />
                    <span>หญิง</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="gender" value="other" />
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