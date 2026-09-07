import { blogPosts } from '@/lib/data';

export default function Blog() {
  return (
    <section className="text-right">
      {/* <h2 className="text-2xl font-semibold mb-6">Blog</h2> */}
      <div className="space-y-6">
        {blogPosts.map((post) => (
          <a key={post.title} href={post.href} className="block group">
            <h3 className="font-medium group-hover:underline underline-offset-4">
              {post.title}
            </h3>
            <p className="text-sm text-neutral-400">{post.date}</p>
            <p className="text-neutral-600 text-sm mt-1 whitespace-pre-line">{post.excerpt}</p>
          </a>
        ))}
      </div>
    </section>
  );
}