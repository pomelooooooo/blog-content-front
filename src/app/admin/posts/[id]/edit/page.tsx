"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { posts } from "@/lib/api";
import PostForm from "@/components/admin/PostForm";
import type { Post } from "@/types";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    posts
      .getById(Number(id))
      .then(setPost)
      .catch(() => {
        toast.error("ไม่พบ Post นี้");
        router.replace("/admin/posts");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!post) return null;

  return <PostForm post={post} />;
}
