import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Factory } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Internships - JobsDoor360',
  description: 'Find internship opportunities to kickstart your career.',
};

export default function InternshipsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Factory className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Internships</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Gain valuable hands-on experience.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Browse and apply for internships from top companies in various fields. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
