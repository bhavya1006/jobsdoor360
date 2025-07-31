import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Placement Assistance - JobsDoor360',
  description: 'Get assistance with job placements.',
};

export default function PlacementAssistancePage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Briefcase className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Placement Assistance</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Connecting you with the right opportunities.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Our placement assistance program is designed to help students and professionals find the best job opportunities. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
