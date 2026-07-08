# KOKODA - Lost & Found Web Application

**Live Demo**: [https://kokoda-dyg6f8dhgghbang2.southeastasia-01.azurewebsites.net/](https://kokoda-dyg6f8dhgghbang2.southeastasia-01.azurewebsites.net/)
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Inertia.js](https://img.shields.io/badge/Inertia.js-9553E9?style=for-the-badge&logo=Inertia&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

KOKODA is a modern university proof-of-concept web application designed to connect people who have lost items with those who have found them. Built with a robust backend using **Laravel 12** and a dynamic frontend powered by **React**, **Inertia.js**, and **Tailwind CSS**.

## 🚀 Key Features

- **Lost & Found Marketplace:** Create detailed posts for lost or found items. Posts include images, descriptions, categories, and location data.
- **Robust Claim System:** An integrated workflow allows users to submit claims for found items or notify owners of lost items. The claim workflow tracks statuses (`pending`, `accepted`, `rejected`, `resolved`).
- **Location-Based Search:** Utilize radius-based location filtering with coordinate tracking (latitude & longitude) to find items lost or found nearby.
- **Real-time Chat:** Communicate instantly with other users regarding claims or posts. Powered by Laravel Reverb and Echo for seamless WebSocket interactions, including text, image sending, and read receipts.
- **Leaderboard & Gamification:** Engage the community by rewarding points for returning items, complete with a leaderboard displaying top users.
- **User Profiles & History:** Comprehensive profile pages tracking a user's active posts, incoming requests, sent claims, and transaction history.
- **Comments & Ratings:** Users can leave comments on posts and rate their transaction experience.
- **Multi-language Support:** Easily switch between English (EN), Indonesian (ID), and Japanese (JA).

## 🛠️ Technology Stack

- **Backend:** Laravel 12 (PHP 8.2+), Laravel Sanctum (Authentication)
- **Frontend:** React 18, Inertia.js, Tailwind CSS
- **Real-time Engine:** Laravel Reverb, Laravel Echo, Pusher JS
- **Database:** SQLite (default for local development)
- **Tooling:** Vite, Composer, NPM

## 🎨 Design System & Colors

The application uses a warm, welcoming palette defined via Tailwind CSS:

- **Primary:** `#F4C799` (Warm tan/beige)
- **Secondary:** `#C0976C` (Brownish)
- **Highlight:** `#FFE7A3` (Light yellow)
- **Label Found:** `#5D8CAD` (Blue)
- **Label Lost:** `#D56666` (Red)
- **Base:** `#FEFEFE` (Off-white)
- **Tertiary:** `#311A05` (Dark brown - for text)
- **Fonts:** Quicksand (Headers & Menus), Roboto (Body Text)

## 🗄️ Database Schema & Models

- `User`: Handles authentication and profiles.
- `Post`: The core model for lost/found items.
- `Location`: Manages the geolocation coordinates attached to posts.
- `Claim`: Tracks the ownership requests and their lifecycles between the `claimant` and the `owner`.
- `Comment`: Allows users to discuss posts.
- `Conversation` & `Message`: Handles the real-time chat infrastructure.
- `Rating`: Manages feedback left after a claim is resolved.

## ⚙️ Setup & Installation Guide

To get KOKODA running on your local machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/KOKODA-JOYSM/KOKODA-web
cd KOKODA-web
```

### 2. Install PHP and Node.js Dependencies
```bash
composer install
npm install
```

### 3. Environment Configuration
Duplicate the `.env.example` file and rename it to `.env`:
```bash
cp .env.example .env
```
Generate the application key:
```bash
php artisan key:generate
```

### 4. Database Setup (SQLite)
Create an empty SQLite database (if it doesn't exist) and run the migrations with sample data:
```bash
touch database/database.sqlite
php artisan migrate --seed
```

### 5. Storage Link
Link the storage directory to make uploaded images publicly accessible:
```bash
php artisan storage:link
```

### 6. Start the Development Servers
KOKODA utilizes Laravel Reverb for WebSockets and Vite for frontend bundling. You can start all required services concurrently using the setup command provided in `composer.json` or by running:

```bash
composer run dev
```

Alternatively, you can run them manually in separate terminal tabs:
```bash
# Terminal 1: Laravel Backend
php artisan serve

# Terminal 2: Vite Frontend
npm run dev

# Terminal 3: Laravel Reverb (WebSockets)
php artisan reverb:start --debug

# Terminal 4: Queue Listener (For asynchronous tasks)
php artisan queue:listen
```

## 🧪 Testing the Application

Once the servers are running, access the application at `http://localhost:8000`.

- **Test Account:** `admin@gmail.com` / `admin`
- **Mainpage:** `http://localhost:8000/home`
- **Profile/Requests:** `http://localhost:8000/profile`

---
