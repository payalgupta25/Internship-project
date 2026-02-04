'use client';

import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background via-background to-primary/5 px-4">
      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <div className="text-6xl mb-4">📋</div>
          <h1 className="text-5xl md:text-6xl font-bold text-balance">
            Stay Organized & Boost Productivity
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            A simple yet powerful task management application designed to help you organize your work and achieve your goals.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/login" className="flex-1 sm:flex-none">
            <Button size="lg" className="w-full sm:w-auto">
              Login
            </Button>
          </Link>
          <Link href="/register" className="flex-1 sm:flex-none">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              Sign Up Free
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4 pt-12 text-sm">
          <div className="space-y-2 p-4 rounded-lg bg-card border border-border">
            <div className="text-2xl">✓</div>
            <h3 className="font-semibold">Simple & Fast</h3>
            <p className="text-muted-foreground">Create and manage tasks in seconds</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-card border border-border">
            <div className="text-2xl">🔐</div>
            <h3 className="font-semibold">Secure</h3>
            <p className="text-muted-foreground">Your data is protected and private</p>
          </div>
          <div className="space-y-2 p-4 rounded-lg bg-card border border-border">
            <div className="text-2xl">👥</div>
            <h3 className="font-semibold">Admin Controls</h3>
            <p className="text-muted-foreground">Full user management for admins</p>
          </div>
        </div>
      </div>
    </div>
  );
}
