import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Languages } from 'lucide-react';

export const metadata: Metadata = {
  title: 'English Speaking - JobsDoor360',
  description: 'Improve your English communication skills.',
};

export default function EnglishSpeakingPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Languages className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">English Speaking</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Enhance your professional communication.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Join our English speaking courses to build confidence and fluency for the workplace. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
