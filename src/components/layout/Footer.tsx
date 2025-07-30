import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            <Link href="/about" className="text-muted-foreground hover:text-foreground">About Us</Link>
            <Link href="/career-options/job-options" className="text-muted-foreground hover:text-foreground">Jobs</Link>
            <Link href="/business-plans" className="text-muted-foreground hover:text-foreground">Blog</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <div className="flex items-center justify-center">
              <Briefcase className="h-6 w-6 mr-2 text-primary" />
              <p className="text-center text-base text-muted-foreground">&copy; {new Date().getFullYear()} JobsDoor360. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
