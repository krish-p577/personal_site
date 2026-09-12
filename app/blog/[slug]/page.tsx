import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/lib/data';
import { getPostMarkdown } from '@/lib/posts';

// Pre-render a page for every post at build time.
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

type PageProps = {
  // Typed as a Promise for forward-compat with Next.js versions where
  // `params` is async — `await`-ing a plain object also works fine,
  // so this runs correctly either way.
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  let markdown: string;
  try {
    markdown = getPostMarkdown(post.file);
  } catch {
    // File missing from /content/blog — treat like a missing post
    // rather than crashing the page.
    notFound();
  }

  return (
    <main className="min-h-screen w-full bg-white text-neutral-900 px-6 py-12 md:px-24 md:py-20">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-neutral-400 hover:text-neutral-900 underline underline-offset-4 mb-10 inline-block"
        >
          ← Back
        </Link>

        <h1 className="text-3xl font-semibold mb-1">{post.title}</h1>
        <p className="text-sm text-neutral-400 mb-10">{post.date}</p>

        {/* Left-aligned here, unlike the homepage — long-form reading
            is easier with a ragged-right edge than ragged-left. */}
        <article className="text-neutral-700">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-semibold mt-8 mb-3 text-neutral-900 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mt-6 mb-2 text-neutral-900">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium mt-4 mb-2 text-neutral-900">
                  {children}
                </h3>
              ),
              p: ({ children }) => <p className="leading-relaxed mb-4">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 mb-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 mb-4">{children}</ol>
              ),
              li: ({ children }) => <li>{children}</li>,
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="underline underline-offset-4 text-neutral-600 hover:text-neutral-900"
                >
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-neutral-900">{children}</strong>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-neutral-300 pl-4 italic text-neutral-500 mb-4">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm text-neutral-800">
                  {children}
                </code>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}