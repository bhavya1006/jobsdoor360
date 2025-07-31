import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Terminal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Software Development - JobsDoor360',
  description: 'Custom software solutions to drive your business forward.',
};

export default function SoftwareDevelopmentPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Terminal className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Software Development</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                From concept to code, we build software that performs.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                We specialize in developing robust, scalable, and secure software applications for various platforms. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
