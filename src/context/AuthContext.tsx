import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { storage } from '../services/storage';
import { ClientProfile } from '../types/nailStudio';

export type UserRole = 'staff' | 'client' | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  clientProfile: ClientProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  signUpClient: (data: { email: string; password: string; name: string; phone: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Determine user role and load profile
  const syncUserState = async (currentUser: User | null) => {
    if (!currentUser) {
      setUser(null);
      setRole(null);
      setClientProfile(null);
      return;
    }

    setUser(currentUser);
    const metaRole = (currentUser.user_metadata?.role as UserRole) || null;
    
    // If user email is admin@belcalisnails.com.ar or role is staff
    const isStaff = metaRole === 'staff' || currentUser.email?.includes('admin@belcalisnails');
    const computedRole: UserRole = isStaff ? 'staff' : 'client';
    setRole(computedRole);

    if (computedRole === 'client') {
      // Find client profile in storage or Supabase
      const allClients = storage.getClients();
      let profile = allClients.find(c => c.id === currentUser.id || c.email?.toLowerCase() === currentUser.email?.toLowerCase());

      if (!profile) {
        // Fetch from Supabase
        const { data } = await supabase
          .from('client_profiles')
          .select('*')
          .or(`id.eq.${currentUser.id},email.eq.${currentUser.email}`)
          .maybeSingle();

        if (data) {
          profile = {
            id: data.id,
            name: data.name,
            phone: data.phone,
            email: data.email,
            avatar: data.avatar || '',
            nailPlateCondition: data.nail_plate_condition || 'healthy',
            allergiesHema: data.allergies_hema || false,
            lampHeatSensitivity: data.lamp_heat_sensitivity || 'low',
            favoriteColors: data.favorite_colors || [],
            technicianNotes: data.technician_notes || '',
            pointsBalance: data.points_balance || 200,
            tier: data.tier || 'Silver',
            referralCode: data.referral_code || 'BELCALIS',
            totalVisits: data.total_visits || 0,
            lastVisitDate: data.last_visit_date || new Date().toISOString().split('T')[0],
            setsHistory: []
          };
          storage.createClient(profile);
        }
      }

      if (profile) {
        setClientProfile(profile);
        storage.setCurrentClientId(profile.id);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return;
      setSession(initialSession);
      if (initialSession?.user) {
        syncUserState(initialSession.user).finally(() => {
          if (mounted) setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession?.user) {
        await syncUserState(newSession.user);
      } else {
        setUser(null);
        setRole(null);
        setClientProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        await syncUserState(data.user);
        const metaRole = (data.user.user_metadata?.role as UserRole) || null;
        const isStaff = metaRole === 'staff' || data.user.email?.includes('admin@belcalisnails');
        const roleDetermined: UserRole = isStaff ? 'staff' : 'client';
        setIsLoading(false);
        return { success: true, role: roleDetermined };
      }

      setIsLoading(false);
      return { success: false, error: 'No se pudo obtener el usuario.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Error al iniciar sesión' };
    }
  };

  const signUpClient = async ({ email, password, name, phone }: { email: string; password: string; name: string; phone: string }) => {
    setIsLoading(true);
    try {
      // 1. Call auto-confirm signup API
      const res = await fetch('/api/auth-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone, role: 'client' })
      });

      const result = await res.json();
      if (!res.ok) {
        setIsLoading(false);
        return { success: false, error: result.error || 'Error al registrarse' };
      }

      // 2. Sign in immediately to establish session
      const loginRes = await login(email, password);
      setIsLoading(false);
      return loginRes;
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Error de conexión' };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      storage.setCurrentClientId('');
      setUser(null);
      setSession(null);
      setRole(null);
      setClientProfile(null);
    } catch (err) {
      console.warn('Error during logout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await syncUserState(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        clientProfile,
        isLoading,
        login,
        signUpClient,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
