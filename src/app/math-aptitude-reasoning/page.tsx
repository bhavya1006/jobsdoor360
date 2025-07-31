import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Math, Aptitude & Reasoning - JobsDoor360',
  description: 'Sharpen your analytical and problem-solving skills.',
};

export default function MathAptitudeReasoningPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <BrainCircuit className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Math, Aptitude & Reasoning</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Build a strong foundation for competitive exams and interviews.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Our courses cover essential topics in mathematics, aptitude, and logical reasoning to help you excel. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
