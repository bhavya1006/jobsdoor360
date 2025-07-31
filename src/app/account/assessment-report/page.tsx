import type { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock, Star } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Assessment Report - JobsDoor360',
  description: 'View your assessment results and analysis.',
};

export default function AssessmentReportPage() {
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
                    <CardTitle className="font-headline text-3xl">Assessment Report</CardTitle>
                    <CardDescription>Here are the results of your latest assessment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid md:grid-cols-3 gap-6 text-center">
                        <div className="p-4 bg-background rounded-lg border">
                            <h3 className="text-lg font-semibold text-muted-foreground">Overall Score</h3>
                            <p className="text-4xl font-bold text-primary mt-2">88%</p>
                        </div>
                        <div className="p-4 bg-background rounded-lg border">
                            <h3 className="text-lg font-semibold text-muted-foreground">Completed On</h3>
                            <p className="text-2xl font-semibold text-foreground mt-2">July 26, 2024</p>
                        </div>
                         <div className="p-4 bg-background rounded-lg border">
                            <h3 className="text-lg font-semibold text-muted-foreground">Time Taken</h3>
                            <p className="text-2xl font-semibold text-foreground mt-2">45 mins</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-headline text-2xl mb-4">Skill Breakdown</h3>
                        <div className="space-y-4">
                            <SkillItem name="Logical Reasoning" score={92} />
                            <SkillItem name="Quantitative Aptitude" score={85} />
                            <SkillItem name="Verbal Ability" score={88} />
                            <SkillItem name="Technical Skills (React)" score={95} />
                        </div>
                    </div>

                     <div>
                        <h3 className="font-headline text-2xl mb-4">Recommended Career Paths</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                           <RecommendationCard icon={Star} title="Frontend Development" description="Your high score in React suggests a strong aptitude for modern web development." />
                           <RecommendationCard icon={Star} title="Product Management" description="Your logical reasoning and verbal ability scores indicate potential in product-focused roles." />
                        </div>
                    </div>
                    <div className="text-center pt-4">
                        <Button asChild size="lg">
                            <Link href="/assessments">Take a New Assessment</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

const SkillItem = ({ name, score }: { name: string, score: number }) => (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
        <p className="font-medium">{name}</p>
        <p className="font-semibold text-primary">{score}%</p>
    </div>
)

const RecommendationCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
    <div className="flex items-start p-4 border rounded-lg bg-background space-x-4">
        <Icon className="h-6 w-6 text-accent mt-1" />
        <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
)
