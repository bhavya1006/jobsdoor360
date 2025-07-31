import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Interview Assistance - JobsDoor360',
  description: 'Get help preparing for your job interviews.',
};

export default function InterviewAssistancePage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Users className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Interview Assistance</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Ace your next interview with our expert guidance.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                We provide comprehensive interview preparation services, including mock interviews and feedback sessions. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
