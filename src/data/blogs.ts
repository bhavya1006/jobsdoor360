export type BlogCategory = 
  | 'Business Plans' 
  | 'Biographies' 
  | 'Motivation' 
  | 'Healthy Diet' 
  | 'Wealthy Healthy Satisfactory Life';

export interface BlogPost {
  id: string;
  title: string;
  category: BlogCategory;
  author: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
}

export const blogs: BlogPost[] = [
  {
    id: '1',
    title: 'The Ultimate Guide to Starting a SaaS Business',
    category: 'Business Plans',
    author: 'Jane Doe',
    date: '2024-05-10',
    excerpt: 'Learn the key steps to plan, launch, and grow a successful Software as a Service company from scratch.',
    content: 'Starting a SaaS business requires meticulous planning. This guide covers market research, defining your value proposition, pricing strategies, and building a minimum viable product (MVP). We also delve into marketing and sales funnels to acquire your first customers.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '2',
    title: 'Lessons from the Life of Steve Jobs',
    category: 'Biographies',
    author: 'John Smith',
    date: '2024-05-12',
    excerpt: 'An in-depth look at the principles and vision that drove one of the most iconic entrepreneurs of our time.',
    content: 'Steve Jobs was a visionary who revolutionized multiple industries. This article explores his relentless focus on design, his ability to anticipate consumer needs, and his unique leadership style. Discover the key takeaways for innovators and leaders.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '3',
    title: 'How to Stay Motivated When Working Remotely',
    category: 'Motivation',
    author: 'Emily White',
    date: '2024-05-15',
    excerpt: 'Practical tips and strategies to maintain focus, productivity, and a positive mindset in a remote work environment.',
    content: 'Remote work offers flexibility but also presents unique challenges to motivation. We discuss the importance of a dedicated workspace, setting clear boundaries, creating a routine, and using tools to stay connected with your team.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '4',
    title: 'The Professional\'s Guide to a Healthy Work-Life Diet',
    category: 'Healthy Diet',
    author: 'Dr. Alan Grant',
    date: '2024-05-18',
    excerpt: 'Fuel your body and mind for peak performance with these simple, nutritious meal-planning tips for busy professionals.',
    content: 'What you eat directly impacts your energy levels and cognitive function. This guide provides easy-to-prepare recipes, advice on avoiding the afternoon slump, and the benefits of hydration for a productive workday.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '5',
    title: 'Achieving a Balanced and Satisfactory Life',
    category: 'Wealthy Healthy Satisfactory Life',
    author: 'Laura Dern',
    date: '2024-05-20',
    excerpt: 'Explore the pillars of a fulfilling life, from financial wellness and physical health to meaningful relationships and personal growth.',
    content: 'A satisfactory life is about more than just wealth. It\'s a holistic concept encompassing health, happiness, and purpose. This article provides a framework for evaluating different aspects of your life and setting meaningful goals.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: '6',
    title: 'Crafting a Winning Business Plan for Investors',
    category: 'Business Plans',
    author: 'Jane Doe',
    date: '2024-05-22',
    excerpt: 'Your business plan is the first impression you make on investors. Here\'s how to make it count.',
    content: 'This post breaks down the essential components of a compelling business plan, including executive summary, market analysis, financial projections, and your unique selling proposition. Includes a downloadable template.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];
