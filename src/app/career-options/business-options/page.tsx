import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Business Options - JobsDoor360',
  description: 'Explore business opportunities and get inspired to start your own venture.',
};

export default function BusinessOptionsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Lightbulb className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Business Opportunities</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Your journey to entrepreneurship starts here.
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <p>
                Discover innovative business ideas, learn about franchising opportunities, and get the resources you need to launch your own company. This section is currently under development.
              </p>
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Explore Business Plans</Button>
          </CardContent>
      </Card>
    </div>
  );
}
