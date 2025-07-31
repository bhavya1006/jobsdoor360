import { Jd360FullLoader } from "@/components/ui/loader";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen animate-pulse">
        <div className="flex items-center justify-center" style={{minHeight: 'calc(100vh - 420px)'}}>
            <Jd360FullLoader className="h-24 w-auto text-primary" />
        </div>
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
                <Skeleton className="h-6 w-32 rounded-lg" />
                <Skeleton className="h-10 w-[400px] md:w-[500px]" />
                <Skeleton className="h-6 w-[300px] md:w-[600px]" />
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-8 mb-2 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
                 <Skeleton className="h-4 w-40 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-28" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-8 mb-2 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
                <Skeleton className="h-4 w-44 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-28" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-8 mb-2 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48 mt-2" />
                <Skeleton className="h-4 w-40 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-5 w-28" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
