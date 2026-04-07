"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, FolderOpen, TagIcon, Plus } from "lucide-react";
import { posts, categories, tags } from "@/lib/api";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalTags: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const [allPosts, allCats, allTags] = await Promise.all([
        posts.getAll(),
        categories.getAll(),
        tags.getAll(),
      ]);
      setStats({
        totalPosts: allPosts.length,
        publishedPosts: allPosts.filter((p) => p.published).length,
        draftPosts: allPosts.filter((p) => !p.published).length,
        totalCategories: allCats.length,
        totalTags: allTags.length,
      });
    }
    load();
  }, []);

  const cards = stats
    ? [
        {
          label: "Posts ทั้งหมด",
          value: stats.totalPosts,
          icon: FileText,
          color: "bg-blue-500",
          href: "/admin/posts",
        },
        {
          label: "เผยแพร่แล้ว",
          value: stats.publishedPosts,
          icon: FileText,
          color: "bg-green-500",
          href: "/admin/posts",
        },
        {
          label: "แบบร่าง",
          value: stats.draftPosts,
          icon: FileText,
          color: "bg-amber-500",
          href: "/admin/posts",
        },
        {
          label: "หมวดหมู่",
          value: stats.totalCategories,
          icon: FolderOpen,
          color: "bg-purple-500",
          href: "/admin/categories",
        },
        {
          label: "แท็ก",
          value: stats.totalTags,
          icon: TagIcon,
          color: "bg-pink-500",
          href: "/admin/tags",
        },
      ]
    : [];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            ภาพรวมของเนื้อหาทั้งหมด
          </p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          สร้าง Post ใหม่
        </Link>
      </div>

      {!stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse p-6">
              <div className="h-10 w-10 rounded-lg bg-gray-200" />
              <div className="mt-4 h-7 w-16 rounded bg-gray-200" />
              <div className="mt-1 h-4 w-24 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map((card) => (
            <Link key={card.label} href={card.href} className="card p-6 transition hover:shadow-md">
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}
              >
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <p className="mt-4 text-2xl font-bold text-gray-900">
                {card.value}
              </p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
