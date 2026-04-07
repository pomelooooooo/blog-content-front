# Blog Content Front

A modern Next.js frontend for managing blog content with a full-featured admin panel.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 3**
- **Vercel Blob** — image storage (production)
- **React Markdown** — render markdown content
- **React Hot Toast** — toast notifications
- **Lucide React** — icons

## Getting Started

### Prerequisites

- Node.js 20+
- Backend API running at `http://localhost:3001` ([blog-content](../blog-content))

### Development (without Docker)

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker (recommended)

Spin up the full stack (frontend + backend API + PostgreSQL) with a single command:

```bash
docker compose up --build
```

| Service    | URL                        |
| ---------- | -------------------------- |
| Frontend   | http://localhost:3000       |
| Backend API| http://localhost:3001       |
| Swagger    | http://localhost:3001/api   |
| PostgreSQL | localhost:5432              |

Stop all services:

```bash
docker compose down
```

## Environment Variables

| Variable                | Required | Description                          |
| ----------------------- | -------- | ------------------------------------ |
| `NEXT_PUBLIC_API_URL`   | Yes      | Backend API URL                      |
| `BLOB_READ_WRITE_TOKEN` | No      | Vercel Blob token (production only)  |

When `BLOB_READ_WRITE_TOKEN` is set, image uploads are stored in Vercel Blob. Otherwise, files are saved to `public/uploads/` on the local filesystem.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Public blog homepage
│   ├── posts/[slug]/            # Post detail page
│   ├── admin/
│   │   ├── page.tsx             # Admin dashboard
│   │   ├── login/               # Login page
│   │   ├── posts/               # Posts CRUD (list / new / edit)
│   │   ├── categories/          # Categories CRUD
│   │   └── tags/                # Tags CRUD
│   └── api/upload/              # Image upload API route
├── components/
│   ├── admin/                   # Admin UI components
│   └── public/                  # Public UI components
├── lib/
│   ├── api.ts                   # API client (posts, categories, tags, auth)
│   ├── auth.tsx                 # Auth context & provider
│   └── utils.ts                 # Utility functions
└── types/                       # TypeScript type definitions
```

## Admin Panel

Accessible at `/admin` — requires admin login (JWT-based authentication).

### Features

- **Dashboard** — overview of posts, categories, and tags
- **Posts** — create, edit, and delete posts with a Markdown editor
- **Categories** — manage blog categories (inline CRUD)
- **Tags** — manage blog tags (inline CRUD)
- **Image Upload** — drag & drop image upload or paste an external URL

## License

MIT
