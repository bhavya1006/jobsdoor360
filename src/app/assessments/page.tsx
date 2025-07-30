import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Assessments - JobsDoor360',
  description: 'Take our career assessments to find your perfect professional path.',
};

export default function AssessmentsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <ClipboardCheck className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Career Assessments</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Discover your strengths and find the perfect career fit.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Our comprehensive assessments are designed to help you understand your skills, personality, and interests. Get personalized career recommendations based on your results.
              </p>
          </CardContent>
          <CardFooter className="justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Start Assessment</Button>
          </CardFooter>
      </Card>
    </div>
  );
}
