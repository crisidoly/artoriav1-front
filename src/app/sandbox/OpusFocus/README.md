# OpusFocus

A minimalist task manager designed to help you focus on your work.

## Features

- Add and manage tasks
- Mark tasks as completed
- Simple, elegant dark mode design
- Built with Tailwind CSS and Lucide React (simulated for this sandbox environment)

## Technical Stack

- **Database (Simulated):** Prisma (schema provided, local storage used for frontend demo)
- **Frontend:** HTML, JavaScript, Tailwind CSS, Lucide React (static assets for sandbox)

## Setup (Sandbox Environment)

1.  **Clone this project:** (Not applicable in this direct file creation scenario)
2.  **Install dependencies:** `npm install` (requires Node.js)
3.  **Build Tailwind CSS:** `npm run tailwind:build`
4.  **Start the application:** `npm start` (uses `live-server` for a quick local server)

## Prisma Schema

The `prisma/schema.prisma` file defines the `Task` model:

prisma
model Task {
  id          String    @id @default(uuid())
  title       String
  isCompleted Boolean   @default(false)
  createdAt   DateTime  @default(now())
}
