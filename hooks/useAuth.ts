// hooks/useAuth.ts
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  // localStorage logic with SSR safety
}