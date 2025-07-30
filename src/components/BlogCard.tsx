import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BlogPost } from '@/data/blogs';
import { ArrowRight } from 'lucide-react';

type BlogCardProps = {
  post: BlogPost;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={400}
          height={225}
          data-ai-hint="blog abstract"
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <Badge variant="outline" className="mb-2">{post.category}</Badge>
        <CardTitle className="font-headline text-xl mb-2 hover:text-primary transition-colors">
          <Link href="#">{post.title}</Link>
        </CardTitle>
        <CardDescription>{post.excerpt}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center text-sm text-muted-foreground">
        <div>
            <p className="font-medium text-foreground">{post.author}</p>
            <p>{post.date}</p>
        </div>
        <Link href="#" className="flex items-center text-primary hover:underline">
          Read More <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}
