# AlumniConnect

A working Next.js alumni management system with:

- Sign in and registration
- Role dashboards for admin, alumni, and students
- Alumni directory and mentor requests
- Jobs and events management
- Messages and notifications
- A local JSON database used by the backend API routes
- Empty live data tables by default, with no demo alumni, jobs, events, messages, or mentorships

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Default accounts

The only seeded account is the admin account:

```text
password123
```

- Admin: `admin@university.edu`

Create alumni and student accounts from the registration page. New users, jobs, events, applications, registrations, mentorships, saved jobs, and messages are stored in the local JSON database.

## Backend and database

The app now includes real backend endpoints at `/api/...` using Next.js route handlers.
Data is saved to:

```text
backend/database/db.json
```

If the file does not exist, the app automatically creates it from the seed data on the first API request. Delete `backend/database/db.json` to reset the local database.

The existing SQL schema is still available at `backend/database/schema.sql` if you later want to migrate the same entities to MySQL.
