import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase';

type AuthContextType = {
  user: User | null;
  isGuest: boolean;
  loading: boolean;
  continueAsGuest: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isGuest: false,
  loading: true,
  continueAsGuest: () => {},
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

  return (
    <AuthContext.Provider value={{ user, isGuest, loading, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
