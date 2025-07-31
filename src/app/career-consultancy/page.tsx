import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Waypoints } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Career Consultancy - JobsDoor360',
  description: 'Get expert advice on your career path.',
};

export default function CareerConsultancyPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Waypoints className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Career Consultancy</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Navigate your career with confidence.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Our experienced career consultants are here to provide personalized guidance to help you achieve your professional goals. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
