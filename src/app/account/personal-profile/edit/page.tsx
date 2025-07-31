import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Edit Personal Profile - JobsDoor360',
  description: 'Update your personal information.',
};

export default function EditPersonalProfilePage() {
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
                    <CardTitle className="font-headline text-2xl">Edit Personal Profile</CardTitle>
                    <CardDescription>Keep your personal details up to date.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" placeholder="Doe" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="john.doe@example.com" disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 234 567 890" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="San Francisco, CA" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Short Bio</Label>
                        <Textarea id="bio" placeholder="Tell us a little bit about yourself." />
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