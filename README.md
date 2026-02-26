# Smart Parking Lot System

A complete Smart Parking Lot System built as a React (Vite) single-page application.
This project implements a clean, responsive UI with no heavy UI frameworks, using only basic CSS and React hooks.

## Features
- **Add Parking Slot:** Add new slots with specific numbers, covered status, and EV charging support.
- **View All Slots:** See all slots in a clean table view, sorted by slot number ascending, with clear status badges.
- **Park Vehicle:** An intelligent allocation system that finds the nearest available slot matching your requirements (EV charging, covered parking).
- **Remove Vehicle:** Free up an occupied slot by its exact number.

## Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

## Setup Instructions
1. Clone the repository or download the source code.
2. Navigate to the project directory:
   ```bash
   cd "Smart Parking Lot System"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

## Deployment to Vercel
This Vite + React project is ready to be deployed to Vercel in just a few clicks:

### Method 1: Using Vercel CLI
1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```
2. Run `vercel` in the project root:
   ```bash
   vercel
   ```
3. Follow the prompts to deploy.

### Method 2: Using the Vercel Dashboard (GitHub)
1. Push your project to a GitHub repository.
2. Log in to [Vercel](https://vercel.com).
3. Click "Add New..." -> "Project".
4. Import your GitHub repository.
5. Vercel will auto-detect Vite. The default build settings (`npm run build`, `dist` output folder) are correct.
6. Click "Deploy".

## Sample Data for Testing
For testing the allocation logic, try adding the following slots:
- Slot 1 (Covered: Yes, EV: No)
- Slot 2 (Covered: No, EV: Yes)
- Slot 3 (Covered: Yes, EV: Yes)

Then, try parking vehicles with different needs:
- Need EV: Yes, Need Cover: No -> Should allocate Slot 2 or 3
- Need EV: Yes, Need Cover: Yes -> Should allocate Slot 3
- Need EV: No, Need Cover: No -> Should allocate Slot 1 (nearest available)
