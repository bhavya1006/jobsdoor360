import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Briefcase, Building, UserCheck } from "lucide-react";
import type { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Career Options - JobsDoor360',
  description: 'Explore job options, business opportunities, and analyze your profile to find the perfect career path.',
};

const options = [
    {
        icon: Briefcase,
        title: "Job Options",
        description: "Browse thousands of job listings from top companies. Find your next role, from entry-level to executive positions.",
        href: "/career-options/job-options"
    },
    {
        icon: Building,
        title: "Business Options",
        description: "Explore opportunities for entrepreneurship. Get insights on starting your own venture and find business ideas.",
        href: "/career-options/business-options"
    },
    {
        icon: UserCheck,
        title: "Profile Analyzer",
        description: "Get a detailed analysis of your professional profile. Understand your strengths and areas for improvement.",
        href: "/career-options/profile-analyzer"
    }
];

export default function CareerOptionsPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">Explore Your Career Options</h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Whether you're looking for a new job, starting a business, or analyzing your career path, we have the resources to help you succeed.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
        {options.map(option => (
            <Link key={option.title} href={option.href} className="block">
                <Card className="h-full hover:border-primary hover:shadow-lg transition-all duration-300 flex flex-col">
                    <CardHeader className="flex-row items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <option.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-2xl">{option.title}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <CardDescription>{option.description}</CardDescription>
                    </CardContent>
                    <CardContent>
                         <div className="flex items-center text-primary font-semibold">
                            Explore More <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  );
}
