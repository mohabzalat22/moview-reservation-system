# Movie Reservation System 🎬🍿

A modern, full-stack movie reservation system featuring a Netflix-inspired UI, robust admin management, and an interactive seat selection experience. Built as part of the [roadmap.sh Movie Reservation System Project](https://roadmap.sh/projects/movie-reservation-system).

## 🔗 Project Reference
This project was built to fulfill the requirements of the [roadmap.sh Movie Reservation System](https://roadmap.sh/projects/movie-reservation-system) challenge.

## 🚀 Tech Stack

This project is built using a modern JavaScript/TypeScript ecosystem, structured as a monorepo using **Turborepo**.

### Frontend (`apps/web`)
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/) components
- **Design:** Dark-themed, highly visual UI inspired by modern streaming platforms (Netflix)

### Backend (`apps/api`)
- **Server:** Node.js with [Express](https://expressjs.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** JWT (JSON Web Tokens) with secure refresh token rotation

## ✨ Features

### User Experience
- **Authentication:** Secure Sign-up and Login workflows.
- **Dynamic Showtimes:** Browse upcoming movies with a sleek, horizontally scrolling date filter.
- **Seat Selection:** Interactive UI to pick specific seats in designated hall sections (e.g., VIP, Standard).
- **Manage Reservations:** Users can view their upcoming tickets and cancel their own reservations if needed.

### Admin Dashboard
- **CRUD Management:** Full control over Movies, Genres, Halls, Sections, Seats, and Showtimes.
- **Reservation Tracking:** Oversee all user reservations, change reservation statuses (Pending, Confirmed, Cancelled).
- **Financial & Capacity Insights:** Dedicated dashboard for showtime statistics, calculating occupancy rates, and tracking revenue across different seating tiers.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (or any relational database supported by Prisma)

### Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <repository-url>
   cd movie-reservation-system
   npm install
   ```

2. **Environment Variables:**
   Create `.env` files in both `apps/api` and `apps/web` referencing `.env.example` configurations. You will need to provide your database URL and JWT secrets for the backend, and the API base URL for the frontend.

3. **Database Setup:**
   Navigate to the `apps/api` directory and run the Prisma migrations to set up your database schema.
   ```bash
   cd apps/api
   npx prisma migrate dev
   npx prisma db seed
   ```

4. **Run the Application:**
   From the root of the monorepo, start the development servers for both the frontend and backend simultaneously using Turborepo:
   ```bash
   npm run dev
   ```

   - **Frontend:** `http://localhost:3000`
   - **Backend API:** `http://localhost:4000/api`

## 📝 License
This project is open-source and available under the MIT License.
