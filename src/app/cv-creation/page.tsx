import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CV Creation - JobsDoor360',
  description: 'Create a professional CV that stands out.',
};

export default function CVCreationPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <FileText className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">CV Creation</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Craft a CV that gets you noticed.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Our tools and experts help you create a compelling CV tailored to your target jobs. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
