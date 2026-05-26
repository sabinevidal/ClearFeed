# ClearFeed

ClearFeed is a parental media literacy tool that helps families identify manipulation patterns in YouTube videos. It uses AI to analyze content for psychological manipulation techniques and provides age-appropriate explanations so children can develop critical media literacy skills.

## Features

- **Video Analysis** — Submit YouTube URLs for AI-powered detection of manipulation patterns (clickbait, emotional manipulation, social pressure, etc.) using Google Gemini 2.0 Flash.
- **Parent Dashboard** — Manage child profiles, set content thresholds, review flagged videos, and approve or block content.
- **Learning Mode** — Watch analyzed videos with real-time educational annotations highlighting detected patterns.
- **Pattern Library** — Browse 49 manipulation patterns across 8 categories with psychology explanations, detection signals, and age-appropriate descriptions.
- **Video Library** — Role-based access where children see only approved videos and parents can manage the full queue.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL 16 + Prisma ORM
- **Auth:** NextAuth.js (credentials provider, JWT sessions)
- **AI:** Google Gemini 2.0 Flash
- **Styling:** Tailwind CSS
- **Containerization:** Docker + Docker Compose

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or Docker)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://clearfeed:clearfeed_dev@localhost:5432/clearfeed"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
```

### Running with Docker

The quickest way to get everything running:

```bash
docker compose up
```

This starts PostgreSQL and the app on `http://localhost:3000`.

### Running Locally

1. Install dependencies:

```bash
npm install
```

2. Start a PostgreSQL instance (or use the Docker Compose `db` service):

```bash
docker compose up db
```

3. Run database migrations and seed data:

```bash
npm run db:migrate
npm run db:seed
```

4. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed the database with patterns and demo users |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Authenticated pages
│   │   ├── analyze/        # Video analysis page
│   │   ├── dashboard/      # Parent dashboard
│   │   ├── learning/       # Learning mode with annotations
│   │   ├── library/        # Video library
│   │   └── patterns/       # Pattern library
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── children/       # Child profile management
│   │   ├── patterns/       # Pattern CRUD
│   │   └── videos/         # Video submission, analysis, review
│   └── login/              # Login page
├── components/             # React components by feature
├── lib/                    # Shared utilities (auth, db, gemini)
└── types/                  # TypeScript type definitions
prisma/
├── schema.prisma           # Database schema
├── seed.ts                 # Seed data (49 patterns + demo users)
└── migrations/             # Migration history
```

## Data Model

- **User** — Parents and children with a parent-child relationship
- **ChildProfile** — Age and content threshold (1–10 scale)
- **Video** — YouTube metadata, AI risk score, approval status
- **Pattern** — 49 manipulation patterns with categories, risk scores, and explanations
- **VideoPattern** — Detected patterns linked to specific videos with timestamps
- **ReviewAction** — Parent approve/block decisions with rationale

## How It Works

1. A user submits a YouTube URL.
2. The app fetches video metadata via YouTube's oEmbed API.
3. Gemini AI analyzes the video for manipulation patterns from the known pattern database.
4. Videos scoring ≤ 4 risk are auto-approved; higher-risk videos go to the parent review queue.
5. Parents can approve or block videos with an optional rationale.
6. Children access approved videos in Learning Mode with pattern annotations.

## License

Private project — not licensed for redistribution.
