import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';

export const metadata: Metadata = {
  title: 'Edit Job Profile - JobsDoor360',
  description: 'Update your job preferences and professional information.',
};

export default function EditJobProfilePage() {
  return (
    <div className="bg-muted/40 min-h-[calc(100vh-8rem)] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
            <Button asChild variant="ghost" className="mb-4">
                <Link href="/account">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Account
                </Link>
            </Button>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Edit Job Profile</CardTitle>
                    <CardDescription>Tailor your job search by keeping this section updated.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="job-title">Target Job Title</Label>
                        <Input id="job-title" placeholder="e.g., Senior Frontend Developer" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="experience">Years of Experience</Label>
                        <Select>
                            <SelectTrigger id="experience">
                                <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0-1">0-1 years</SelectItem>
                                <SelectItem value="1-3">1-3 years</SelectItem>
                                <SelectItem value="3-5">3-5 years</SelectItem>
                                <SelectItem value="5-10">5-10 years</SelectItem>
                                <SelectItem value="10+">10+ years</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="skills">Key Skills</Label>
                        <Textarea id="skills" placeholder="Enter skills separated by commas (e.g., React, TypeScript, Node.js)" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="salary">Expected Salary (Annual)</Label>
                        <Input id="salary" type="number" placeholder="e.g., 120000" />
                    </div>
                    <div className="flex justify-end">
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}