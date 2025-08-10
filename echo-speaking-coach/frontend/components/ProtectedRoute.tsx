'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      // Save the current path to redirect after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Redirecting to login...</div>
      </div>
    );
  }

  return <>{children}</>;
}