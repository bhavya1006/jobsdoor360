import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Share2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Outsource Interns - JobsDoor360',
  description: 'Find and manage interns for your projects.',
};

export default function OutsourceInternsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Share2 className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Outsource Interns</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Access a pool of talented interns for your business needs.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                We connect businesses with skilled interns for short-term projects and long-term roles. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
