import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Briefcase, Feather, FileText, Search } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                  Your Skills, Our Mentorship, Infinite Possibilities!
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Unlock Your Future: Register for Jobs, Internships, and Our Placement Assistance Program
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/signup">
                    Complete your profile to get jobs
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-background/80 backdrop-blur-sm">
                        <CardHeader className="p-4 flex flex-col items-center justify-center">
                            <CardTitle className="text-4xl font-bold text-primary">60+</CardTitle>
                            <CardDescription className="text-center">Total placement class conducted</CardDescription>
                        </CardHeader>
                    </Card>
                     <Card className="bg-background/80 backdrop-blur-sm">
                        <CardHeader className="p-4 flex flex-col items-center justify-center">
                            <CardTitle className="text-4xl font-bold text-primary">61+</CardTitle>
                            <CardDescription className="text-center">Total consultancy provided</CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div className="relative">
                    <Input placeholder="Search Jobs here" className="h-12 text-base pl-4 pr-12 w-full" />
                    <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 bg-primary hover:bg-primary/90">
                        <Search className="h-5 w-5 text-primary-foreground" />
                    </Button>
                </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                From finding the perfect job to analyzing your career path, we've got you covered.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Briefcase className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="font-headline">Career Options</CardTitle>
                <CardDescription>Explore a wide range of job and business opportunities tailored to your skills and interests.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 h-auto text-primary">
                  <Link href="/career-options">
                    Discover Careers <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Feather className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="font-headline">Insightful Blog</CardTitle>
                <CardDescription>Gain wisdom from biographies, business plans, and articles on health and motivation.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 h-auto text-primary">
                  <Link href="/business-plans">
                    Read Our Blog <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-8 w-8 text-accent mb-2" />
                <CardTitle className="font-headline">Assessments</CardTitle>
                <CardDescription>Analyze your profile and take assessments to find the perfect career fit for you.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className="p-0 h-auto text-primary">
                  <Link href="/assessments">
                    Take an Assessment <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}