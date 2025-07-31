import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LineChart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Digital Marketing - JobsDoor360',
  description: 'Promote your brand and grow your business online.',
};

export default function DigitalMarketingPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <LineChart className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Digital Marketing</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Comprehensive digital marketing strategies to reach your audience.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Our services include social media marketing, PPC campaigns, email marketing, and content strategy. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
