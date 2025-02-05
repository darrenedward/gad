import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchSession = async () => {
      console.log('Fetching session...');
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        return;
      }
      console.log('Session data:', data);
      if (data.session) {
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          return;
        }
        console.log('User data:', userData);
        setUser({ ...data.session.user, role: userData?.role || 'user', isActive: userData?.isActive !== undefined ? userData.isActive : false });
      }
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session);
        if (session) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
            return;
          }
          console.log('User data:', userData);
          setUser({ ...session.user, role: userData?.role || 'user', isActive: userData?.isActive !== undefined ? userData.isActive : false });
        } else {
          setUser(null);
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const login = async (email, password) => {
    console.log('Attempting to login with:', { email, password })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        console.error('Authentication error:', error)
        throw error
      }
      console.log('Authentication data:', data)
      if (!data?.user?.id) {
        throw new Error('User ID not found in authentication data')
      }
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      if (userError) {
        console.error('User data fetch error:', userError)
        throw userError
      }
      console.log('User data:', userData)
      return { ...data.user, role: userData?.role || 'user', isActive: userData?.isActive !== undefined ? userData.isActive : false }
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    }
  }

  const register = async (email, password, role = 'user') => {
    console.log('Attempting to register with:', { email, password, role })
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.error('Registration error:', error)
      throw error
    }
    console.log('Registration data:', data)
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, email, role, isActive: false }])
    
    if (insertError) {
      console.error('Insert error:', insertError)
      throw insertError
    }
    console.log('User registered successfully')
    return data.user
  }

  const logout = async () => {
    console.log('Attempting to logout')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout error:', error)
      throw error
    }
    console.log('User logged out successfully')
  }

  return { user, login, register, logout }
}
