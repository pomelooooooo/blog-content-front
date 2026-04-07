import Cookies from "js-cookie";
import type {
  Post,
  Category,
  Tag,
  Admin,
  LoginResponse,
  CreatePostDto,
  CreateCategoryDto,
  CreateTagDto,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

function getHeaders(auth = false): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (auth) {
    const token = Cookies.get("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ─── Auth ────────────────────────────────────────────
export const auth = {
  login(email: string, password: string) {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
  },

  register(email: string, password: string, name: string) {
    return request<LoginResponse>("/auth/register", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
  },

  profile() {
    return request<Admin>("/auth/profile", {
      headers: getHeaders(true),
    });
  },
};

// ─── Posts ───────────────────────────────────────────
export const posts = {
  getAll(published?: boolean) {
    const query = published !== undefined ? `?published=${published}` : "";
    return request<Post[]>(`/posts${query}`);
  },

  getById(id: number) {
    return request<Post>(`/posts/${id}`, {
      headers: getHeaders(),
    });
  },

  getBySlug(slug: string) {
    return request<Post>(`/posts/slug/${slug}`);
  },

  create(data: CreatePostDto) {
    return request<Post>("/posts", {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  update(id: number, data: Partial<CreatePostDto>) {
    return request<Post>(`/posts/${id}`, {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  delete(id: number) {
    return request<Post>(`/posts/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
  },
};

// ─── Categories ─────────────────────────────────────
export const categories = {
  getAll() {
    return request<Category[]>("/categories");
  },

  getById(id: number) {
    return request<Category>(`/categories/${id}`);
  },

  create(data: CreateCategoryDto) {
    return request<Category>("/categories", {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  update(id: number, data: Partial<CreateCategoryDto>) {
    return request<Category>(`/categories/${id}`, {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  delete(id: number) {
    return request<void>(`/categories/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
  },
};

// ─── Tags ───────────────────────────────────────────
export const tags = {
  getAll() {
    return request<Tag[]>("/tags");
  },

  getById(id: number) {
    return request<Tag>(`/tags/${id}`);
  },

  create(data: CreateTagDto) {
    return request<Tag>("/tags", {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  update(id: number, data: Partial<CreateTagDto>) {
    return request<Tag>(`/tags/${id}`, {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  delete(id: number) {
    return request<void>(`/tags/${id}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
  },
};
