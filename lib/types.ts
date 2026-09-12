export type SectionKey = 'about' | 'education' | 'experience' | 'projects' | 'blog';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  file: string; // filename inside /content/blog, e.g. 'first-post.md'
};