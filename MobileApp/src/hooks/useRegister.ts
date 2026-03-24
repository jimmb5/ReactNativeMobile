import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../services/firebase';

function getErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "Sähköpostiosoite on jo käytössä.";
    case "auth/invalid-email":
      return "Sähköpostiosoite on virheellinen.";
    case "auth/weak-password":
      return "Salasana on liian lyhyt (väh. 6 merkkiä).";
    default:
      return "Rekisteröinti epäonnistui. Yritä uudelleen.";
  }
}

export function useRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function register(): Promise<boolean> {
    if (!username || !email || !password) {
      setError("Täytä kaikki kentät.");
      return false;
    }

    try {
      setLoading(true);
      setError("");
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: username });

      /*
      await auth.currentUser?.reload();

      const currentUser = auth.currentUser;

      if (currentUser !== null) {
        currentUser.providerData.forEach((profile) => {
          console.log("Sign-in provider: " + profile.providerId);
          console.log("  Provider-specific UID: " + profile.uid);
          console.log("  Name: " + profile.displayName);
          console.log("  Email: " + profile.email);
          console.log("  Photo URL: " + profile.photoURL);
        });
      }
      */

      return true;
    } catch (e: any) {
      setError(getErrorMessage(e.code));
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    username, setUsername,
    email, setEmail,
    password, setPassword,
    loading,
    error,
    register,
  };
}
