// components/dashboard/SearchBox.tsx
'use client'

import { Search } from 'lucide-react'
import styles from '@/styles/components/search-box.module.css'

interface SearchBoxProps {
  placeholder?: string
  value?: string
  onSearch?: (term: string) => void
}

export default function SearchBox({ 
  placeholder = "ค้นหา...", 
  value = "",
  onSearch 
}: SearchBoxProps) {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchBox}>
        <Search size={20} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder={placeholder} 
          className={styles.searchInput}
          value={value}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
    </div>
  )
}