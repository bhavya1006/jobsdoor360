import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Apply Now - JobsDoor360',
  description: 'Apply for your dream job through JobsDoor360.',
};

export default function ApplyPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <FileText className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Apply Now</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Ready to take the next step in your career?
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <p>
                Applications are handled on the individual job listing pages. Browse our available positions to find the right fit for you and submit your application directly.
              </p>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href="/career-options/job-options">
                    Browse Job Listings
                  </Link>
              </Button>
          </CardContent>
      </Card>
    </div>
  );
}
