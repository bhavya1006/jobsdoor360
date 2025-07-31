import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, MapPin, Clock, CircleHelp, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Jobs Applied - JobsDoor360',
  description: 'Track the status of your job applications.',
};

const appliedJobs = [
    { id: '1', title: 'Frontend Developer', company: 'Innovatech', location: 'Remote', status: 'Applied', date: '2024-07-25' },
    { id: '2', title: 'UX/UI Designer', company: 'Pixel Perfect Inc.', location: 'Remote', status: 'In Review', date: '2024-07-22' },
    { id: '3', title: 'Product Manager', company: 'Creative Minds', location: 'San Francisco, CA', status: 'Interviewing', date: '2024-07-20' },
    { id: '4', title: 'Data Scientist', company: 'Numerix', location: 'Boston, MA', status: 'Offer Received', date: '2024-07-18' },
    { id: '5', title: 'Backend Developer', company: 'Data Solutions', location: 'New York, NY', status: 'Not Selected', date: '2024-07-15' },
];

const statusStyles: { [key: string]: string } = {
    'Applied': 'bg-blue-100 text-blue-800',
    'In Review': 'bg-yellow-100 text-yellow-800',
    'Interviewing': 'bg-purple-100 text-purple-800',
    'Offer Received': 'bg-green-100 text-green-800',
    'Not Selected': 'bg-red-100 text-red-800',
}

const statusIcons: { [key: string]: React.ElementType } = {
    'Applied': Clock,
    'In Review': CircleHelp,
    'Offer Received': CheckCircle,
    'Not Selected': XCircle,
    'Interviewing': CheckCircle, // Re-using, could be different
}


export default function JobsAppliedPage() {
  return (
    <div className="bg-muted/40 min-h-[calc(100vh-8rem)] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Button asChild variant="ghost" className="mb-4">
                <Link href="/account">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Account
                </Link>
            </Button>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Jobs Applied</CardTitle>
                    <CardDescription>Keep track of your application history and status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {appliedJobs.length > 0 ? (
                        appliedJobs.map(job => {
                            const Icon = statusIcons[job.status] || Clock;
                            return (
                                <div key={job.id} className="border p-4 rounded-lg bg-background hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-headline text-xl text-primary">{job.title}</h3>
                                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                <Building className="h-4 w-4 mr-2" /> {job.company}
                                            </div>
                                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                <MapPin className="h-4 w-4 mr-2" /> {job.location}
                                            </div>
                                        </div>
                                        <Badge className={`capitalize ${statusStyles[job.status]}`}>
                                            <Icon className="h-3 w-3 mr-1.5" />
                                            {job.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                        <p className="text-sm text-muted-foreground">Applied on: {job.date}</p>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/jobs/${job.id}`}>View Job</Link>
                                        </Button>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center py-16 border-dashed border-2 rounded-lg">
                            <h3 className="text-xl font-semibold">No Applications Found</h3>
                            <p className="text-muted-foreground mt-2">Start applying to see your history here.</p>
                            <Button asChild className="mt-4">
                                <Link href="/career-options/job-options">Find Jobs</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}