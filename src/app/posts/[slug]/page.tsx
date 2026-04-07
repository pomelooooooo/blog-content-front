import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, FolderOpen, TagIcon, PenLine } from "lucide-react";
import type { Post } from "@/types";
import type { Metadata } from "next";
import MarkdownContent from "@/components/public/MarkdownContent";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/posts/slug/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.title} | Blog Content`,
    description: post.excerpt || post.title,
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
              <PenLine className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Blog Content
            </span>
          </Link>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            Admin
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          กลับหน้าหลัก
        </Link>

        {post.coverImage && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full object-cover"
              priority
            />
          </div>
        )}

        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </span>
              {post.category && (
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="h-4 w-4" />
                  {post.category.name}
                </span>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <TagIcon className="h-4 w-4 text-gray-400" />
                {post.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary-600 prose-img:rounded-xl">
            <MarkdownContent content={post.content} />
          </div>
        </article>
      </main>

      <footer className="border-t mt-16">
        <div className="mx-auto max-w-5xl px-4 py-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Blog Content. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
