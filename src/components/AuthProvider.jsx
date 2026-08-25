import { createContext, useContext, useEffect, useState } from 'react'
import { hasSupabaseConfig, supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    if (!supabase || !hasSupabaseConfig()) {
      setUser(null)
      return undefined
    }

    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setUser(data.session?.user ?? null)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function signIn(email, password) {
    if (!supabase) {
      return { error: new Error('Falta configurar la conexión con Supabase.') }
    }

    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    if (!supabase) return { error: null }
    return supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider.')
  }

  return context
}
