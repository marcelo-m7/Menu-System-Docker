# Next.js Frontend Service

## Description
This service provides the user interface for the UAlg Cantina Weekly Menu System, built with Next.js and React. It consumes data from the Flask API.

## Technologies Used
- Next.js
- React
- JavaScript

## Dependencies
Project dependencies are managed with npm and listed in `package.json`.

## File Structure
- `Dockerfile`: (If you create one for the frontend)
- `package.json`: Project dependencies and scripts.
- `next.config.js`: Next.js configuration.
- `.env.local`: Environment variables for development (e.g., API URL).
- `app/`: (If using the app router) Root layout and potentially other global files.
- `pages/`: (If using the pages router) Application pages/routes.
  - `index.js`: Public weekly menu page.
  - `admin/login.js`: Admin login page.
  - `admin/dashboard.js`: Admin dashboard page (protected).
  - `register.js`: User registration page.
- `components/`: Reusable React components (e.g., `Layout.js`, forms).
- `context/`: React Context providers (e.g., `AuthContext.js`).
- `public/`: Static assets.
- `styles/`: Global styles or CSS modules.

## Configuration
The main configuration is the API URL, which is managed through the `NEXT_PUBLIC_API_URL` environment variable in `.env.local` (for development).

## Running Locally (Without Docker - for development)
1. Navigate to the `web/` directory.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
   The frontend should be available at `http://localhost:3000` (or the port specified in the Next.js config).

## Running with Docker Compose
The frontend service is included in the main `docker-compose.yml` file and can be built and run with `docker-compose build web` and `docker-compose up -d web`.

## Frontend Routes
(List the main routes provided by Next.js.)
- `/`: Public weekly menu.
- `/admin/login`: Admin login page.
- `/admin/dashboard`: Admin dashboard (protected route).
- `/register`: User registration page.

## API Interaction
The frontend interacts with the Flask API to fetch data (e.g., menu) and send data (e.g., login credentials, registration data).

## Authentication
Authentication state is managed using React Context (`AuthContext.js`) to protect admin routes.


-This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
-
-## Getting Started
-
-First, run the development server:
-
-
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
