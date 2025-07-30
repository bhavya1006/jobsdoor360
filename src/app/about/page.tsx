import { Briefcase, Target, Eye } from "lucide-react";
import type { Metadata } from 'next';
import Image from "next/image";

export const metadata: Metadata = {
  title: 'About Us - JobsDoor360',
  description: 'Learn about the mission and vision of JobsDoor360.',
};

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            About JobsDoor360
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground">
            We are dedicated to revolutionizing the job search landscape by providing comprehensive tools and resources for career growth and success.
          </p>
        </div>
      </div>

      <div className="pb-16">
        <div className="relative">
          <div className="absolute inset-x-0 h-1/2 bg-background" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <Image
                className="mx-auto h-auto w-full rounded-lg object-cover shadow-2xl"
                src="https://placehold.co/1200x500.png"
                width={1200}
                height={500}
                data-ai-hint="diverse team meeting"
                alt="A diverse team collaborating in a modern office."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-y-16 lg:max-w-none lg:grid-cols-2 lg:gap-x-16">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex items-center justify-center rounded-md bg-accent/20 p-3">
              <Target className="h-8 w-8 text-accent" />
            </div>
            <h2 className="mt-6 font-headline text-3xl font-bold text-primary">Our Mission</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our mission is to empower individuals to find not just a job, but a fulfilling career. We strive to connect talent with the right opportunities by leveraging technology, data-driven insights, and a deep understanding of the modern workforce. We believe everyone deserves a chance to achieve their professional dreams.
            </p>
          </div>
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="flex items-center justify-center rounded-md bg-accent/20 p-3">
              <Eye className="h-8 w-8 text-accent" />
            </div>
            <h2 className="mt-6 font-headline text-3xl font-bold text-primary">Our Vision</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We envision a world where career navigation is seamless, transparent, and personalized. JobsDoor360 aims to be the most trusted and comprehensive platform for career development, offering a 360-degree view of the professional landscape, from job opportunities and business ventures to personal growth and well-being.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
