import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Handshake } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hire With Us - JobsDoor360',
  description: 'Find the best talent for your company.',
};

export default function HireWithUsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Handshake className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Hire With Us</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Partner with us to build your dream team.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                We provide tailored recruitment solutions to help you find qualified candidates efficiently. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
