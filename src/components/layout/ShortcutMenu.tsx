
"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from "next/link"

const studentOptions = [
    { title: "Placement Assistance", href: "/placement-assistance" },
    { title: "Interview Assistance", href: "/interview-assistance" },
    { title: "Jobs for You", href: "/career-options/job-options" },
    { title: "Profile Analyser", href: "/career-options/profile-analyzer" },
    { title: "Career consultancy", href: "/career-consultancy" },
    { title: "CV Creation", href: "/cv-creation" },
    { title: "Internships", href: "/internships" },
    { title: "English speaking", href: "/english-speaking" },
    { title: "Major Projects", href: "/major-projects" },
    { title: "Buy Projects", href: "/buy-projects" },
    { title: "Mock Interviews", href: "/mock-interviews" },
    { title: "Math, Aptitude & Reasoning", href: "/math-aptitude-reasoning" },
    { title: "Business plan making", href: "/business-plans" },
    { title: "Marketing Classes", href: "/marketing-classes" },
];

const businessOptions = [
    { title: "Hire with us", href: "/hire-with-us" },
    { title: "Hire using our portal", href: "/hire-portal" },
    { title: "Outsource Interns", href: "/outsource-interns" },
    { title: "Software Estimation or Quotation", href: "/software-estimation" },
    { title: "SEO", href: "/seo-services" },
    { title: "Digital Marketing", href: "/digital-marketing" },
    { title: "Web Development", href: "/web-development" },
    { title: "Software Development", href: "/software-development" },
];


export default function ShortcutMenu() {
  return (
    <section className="w-full py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 md:grid-cols-2">
                
                {/* For Students Section */}
                <div className="bg-card border rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold font-headline text-card-foreground bg-gray-800 text-white p-4 rounded-t-lg">
                        For Students
                    </h2>
                    <Accordion type="single" collapsible className="w-full p-4">
                        {studentOptions.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-base font-medium hover:no-underline">
                                    <Link href={item.href} className="hover:text-primary">{item.title}</Link>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-muted-foreground">
                                        Find more about <Link href={item.href} className="text-primary underline"> {item.title.toLowerCase()}</Link>.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* Business Services Section */}
                 <div className="bg-card border rounded-lg shadow-sm">
                    <h2 className="text-xl font-bold font-headline text-card-foreground bg-gray-800 text-white p-4 rounded-t-lg">
                        Business Services
                    </h2>
                     <Accordion type="single" collapsible className="w-full p-4">
                        {businessOptions.map((item, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-base font-medium hover:no-underline">
                                    <Link href={item.href} className="hover:text-primary">{item.title}</Link>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-muted-foreground">
                                       Learn more about our <Link href={item.href} className="text-primary underline"> {item.title.toLowerCase()}</Link>.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

            </div>
        </div>
    </section>
  );
}
