import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FolderGit2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Major Projects - JobsDoor360',
  description: 'Get help with your academic and professional projects.',
};

export default function MajorProjectsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl text-center shadow-lg">
          <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                 <FolderGit2 className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">Major Projects</CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-2">
                Support for your project development needs.
              </CardDescription>
          </CardHeader>
          <CardContent>
              <p>
                We offer guidance and resources for students and professionals working on major projects. This page is currently under construction.
              </p>
          </CardContent>
      </Card>
    </div>
  );
}
