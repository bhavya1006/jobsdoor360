"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UserCircle, LogOut } from 'lucide-react';

export default function AccountPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <UserCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <CardTitle className="font-headline text-3xl">Welcome to Your Account</CardTitle>
                    <CardDescription>
                        This is your personal space. More features coming soon!
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                    <p className="text-lg">
                        Logged in as: <span className="font-semibold text-primary">{user?.email}</span>
                    </p>
                    <Button onClick={logout} variant="destructive" size="lg">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
