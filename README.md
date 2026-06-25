# Art Hub - Client (Frontend) 🎨

Art Hub is a modern, premium marketplace platform built specifically for artists and art collectors. The frontend is built using Next.js and Tailwind CSS, featuring a beautiful glassmorphic UI, dynamic bento-grid layouts, and a fully integrated Stripe payment system.

## 🚀 Live Demo
[Deployed on Vercel](https://art-hub-client.vercel.app/)

## ✨ Key Features
- **Modern UI/UX:** Premium glassmorphic design with subtle micro-animations and a dark/light mode toggle.
- **Bento Grid Discoverability:** A stunning homepage layout for exploring featured artworks and top artists.
- **Role-Based Dashboards:** 
  - **Collectors:** Track purchase history and upgrade subscription tiers.
  - **Artists:** Upload new artworks, track sales, and manage their portfolio.
  - **Admins:** Oversee users and manage the platform.
- **Seamless Payments:** Integrated with Stripe Checkout for secure 1-click purchases.

## 🛠️ Tech Stack
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS + Vanilla CSS (for custom animations)
- **Icons:** Lucide React
- **Payments:** Stripe
- **Image Hosting:** ImgBB API

## 💻 Local Development

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/mahmudul194/Art-Hub-client.git
   cd client
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key_here
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.
