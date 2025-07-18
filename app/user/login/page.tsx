'use client';

import styles from './login.module.css';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // ตรวจสอบ username และ password ที่กำหนด
    if (studentId === '6606276' && password === 'Aa1234567') {
      setShowSuccess(true);
      setShowError(false);
      
      // รอ 2 วินาที แล้ว redirect ไปหน้า dashboard
      setTimeout(() => {
        router.push('/user/dashboard');
      }, 2000);
    } else {
      setShowError(true);
      setShowSuccess(false);
      
      // ซ่อน error message หลัง 3 วินาที
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  };

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <img 
            src="/logo.png" 
            alt="RSU Logo" 
            className={styles.logo}
          />
          <p className={styles.clinicText}>คลินิกเวชกรรมมหาวิทยาลัยรังสิต</p>
          <p className={styles.clinicTextEn}>RSU MEDICAL CLINIC</p>
        </div>

        {/* Language Selector */}
        <div className={styles.langSelector}>
          <button className={`${styles.langBtn} ${styles.langBtnActive}`}>
            <span className={styles.checkIcon}>✓</span>
            ภาษาไทย
          </button>
          <button className={styles.langBtn}>
            <span className={styles.checkIcon}>✓</span>
            English
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <input 
              type="text" 
              placeholder="รหัสนักศึกษา/บุคลากร"
              className={styles.input}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              pattern="[0-9]{7}"
              maxLength={7}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <input 
              type="password" 
              placeholder="รหัสผ่าน"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            เข้าสู่ระบบ
          </button>

          <Link href="/user/login/forgot" className={styles.forgotPassword}>
            ลืมรหัสผ่าน?
          </Link>
        </form>

        {/* Back Button */}
        <Link href="/user" className={styles.backLink}>
          <span className={styles.backIcon}>‹</span>
          ย้อนกลับ
        </Link>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <div className={styles.successIcon}>✓</div>
            <h3 className={styles.popupTitle}>เข้าสู่ระบบสำเร็จ!</h3>
            <p className={styles.popupText}>กำลังนำคุณไปยังหน้าหลัก...</p>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && (
        <div className={styles.popupOverlay}>
          <div className={`${styles.popup} ${styles.errorPopup}`}>
            <div className={styles.errorIcon}>✕</div>
            <h3 className={styles.popupTitle}>เข้าสู่ระบบไม่สำเร็จ</h3>
            <p className={styles.popupText}>รหัสนักศึกษา/บุคลากร หรือรหัสผ่านไม่ถูกต้อง</p>
          </div>
        </div>
      )}
    </div>
  );
}