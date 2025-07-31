import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SEO Services - JobsDoor360',
  description: 'Improve your website\'s visibility on search engines.',
};

export default function SEOServicesPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <Search className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">SEO Services</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Drive organic traffic to your website with our SEO expertise.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                We offer a full range of SEO services, including keyword research, on-page optimization, and link building. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
