'use client';

import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-lg font-sans hover:opacity-80 transition">
            📋 TaskManagerPro
          </Link>

          <div className="flex items-center gap-4">
            {!isLoading && user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {((user?.name && user.name.charAt(0)) || '?').toString().toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">
                    {user?.name || 'User'}
                  </span>
                </div>
                {user.role === 'admin' && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Logout
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
