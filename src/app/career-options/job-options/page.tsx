import JobCard from '@/components/JobCard';
import { jobs, Job } from '@/data/jobs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Options - JobsDoor360',
  description: 'Browse the latest job openings from top companies.',
};

export default function JobOptionsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">Latest Job Openings</h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Find your next career move from our curated list of opportunities.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {jobs.map((job: Job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
