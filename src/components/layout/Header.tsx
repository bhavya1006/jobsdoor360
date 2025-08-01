
"use client";

import React from 'react';
import Link from 'next/link';
import { Briefcase, ChevronDown, LogOut, Menu, UserCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  ListItem,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';

const careerOptions: { title: string; href: string; description: string }[] = [
  { title: 'Career Options', href: '/career-options', description: 'Explore various career paths.' },
  { title: 'Job Options', href: '/career-options/job-options', description: 'Browse current job openings.' },
  { title: 'Business Options', href: '/career-options/business-options', description: 'Discover business opportunities.' },
  { title: 'Profile Analyzer', href: '/career-options/profile-analyzer', description: 'Analyze your professional profile.' },
];

const blogOptions: { title: string; href: string }[] = [
  { title: 'Business Plans', href: '/business-plans' },
  { title: 'Biographies', href: '/biographies' },
  { title: 'Motivation', href: '/motivation' },
  { title: 'Healthy Diet', href: '/healthy-diet' },
  { title: 'Wealthy Healthy Satisfactory Life', href: '/blog/wealthy-healthy-and-satisfactory-life' },
];

export default function Header() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg">JobsDoor360</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                 <Link href="/" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Career Option</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    {careerOptions.map((component) => (
                      <ListItem key={component.title} title={component.title} href={component.href}>
                        {component.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                 <Link href="/job-analysis" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Job Analysis
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px]">
                    {blogOptions.map((item) => (
                      <ListItem key={item.title} title={item.title} href={item.href} />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/assessments" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Assessments
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
           <nav className="hidden md:flex items-center space-x-2">
             <Button asChild variant="ghost">
              <Link href="/apply">Apply Now</Link>
            </Button>
            {!loading && (
              isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary">
                      <UserCircle className="mr-2 h-5 w-5" />
                      My Account
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link href="/account">Profile</Link></DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )
            )}
           </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <Link href="/" className="flex items-center space-x-2">
                      <Briefcase className="h-6 w-6 text-primary" />
                      <span className="font-bold font-headline text-lg">JobsDoor360</span>
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex-1 flex flex-col p-4 space-y-2 overflow-y-auto">
                    <SheetClose asChild><Link className="py-2 text-lg" href="/">Home</Link></SheetClose>
                    
                    <div className="py-2">
                      <p className="font-semibold text-lg">Career Option</p>
                      <div className="flex flex-col pl-4 mt-1 space-y-1">
                        {careerOptions.map(item => <SheetClose key={item.href} asChild><Link href={item.href} className="text-muted-foreground py-1">{item.title}</Link></SheetClose>)}
                      </div>
                    </div>

                    <SheetClose asChild><Link className="py-2 text-lg" href="/job-analysis">Job Analysis</Link></SheetClose>
                    
                    <div className="py-2">
                      <p className="font-semibold text-lg">Blog</p>
                      <div className="flex flex-col pl-4 mt-1 space-y-1">
                        {blogOptions.map(item => <SheetClose key={item.href} asChild><Link href={item.href} className="text-muted-foreground py-1">{item.title}</Link></SheetClose>)}
                      </div>
                    </div>
                    
                    <SheetClose asChild><Link className="py-2 text-lg" href="/assessments">Assessments</Link></SheetClose>
                    <SheetClose asChild><Link className="py-2 text-lg" href="/about">About Us</Link></SheetClose>
                    <SheetClose asChild><Link className="py-2 text-lg" href="/apply">Apply Now</Link></SheetClose>
                  </nav>
                  <div className="p-4 border-t mt-auto">
                    {!loading && (
                      isAuthenticated ? (
                        <div className="space-y-2">
                          <p className="text-center text-sm text-muted-foreground">{user?.email}</p>
                           <SheetClose asChild>
                             <Button asChild variant="outline" className="w-full"><Link href="/account">My Account</Link></Button>
                           </SheetClose>
                          <Button onClick={logout} variant="destructive" className="w-full">Logout</Button>
                        </div>
                      ) : (
                         <div className="flex flex-col space-y-2">
                            <SheetClose asChild>
                              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"><Link href="/signup">Sign Up</Link></Button>
                            </SheetClose>
                             <SheetClose asChild>
                               <Button asChild variant="outline" className="w-full"><Link href="/login">Sign In</Link></Button>
                             </SheetClose>
                         </div>
                      )
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
