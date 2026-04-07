export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId?: number | null;
  category?: Category | null;
  tags?: { tag: Tag }[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: { posts: number };
  posts?: Post[];
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  _count?: { posts: number };
  posts?: { post: Post }[];
}

export interface Admin {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface CreatePostDto {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  published?: boolean;
  categoryId?: number | null;
  tagIds?: number[];
}

export interface CreateCategoryDto {
  name: string;
  slug: string;
}

export interface CreateTagDto {
  name: string;
  slug: string;
}
