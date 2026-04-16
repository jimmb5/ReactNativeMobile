import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../../services/firebase';

type AuthContextType = {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  continueAsGuest: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isGuest: false,
  loading: true,
  continueAsGuest: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) setIsGuest(false);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  function continueAsGuest() {
    setIsGuest(true);
  }

  async function signOut() {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ei mitään 
    }
    setIsGuest(false);
  }

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, continueAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
