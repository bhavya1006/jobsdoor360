import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Profile Analyzer - JobsDoor360',
  description: 'Analyze your profile to get insights into your career path.',
};

export default function ProfileAnalyzerPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <UserCheck className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Profile Analyzer</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Get data-driven insights to boost your career.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Our Profile Analyzer tool helps you identify your strengths, weaknesses, and potential career paths based on your skills and experience. Upload your resume to get started. Feature coming soon!
              </p>
          </CardContent>
          <CardFooter className="justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled>Analyze My Profile</Button>
          </CardFooter>
      </Card>
    </div>
  );
}
