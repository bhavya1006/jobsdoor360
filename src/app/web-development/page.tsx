import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Code } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Web Development - JobsDoor360',
  description: 'Build powerful and scalable web applications.',
};

export default function WebDevelopmentPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Code className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Web Development</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Custom web solutions tailored to your business needs.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Our team of developers builds high-performance websites and applications using the latest technologies. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
