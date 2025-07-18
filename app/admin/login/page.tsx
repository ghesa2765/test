'use client';

import styles from './login.module.css';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ตรวจสอบ admin credentials
    if (adminId === 'admin' && password === 'Admin123456') {
      setShowSuccess(true);
      setShowError(false);
      
      // Set session cookie if remember me is checked
      if (rememberMe) {
        document.cookie = 'admin_session=true; path=/; max-age=604800'; // 7 days
      } else {
        document.cookie = 'admin_session=true; path=/'; // Session only
      }
      
      // รอ 2 วินาที แล้ว redirect
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } else {
      setShowError(true);
      setShowSuccess(false);
      setErrorMessage('รหัสผู้ดูแลระบบ หรือรหัสผ่านไม่ถูกต้อง');
      
      // ซ่อน error message หลัง 3 วินาที
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
    
    setIsLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left Side - Branding */}
        <div className={styles.leftSection}>
          <div className={styles.brandingCard}>
            <div className={styles.logoSection}>
              <img 
                src="/logo.png" 
                alt="RSU Logo" 
                className={styles.logo}
              />
              <div className={styles.brandText}>
                <h1 className={styles.clinicText}>คลินิกเวชกรรมมหาวิทยาลัยรังสิต</h1>
                <p className={styles.clinicTextEn}>RSU MEDICAL CLINIC</p>
                <div className={styles.divider}></div>
                <h2 className={styles.adminTitle}>ระบบจัดการแอดมิน</h2>
                <p className={styles.adminSubtitle}>Admin Management System</p>
              </div>
            </div>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <Shield size={24} />
                </div>
                <div className={styles.featureText}>
                  <h3>ระบบความปลอดภัยสูง</h3>
                  <p>การเข้าถึงที่ได้รับการคุมป้องอย่างเข้มงวด</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <User size={24} />
                </div>
                <div className={styles.featureText}>
                  <h3>จัดการผู้ใช้งาน</h3>
                  <p>ควบคุมและจัดการบัญชีผู้ใช้งานทั้งหมด</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  <Lock size={24} />
                </div>
                <div className={styles.featureText}>
                  <h3>การควบคุมระบบ</h3>
                  <p>เข้าถึงและจัดการระบบทั้งหมด</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={styles.rightSection}>
          <div className={styles.loginCard}>
            <div className={styles.loginHeader}>
              <div className={styles.adminIcon}>
                <Shield size={32} />
              </div>
              <h2 className={styles.loginTitle}>เข้าสู่ระบบแอดมิน</h2>
              <p className={styles.loginSubtitle}>กรุณาเข้าสู่ระบบด้วยบัญชีผู้ดูแลระบบ</p>
            </div>

            <form onSubmit={handleLogin} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>รหัสผู้ดูแลระบบ</label>
                <div className={styles.inputWrapper}>
                  <User className={styles.inputIcon} size={20} />
                  <input 
                    type="text" 
                    placeholder="admin"
                    className={styles.input}
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>รหัสผ่าน</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} size={20} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="รหัสผ่าน"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className={styles.formOptions}>
                <label className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                  />
                  <span className={styles.checkmark}></span>
                  จดจำการเข้าสู่ระบบ
                </label>
                <Link href="/admin/forgot-password" className={styles.forgotLink}>
                  ลืมรหัสผ่าน?
                </Link>
              </div>

              <button 
                type="submit" 
                className={`${styles.loginButton} ${isLoading ? styles.loading : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className={styles.spinner}></div>
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  <>
                    <Shield size={20} />
                    เข้าสู่ระบบ
                  </>
                )}
              </button>
            </form>

            <div className={styles.loginFooter}>
              <div className={styles.demoCredentials}>
                <h4>ข้อมูลทดสอบ:</h4>
                <p><strong>รหัสผู้ดูแล:</strong> admin</p>
                <p><strong>รหัสผ่าน:</strong> Admin123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Success Popup */}
      {showSuccess && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <div className={styles.successIcon}>
              <Shield size={48} />
            </div>
            <h3 className={styles.popupTitle}>เข้าสู่ระบบสำเร็จ!</h3>
            <p className={styles.popupText}>ยินดีต้อนรับสู่ระบบจัดการแอดมิน</p>
            <p className={styles.popupSubtext}>กำลังนำคุณไปยังหน้าควบคุม...</p>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && (
        <div className={styles.popupOverlay}>
          <div className={`${styles.popup} ${styles.errorPopup}`}>
            <div className={styles.errorIcon}>
              <AlertCircle size={48} />
            </div>
            <h3 className={styles.popupTitle}>เข้าสู่ระบบไม่สำเร็จ</h3>
            <p className={styles.popupText}>{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}