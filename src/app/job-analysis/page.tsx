import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Job Analysis - JobsDoor360',
  description: 'Analyze job market trends, salary expectations, and more.',
};

export default function JobAnalysisPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <BarChart2 className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Job Analysis</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Make informed career decisions with our data-driven analysis tools.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Get insights into salary benchmarks, required skills for specific roles, and industry growth trends. Our Job Analysis tools are currently in development and will be available soon.
              </p>
          </CardContent>
          <CardFooter className="justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled>Start Analysis</Button>
          </CardFooter>
      </Card>
    </div>
  );
}
