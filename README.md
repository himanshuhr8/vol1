# Music Room 🎶🗳️

Collaborative song queue web application built with Next.js, TypeScript, Prisma, PostgreSQL, and React Query.

## 🧩 Features

- ➕ **Add Songs** via YouTube URLs
- 🗳️ **Vote on Songs** in the queue (upvote & downvote)
- ▶️ **Auto-Play** the highest-voted track and remove it after playing
- 📜 **Playback History** stored in the backend for future insights
- ⚡ **Optimistic UI & Caching** with React Query
- 🔒 **Simple Authentication** (Email/Password)
- 🎨 **Modern UI** built with Tailwind CSS

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/himanshuhr8/vol1.git
cd vol1/app
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Configure environment variables

Create a `.env.local` file in the `app` folder and add:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
NEXT_PUBLIC_YOUTUBE_API_KEY=your-youtube-api-key
NEXTAUTH_SECRET=some-random-secret
```

> Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE_NAME` with your PostgreSQL credentials.

### 4. Apply database migrations

```bash
npx prisma migrate dev --name init
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📁 Project Structure

```
app/                       # Next.js App Router routes and API handlers
├── api/                   # REST endpoints for songs, votes, and playback
│   ├── songs/             # CRUD operations for the song queue
│   └── history/           # Endpoints for fetching playback history
├── components/            # Reusable UI components (buttons, cards, modals)
├── hooks/                 # Custom React hooks (useSongs, useVotes, useHistory)
├── lib/                   # Utility modules (Prisma client, YouTube embed helper)
└── pages/                 # Legacy pages (if any)

prisma/                    # Prisma schema and migrations
  └── schema.prisma

public/                    # Static assets (icons, images)

styles/                    # Global styles & Tailwind config

README.md                  # Project documentation
```

---

## 🛠️ Built With

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🙋‍♂️ Author

Made with ❤️ by Himanshu Raj  
[LinkedIn](https://www.linkedin.com/in/himanshu-raj-1053a4260/) ・ [Portfolio](https://hima31.vercel.app/)
