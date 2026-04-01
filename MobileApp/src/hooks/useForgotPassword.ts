import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';

function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Sähköpostiosoite on virheellinen.';
    case 'auth/user-not-found':
      return 'Sähköpostiosoite on virheellinen.';
    case 'auth/too-many-requests':
      return 'Liian monta yritystä. Yritä hetken kuluttua uudelleen.';
    default:
      return 'Salasanan palautus epäonnistui. Yritä uudelleen.';
  }
}

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function sendResetEmail(): Promise<void> {
    if (!email) {
      setError("Syötä sähköpostiosoite.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (e: any) {
      setError(getErrorMessage(e.code));
    } finally {
      setLoading(false);
    }
  }

  function reset(): void {
    setEmail('');
    setError('');
    setSuccess(false);
  }

  return {
    email,
    setEmail,
    loading,
    error,
    success,
    sendResetEmail,
    reset,
  };
}
