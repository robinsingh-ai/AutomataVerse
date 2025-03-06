'use client';

import Login from '../components/login';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '../store/hooks';

// Metadata is removed as it cannot be exported from a client component

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  
  // If already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);
  
  return <Login />;
} 