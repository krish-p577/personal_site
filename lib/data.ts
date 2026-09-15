import type { BlogPost } from './types';
import { href } from "react-router-dom";

export const aboutMe = {
  name: 'Krish Patel',
  role: 'Software Engineer Intern',
  bio: [
    "Hey, I'm Krish, ",
    "A third year student studying Computer Science at the University of Toronto.",
    "I like building things that can make a difference.",
    "",
    "krishpatel8976 [at] gmail.com",
  ],
  links: [
    // { label: 'Email', href: 'mailto:krishpatel8976@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/krish-p577' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/krish-patel577/' },
    // { label: 'Resume', href: '/resume.pdf' },
  ],
};

export const education = [
  {
    school: 'University Of Toronto',
    degree: 'B.S. in Computer Science',
    period: '2024 — 2028',
    details: 'Dean\'s List 2025',
    courses: "Data Structures and Algorithms, Computer Organization, \nSoftware Tools and Systems, Software Design, Human Computer Interaction"
  },
  // Add more entries as needed
];

export const experience = [
  {
    company: 'Scotiabank',
    role: 'Velocity Software Engineering Intern',
    period: 'Jan 2026 — Apr 2026',
    bullets: [
      'Built automated data pipelines.',
      'Developed an agentic RAG system to improve information retrieval.',
    ],
  },
  {
    company: 'Intact',
    role: 'Software Developer Intern',
    period: 'Apr 2025 — Aug 2025',
    bullets: [
      'Developed APIs for internal tools to improve efficiency.',
      'Imporved performance, across a distributed system',
    ],
  },
  {
    company: 'UTSC Unbenched',
    role: '\n\nHead of App Development',
    period: 'Aug 2026 — Present',
    bullets: [
      'Leading a team of 4 developers, building our website',
      'Hosting live game stats, rosters, and events at UTSC'
    ],
  },
];

export const projects = [
  {
    title: 'Distributed Async Job Orchestrator',
    description: 'A distributed, asynchronous workflow orchestrator inspired by Apache Airflow. ',
    stack: ['Spring Boot', 'PostgreSQL', 'Docker'],
    link: 'https://github.com/krish-p577/Distributed-Async-Job-Orchestrator/tree/main',
  },
  {
    title: 'Club Connect',
    description: 'A platform for UofT students to find clubs based on their interests in an interactive way.',
    stack: ['Flask', 'React', 'SQLAlchemy'],
    link: 'https://github.com/krish-p577/Club-Connect',
  },
  {
    title: 'AI Finance Manager',
    description: 'A personal finance management tool that uses AI to analyze spending habits and provide advice and insights to reach financial goals.',
    stack: ['Spring Boot', 'React', 'MySQL', 'AWS'],
    link: 'https://github.com/krish-p577/Stature-the-AI-finance-manager',
  },
  {
    title: 'Wild Fire Risk Calculator',
    description: 'Using live NASA data and user location data to calculate the rick of being affected by a wildfire. \nInspired by the California wildfires.',
    stack: ['Spring Boot', 'React', 'MySQL', 'AWS'],
    link: 'https://github.com/krish-p577/Stature-the-AI-finance-manager',
  },
];

// export const blogPosts = [
//   {
//     title: 'My thoughts on the impact of LLMs on software development, society, and culture',
//     date: 'Jan 7th, 2026',
//     excerpt: 'Cause it seems everyone has a different perspective\n Maybe it won\'t be that bad',
//     href: '/blog/post-slug',
//   },
export const blogPosts: BlogPost[] = [
  {
    slug: 'first-post',
    title: 'My thoughts on the impact of LLMs on society, and culture',
    date: 'Jan 2026',
    excerpt: 'Cause it seems everyone has a different perspective\n Maybe it won\'t be that bad',
    file: 'first-post.md',
  },


];