import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Update CV - JobsDoor360',
  description: 'Upload your latest CV.',
};

export default function UpdateCvPage() {
  return (
    <div className="bg-muted/40 min-h-[calc(100vh-8rem)] py-12 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
             <Button asChild variant="ghost" className="mb-4 -ml-4">
                <Link href="/account">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Account
                </Link>
            </Button>
            <Card className="shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                        <UploadCloud className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Update Your CV</CardTitle>
                    <CardDescription>A fresh CV attracts more opportunities. Upload a new one here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="cv-file">CV/Resume File</Label>
                        <Input id="cv-file" type="file" className="h-auto p-2" />
                        <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX. Max file size: 5MB.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button size="lg">Upload CV</Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}