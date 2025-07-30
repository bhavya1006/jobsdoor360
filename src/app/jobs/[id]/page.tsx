import { jobs, Job } from '@/data/jobs';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = jobs.find((j) => j.id === params.id);
  
  if (!job) {
    return {
      title: 'Job Not Found - JobsDoor360'
    }
  }

  return {
    title: `${job.title} at ${job.company} - JobsDoor360`,
    description: job.description,
  }
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = jobs.find((j) => j.id === params.id);

  if (!job) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-8">
            <Link href="/career-options/job-options">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Jobs
            </Link>
        </Button>
        <div className="bg-card p-8 rounded-lg shadow-lg border">
            <h1 className="font-headline text-4xl font-bold text-primary">{job.title}</h1>
            <div className="flex items-center space-x-6 text-muted-foreground mt-4 text-lg">
                <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    <span>{job.company}</span>
                </div>
                <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{job.location}</span>
                </div>
            </div>
            <div className="prose prose-lg max-w-none mt-8 text-foreground/90">
                <h2 className="font-headline text-2xl font-semibold border-b pb-2 mb-4">Job Description</h2>
                <p>{job.fullDescription}</p>
            </div>
            <div className="mt-12 text-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">Apply for this Position</Button>
            </div>
        </div>
    </div>
  );
}

export async function generateStaticParams() {
  return jobs.map((job) => ({
    id: job.id,
  }));
}
