'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAppDispatch } from '../store/hooks';
import { setUser } from '../store/authSlice';
import Cookies from 'js-cookie';

export default function AuthStateListener({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const { uid, email, displayName, photoURL } = user;
        dispatch(setUser({ uid, email, displayName, photoURL }));
        
        // Set auth session cookie for middleware
        Cookies.set('authSession', 'true', { expires: 7 }); // 7 days expiry
      } else {
        // User is signed out
        dispatch(setUser(null));
        Cookies.remove('authSession');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
} 