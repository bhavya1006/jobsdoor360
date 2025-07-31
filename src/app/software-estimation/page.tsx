import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Software Estimation or Quotation - JobsDoor360',
  description: 'Get accurate estimations and quotations for your software projects.',
};

export default function SoftwareEstimationPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Calculator className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Software Estimation or Quotation</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Plan your software development budget with confidence.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Our experts provide detailed project estimations and quotations to help you make informed decisions. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
