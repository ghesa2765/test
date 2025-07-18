// contexts/AuthContext.tsx
interface User {
  id: string
  name: string
  role: 'student' | 'staff' | 'faculty'
  faculty: string
  isLoggedIn: boolean
}

interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)