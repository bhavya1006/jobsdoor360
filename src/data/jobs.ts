export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  fullDescription: string;
}

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Innovatech',
    location: 'Remote',
    description: 'Passionate about creating beautiful and functional user interfaces.',
    fullDescription: 'Innovatech is seeking a skilled Frontend Developer to join our remote team. You will be responsible for building the client-side of our web applications. You should be able to translate our company and customer needs into functional and appealing interactive applications. We expect you to be a tech-savvy professional, who is curious about new digital technologies and aspires to combine usability with visual design.'
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'Data Solutions',
    location: 'New York, NY',
    description: 'Expert in server-side logic, database management, and API development.',
    fullDescription: 'Data Solutions is looking for a Backend Developer to be responsible for the server-side of our web applications. You will work closely with our engineers to ensure system consistency and improve user experience. You will be responsible for managing the interchange of data between the server and the users, as well as developing all server-side logic, definition and maintenance of the central database, and ensuring high performance and responsiveness to requests from the front-end.'
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'Creative Minds',
    location: 'San Francisco, CA',
    description: 'Drive the product vision and roadmap from conception to launch.',
    fullDescription: 'Creative Minds is hiring a Product Manager to define product strategy and roadmap. This role involves working with cross-functional teams to design, build and roll-out products that deliver the company’s vision and strategy. A strong understanding of the product lifecycle, market needs, and the competitive landscape is essential.'
  },
  {
    id: '4',
    title: 'UX/UI Designer',
    company: 'Pixel Perfect Inc.',
    location: 'Remote',
    description: 'Design intuitive and engaging user experiences for web and mobile.',
    fullDescription: 'Pixel Perfect Inc. is seeking a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills and be able to translate high-level requirements into interaction flows and artifacts, and transform them into beautiful, intuitive, and functional user interfaces.'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudFlow',
    location: 'Austin, TX',
    description: 'Automate and streamline our operations and processes.',
    fullDescription: 'CloudFlow is looking for a DevOps Engineer to help us build functional systems that improve customer experience. DevOps Engineer responsibilities include deploying product updates, identifying production issues and implementing integrations that meet our customers\' needs. If you have a solid background in software engineering and are familiar with Ruby or Python, we’d like to meet you.'
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'Numerix',
    location: 'Boston, MA',
    description: 'Analyze large amounts of raw information to find patterns.',
    fullDescription: 'Numerix is hiring a Data Scientist to analyze vast amounts of raw information to find patterns that will help improve our company. We will rely on you to build data products to extract valuable business insights. In this role, you should be highly analytical with a knack for analysis, math and statistics. Critical thinking and problem-solving skills are essential for interpreting data.'
  },
  {
    id: '7',
    title: 'Full Stack Developer',
    company: 'Synergy Systems',
    location: 'Remote',
    description: 'Work on both the frontend and backend of our applications.',
    fullDescription: 'Synergy Systems is seeking a Full Stack Developer who is comfortable around both front-end and back-end coding languages, development frameworks and third-party libraries. You should also be a team player with a knack for visual design and utility.'
  },
  {
    id: '8',
    title: 'Digital Marketing Specialist',
    company: 'GrowthHackers',
    location: 'Remote',
    description: 'Develop and implement marketing strategies to drive growth.',
    fullDescription: 'GrowthHackers is looking for a Digital Marketing Specialist to be responsible for setting up, implementing and managing the overall company\'s digital marketing strategy. Digital marketing strategies are extremely important for our company\'s success, so your role will play a crucial role in achieving our business goals and objectives.'
  },
  {
    id: '9',
    title: 'IT Support Specialist',
    company: 'TechRelief',
    location: 'Chicago, IL',
    description: 'Provide technical assistance and support to our clients and team.',
    fullDescription: 'TechRelief is hiring an IT Support Specialist to provide enterprise-level assistance to our customers. You will diagnose and troubleshoot software and hardware problems and help our customers install applications and programs. IT Support Specialist responsibilities include resolving network issues, configuring operating systems and using remote desktop connections to provide immediate support.'
  },
  {
    id: '10',
    title: 'Content Writer',
    company: 'StoryWeavers',
    location: 'Remote',
    description: 'Create compelling blog posts, product descriptions, and social media content.',
    fullDescription: 'StoryWeavers is looking for a Content Writer to join our editorial team and enrich our websites with new blog posts, guides and marketing copy. Content Writer responsibilities include conducting thorough research on industry-related topics, generating ideas for new content types and proofreading articles before publication.'
  },
];
