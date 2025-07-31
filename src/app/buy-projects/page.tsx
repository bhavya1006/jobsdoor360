import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Buy Projects - JobsDoor360',
  description: 'Purchase pre-made projects for your needs.',
};

export default function BuyProjectsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <ShoppingCart className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Buy Projects</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Ready-to-use projects for learning and demonstration.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                Explore our marketplace of projects to find one that suits your academic or professional needs. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
