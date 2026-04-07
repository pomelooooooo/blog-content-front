import Link from "next/link";
import Image from "next/image";
import { PenLine } from "lucide-react";
import type { Post } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/posts?published=true`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function HomePage() {
  const posts = await getPosts();

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

      {/* Hero */}
      <section className="border-b bg-gradient-to-b from-primary-50/50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Blog Content
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            บทความและเนื้อหาที่น่าสนใจ
          </p>
        </div>
      </section>

      {/* Posts */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-500">ยังไม่มีบทความ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
              >
                {post.coverImage ? (
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={640}
                      height={360}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                    <PenLine className="h-10 w-10 text-primary-300" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {post.category && (
                      <>
                        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-primary-700 font-medium">
                          {post.category.name}
                        </span>
                        <span>&middot;</span>
                      </>
                    )}
                    <time>{formatDate(post.createdAt)}</time>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.map(({ tag }) => (
                        <span
                          key={tag.id}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Blog Content. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
