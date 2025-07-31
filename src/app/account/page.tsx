"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, User, Briefcase, ClipboardCheck, FileText, Search, ExternalLink, Pencil } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-muted/40 min-h-[calc(100vh-8rem)] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl space-y-8">
            {/* Main User Info Card */}
            <Card className="shadow-lg">
                <CardHeader className="flex flex-row items-center space-x-4 p-6">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="https://placehold.co/100x100.png" alt={user?.email} />
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="font-headline text-3xl">{user?.email}</CardTitle>
                        <CardDescription>Welcome back, manage your profile and job search here.</CardDescription>
                    </div>
                </CardHeader>
            </Card>

            {/* Profile Completeness Card */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Profile Completeness</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <CompletenessItem icon={User} title="Personal Profile" value={25} editHref="/account/personal-profile/edit" />
                    <CompletenessItem icon={Briefcase} title="Job Profile" value={0} editHref="/account/job-profile/edit" />
                    <CompletenessItem icon={ClipboardCheck} title="Assessment Completed" value={12} isAssessment={true} viewHref="/account/assessment-report" />
                </CardContent>
            </Card>

            {/* Actions & Preferences Card */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-xl">Actions & Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ActionItem icon={FileText} title="Updating CV">
                            <Button asChild variant="outline" size="sm"><Link href="/account/cv/view">View</Link></Button>
                            <Button asChild variant="default" size="sm"><Link href="/account/cv/update">Update</Link></Button>
                        </ActionItem>
                        <ActionItem icon={Search} title="Explore Jobs">
                            <Button asChild variant="default" size="sm">
                                <Link href="/career-options/job-options">Explore</Link>
                            </Button>
                        </ActionItem>
                        <ActionItem icon={ExternalLink} title="Jobs Applied">
                            <Button asChild variant="outline" size="sm">
                                <Link href="/account/jobs-applied">Visit</Link>
                            </Button>
                        </ActionItem>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        <PreferenceItem title="Looking for Internship" />
                        <PreferenceItem title="Looking for Job" />
                    </div>
                </CardContent>
            </Card>

            {/* Logout Section */}
            <div className="pt-4">
                <Button onClick={logout} variant="destructive">
                    Logout
                </Button>
            </div>
        </div>
    </div>
  );
}

// Helper components for better structure
const CompletenessItem = ({ icon: Icon, title, value, editHref, viewHref, isAssessment = false }: { icon: React.ElementType, title: string, value: number, editHref?: string, viewHref?: string, isAssessment?: boolean }) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
                <span className="font-medium">{title}</span>
            </div>
             <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold text-primary">{isAssessment ? (viewHref ? <Link href={viewHref} className="underline">View Report</Link> : "0/0") : `${value}%`}</span>
                 {editHref && 
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                        <Link href={editHref}><Pencil className="h-4 w-4" /></Link>
                    </Button>
                 }
            </div>
        </div>
        {!isAssessment && <Progress value={value} aria-label={`${title} completeness`} />}
    </div>
);

const ActionItem = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center">
            <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
            <span className="font-medium">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
            {children}
        </div>
    </div>
);

const PreferenceItem = ({ title }: { title: string }) => (
     <div className="flex items-center justify-between p-4 border rounded-lg">
        <span className="font-medium">{title}</span>
        <Switch aria-label={title} />
    </div>
);