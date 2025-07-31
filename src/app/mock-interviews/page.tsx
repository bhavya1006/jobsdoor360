import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Mic } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mock Interviews - JobsDoor360',
  description: 'Practice interviews with industry experts.',
};

export default function MockInterviewsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Mic className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Mock Interviews</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Practice makes perfect. Prepare for your real interview.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Our mock interview sessions simulate real job interviews to help you prepare and build confidence. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
