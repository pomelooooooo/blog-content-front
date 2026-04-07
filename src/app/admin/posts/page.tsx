"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";
import { posts } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

export default function PostsPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await posts.getAll();
      setAllPosts(data);
    } catch {
      toast.error("ไม่สามารถโหลดข้อมูล Posts ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`ต้องการลบ "${title}" หรือไม่?`)) return;
    try {
      await posts.delete(id);
      toast.success("ลบ Post สำเร็จ");
      setAllPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ลบไม่สำเร็จ");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="mt-1 text-sm text-gray-500">
            จัดการบทความทั้งหมด ({allPosts.length})
          </p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          สร้าง Post ใหม่
        </Link>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : allPosts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">ยังไม่มี Post</p>
            <Link href="/admin/posts/new" className="btn-primary mt-4">
              <Plus className="h-4 w-4" />
              สร้าง Post แรก
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3.5 font-semibold text-gray-600">
                    หัวข้อ
                  </th>
                  <th className="px-6 py-3.5 font-semibold text-gray-600">
                    หมวดหมู่
                  </th>
                  <th className="px-6 py-3.5 font-semibold text-gray-600">
                    สถานะ
                  </th>
                  <th className="px-6 py-3.5 font-semibold text-gray-600">
                    วันที่สร้าง
                  </th>
                  <th className="px-6 py-3.5 font-semibold text-gray-600 text-right">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {allPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {post.title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400 font-mono">
                          /{post.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {post.category?.name || (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          post.published
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {post.published ? "เผยแพร่" : "แบบร่าง"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {post.published && (
                          <Link
                            href={`/posts/${post.slug}`}
                            target="_blank"
                            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                            title="ดูหน้าเว็บ"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                          title="แก้ไข"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          title="ลบ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
