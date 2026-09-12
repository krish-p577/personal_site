import fs from 'fs';
import path from 'path';

// Only import this from Server Components / route handlers — it uses
// Node's fs module, which isn't available in the browser.
const BLOG_CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export function getPostMarkdown(filename: string): string {
  const filePath = path.join(BLOG_CONTENT_DIR, filename);
  return fs.readFileSync(filePath, 'utf-8');
}