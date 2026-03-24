import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';

function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Sähköpostiosoite on virheellinen.';
    case 'auth/invalid-credential':
      return 'Sähköposti tai salasana on väärin.';
    case 'auth/too-many-requests':
      return 'Liian monta yritystä. Yritä hetken kuluttua uudelleen.';
    default:
      return 'Kirjautuminen epäonnistui. Yritä uudelleen.';
  }
}

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(): Promise<void> {
    if (!email || !password) {
      setError("Täytä kaikki kentät.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      setError(getErrorMessage(e.code));
    } finally {
      setLoading(false);
    }
  }

  return {
    email, setEmail,
    password, setPassword,
    loading,
    error,
    login,
  };
}
