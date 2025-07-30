import BlogCard from '@/components/BlogCard';
import { blogs, BlogPost } from '@/data/blogs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healthy Diet - JobsDoor360 Blog',
  description: 'Tips and guides for maintaining a healthy diet for a productive life.',
};

export default function HealthyDietPage() {
  const healthyDietBlogs = blogs.filter(blog => blog.category === 'Healthy Diet');

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">Healthy Diet</h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
          Fuel your success with nutritious and delicious meal ideas for busy professionals.
        </p>
      </div>
      
      {healthyDietBlogs.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {healthyDietBlogs.map((post: BlogPost) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No posts found</h2>
          <p className="text-muted-foreground mt-2">Check back later for new content in this category.</p>
        </div>
      )}
    </div>
  );
}
