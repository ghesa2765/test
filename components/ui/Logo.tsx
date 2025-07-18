// components/ui/Logo.tsx
import Image from 'next/image'
import styles from '@/styles/components/logo.module.css'

interface LogoProps {
  size?: number
  collapsed?: boolean
  variant?: 'full' | 'icon-only'
  className?: string
}

export default function Logo({ 
  size = 64, 
  collapsed = false, 
  variant = 'full',
  className = ''
}: LogoProps) {
  
  if (variant === 'icon-only' || collapsed) {
    return (
      <div className={`${styles.logoIcon} ${className}`} style={{ width: size, height: size }}>
        <Image
          src="/logo.png"
          alt="RSU Medical Clinic Logo"
          width={size}
          height={size}
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
    )
  }

  return (
    <div className={`${styles.logoContainer} ${className}`}>
      <div className={styles.logoIcon} style={{ width: size, height: size }}>
        <Image
          src="/logo.png"
          alt="RSU Medical Clinic Logo"
          width={size}
          height={size}
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>
      {!collapsed && (
        <div className={styles.logoTextContainer}>
          <div className={styles.logoTextThai}>คลินิกเวชกรรมมหาวิทยาลัยรังสิต</div>
          <div className={styles.logoTextEn}>RSU MEDICAL CLINIC</div>
        </div>
      )}
    </div>
  )
}