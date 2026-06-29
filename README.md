# ArtHub - Client (Frontend)

ArtHub is a modern, premium web platform connecting talented artists with passionate art collectors. The frontend is built with **Next.js**, styled with **Tailwind CSS**, and fully responsive with support for beautiful dark and light themes.

## 🚀 Key Features & Functionalities

### 🎨 For Artists
- **Dedicated Dashboard**: Manage your portfolio and track sales in one centralized location.
- **Artwork Uploads**: Upload high-quality images of your artwork (integrated with Cloudinary).
- **Subscription Tiers**: Different tiers (Free, Pro, Premium) that limit the number of artwork uploads to help scale your business.
- **Sales Tracking**: View payment history and manage sold out items.

### 🖼️ For Collectors (Users)
- **Interactive Gallery**: Browse thousands of original artworks with a beautiful, masonry-style grid layout.
- **Secure Purchases**: Buy artwork securely using **Stripe** payment integration.
- **Collector Dashboard**: Track your purchase history and discover top artists.
- **Seamless Authentication**: Log in quickly using Email/Password or **Google OAuth** (includes automated role selection for new users).

### 🛡️ For Administrators
- **Admin Dashboard**: Manage all users on the platform.
- **Role Management**: Promote users to artists or admins, and enforce community guidelines.

### ✨ UI / UX Highlights
- **Stunning Animations**: Smooth micro-interactions and page transitions powered by **Framer Motion**.
- **Dark Mode Support**: Flawless integration of `next-themes` allowing users to toggle between Light and Dark modes.
- **Premium Aesthetic**: Glassmorphism effects, vibrant gradient blurs, and modern typography (`Outfit` and `Inter` fonts).
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewports.

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: JWT & `@react-oauth/google`
- **Payments**: Stripe Elements
- **HTTP Client**: Axios

## ⚙️ Getting Started

### Prerequisites
Make sure you have Node.js and npm installed.

### Environment Variables
Create a `.env.local` file in the root of the client directory and add the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment
The client is optimized to be easily deployed on [Vercel](https://vercel.com). Simply link your GitHub repository to Vercel and ensure all environment variables are added in the Vercel project settings.
