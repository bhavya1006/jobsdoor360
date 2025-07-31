import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, FileText, Share2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'View CV - JobsDoor360',
  description: 'View your currently uploaded CV.',
};

export default function ViewCvPage() {
  return (
    <div className="bg-muted/40 min-h-[calc(100vh-8rem)] py-12 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
             <Button asChild variant="ghost" className="mb-4 -ml-4">
                <Link href="/account">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Account
                </Link>
            </Button>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Your CV</CardTitle>
                    <CardDescription>This is the CV that will be shared with potential employers.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg p-4 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <FileText className="h-8 w-8 text-primary" />
                         <div>
                            <p className="font-semibold">JohnDoe_Resume_2024.pdf</p>
                            <p className="text-sm text-muted-foreground">Uploaded on: July 28, 2024</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-2">
                           <Button variant="outline" size="icon"><Download className="h-4 w-4"/></Button>
                           <Button variant="outline" size="icon"><Share2 className="h-4 w-4"/></Button>
                       </div>
                    </div>
                    <div className="mt-6 p-6 bg-background border rounded-lg h-96">
                        <p className="text-muted-foreground text-center">CV preview would be displayed here.</p>
                    </div>
                </CardContent>
                 <CardFooter className="flex justify-end">
                    <Button asChild variant="secondary">
                        <Link href="/account/cv/update">Upload a New Version</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}