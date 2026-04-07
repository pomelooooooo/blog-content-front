"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Eye } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { posts, categories as catApi, tags as tagApi } from "@/lib/api";
import { slugify } from "@/lib/utils";
import ImageUpload from "./ImageUpload";
import type { Post, Category, Tag, CreatePostDto } from "@/types";

interface Props {
  post?: Post;
}

export default function PostForm({ post }: Props) {
  const router = useRouter();
  const isEditing = !!post;

  const [form, setForm] = useState<CreatePostDto>({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    coverImage: post?.coverImage || "",
    published: post?.published || false,
    categoryId: post?.categoryId || null,
    tagIds: post?.tags?.map((t) => t.tag.id) || [],
  });

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(!isEditing);

  useEffect(() => {
    catApi.getAll().then(setAllCategories);
    tagApi.getAll().then(setAllTags);
  }, []);

  const updateField = <K extends keyof CreatePostDto>(
    key: K,
    value: CreatePostDto[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "title" && autoSlug) {
      setForm((prev) => ({ ...prev, slug: slugify(value as string) }));
    }
  };

  const toggleTag = (id: number) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds?.includes(id)
        ? prev.tagIds.filter((t) => t !== id)
        : [...(prev.tagIds || []), id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data: CreatePostDto = {
        ...form,
        categoryId: form.categoryId || undefined,
        coverImage: form.coverImage || undefined,
        excerpt: form.excerpt || undefined,
      };

      if (isEditing) {
        await posts.update(post.id, data);
        toast.success("อัปเดต Post สำเร็จ");
      } else {
        await posts.create(data);
        toast.success("สร้าง Post สำเร็จ");
      }
      router.push("/admin/posts");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts"
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "แก้ไข Post" : "สร้าง Post ใหม่"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && post.published && (
            <Link
              href={`/posts/${post.slug}`}
              target="_blank"
              className="btn-secondary"
            >
              <Eye className="h-4 w-4" />
              ดูหน้าเว็บ
            </Link>
          )}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isEditing ? "บันทึก" : "สร้าง Post"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-5">
            <div>
              <label className="label">หัวข้อ</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="หัวข้อ Post..."
                className="input"
              />
            </div>

            <div>
              <label className="label">
                Slug
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setAutoSlug(!autoSlug)}
                    className="ml-2 text-xs text-primary-600 hover:underline"
                  >
                    {autoSlug ? "(กำหนดเอง)" : "(อัตโนมัติ)"}
                  </button>
                )}
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => {
                  setAutoSlug(false);
                  updateField("slug", e.target.value);
                }}
                placeholder="my-post-slug"
                className="input font-mono text-sm"
              />
            </div>

            <div>
              <label className="label">เนื้อหา (Markdown)</label>
              <textarea
                required
                rows={16}
                value={form.content}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder="เขียนเนื้อหาในรูปแบบ Markdown..."
                className="input font-mono text-sm leading-relaxed"
              />
            </div>

            <div>
              <label className="label">บทคัดย่อ</label>
              <textarea
                rows={3}
                value={form.excerpt || ""}
                onChange={(e) => updateField("excerpt", e.target.value)}
                placeholder="สรุปเนื้อหาสั้นๆ..."
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish */}
          <div className="card p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              สถานะ
            </h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => updateField("published", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">เผยแพร่</span>
            </label>
          </div>

          {/* Cover Image */}
          <div className="card p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              รูปหน้าปก
            </h3>
            <ImageUpload
              value={form.coverImage}
              onChange={(url) => updateField("coverImage", url || "")}
            />
          </div>

          {/* Category */}
          <div className="card p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">
              หมวดหมู่
            </h3>
            <select
              value={form.categoryId || ""}
              onChange={(e) =>
                updateField(
                  "categoryId",
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="input"
            >
              <option value="">-- ไม่มีหมวดหมู่ --</option>
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="card p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-900">แท็ก</h3>
            {allTags.length === 0 ? (
              <p className="text-sm text-gray-400">ยังไม่มีแท็ก</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const selected = form.tagIds?.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        selected
                          ? "bg-primary-100 text-primary-700 ring-1 ring-primary-300"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
