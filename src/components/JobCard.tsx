import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Job } from '@/data/jobs';
import { MapPin, Building } from 'lucide-react';

type JobCardProps = {
  job: Job;
};

export default function JobCard({ job }: JobCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-primary">{job.title}</CardTitle>
        <CardDescription className="pt-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Building className="h-4 w-4 mr-2" />
            {job.company}
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4 mr-2" />
            {job.location}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-foreground/80">{job.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/jobs/${job.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
