import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Marketing Classes - JobsDoor360',
  description: 'Learn the fundamentals of modern marketing.',
};

export default function MarketingClassesPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Megaphone className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Marketing Classes</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Become a marketing expert with our comprehensive classes.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                We offer courses on digital marketing, SEO, content strategy, and more to boost your marketing skills. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
