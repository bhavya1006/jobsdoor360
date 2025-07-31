import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hire Using Our Portal - JobsDoor360',
  description: 'Use our portal to post jobs and find candidates.',
};

export default function HirePortalPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <LogIn className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Hire Using Our Portal</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Streamline your hiring process with our user-friendly portal.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Post job openings, manage applications, and connect with talent all in one place. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
