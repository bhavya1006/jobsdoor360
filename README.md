# JobsDoor360 Frontend

This is the frontend for JobsDoor360, a comprehensive platform for career exploration, job searching, and professional growth. It's built with a modern tech stack to provide a fast, responsive, and feature-rich user experience.

## About The Project

JobsDoor360 aims to be a one-stop solution for professionals. Core features include:

*   **Comprehensive Navigation**: Easy access to all major sections of the application.
*   **Job Listings**: A full-featured job board with search and filtering capabilities.
*   **Blog**: Insightful articles on career development, business, and well-being.
*   **Mock Authentication**: A simple sign-up and sign-in system to demonstrate user account functionality.
*   **Career Tools**: Placeholder pages for future features like a Profile Analyzer and Assessments.

## Tech Stack

This project is built using a curated set of modern web technologies:

*   [Next.js](https://nextjs.org/) - React framework for production.
*   [React](https://react.dev/) - A JavaScript library for building user interfaces.
*   [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
*   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
*   [ShadCN UI](https://ui.shadcn.com/) - Re-usable UI components.
*   [Genkit](https://firebase.google.com/docs/genkit) - For integrating AI-powered features.
*   [Lucide React](https://lucide.dev/) - For icons.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.
*   npm
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/your_username_/your_project_name.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```

### Running the Application

To run the app in development mode, use the following command. This will start the development server, typically on `http://localhost:9002`.

```sh
npm run dev
```

The app uses Turbopack for faster development builds. You can now view the application in your browser.

### Static Export

This project is configured to generate a static export that can be deployed to any static hosting provider.

1. Generate the static build
   ```sh
   npm run export
   ```

2. Preview the static build locally
   ```sh
   npm run serve:static
   ```

3. Deploy the static files
   The static files will be in the `out` directory. You can deploy these files to any static hosting provider such as:
   - Vercel
   - Netlify
   - Firebase Hosting
   - GitHub Pages
   - AWS S3

#### Notes for Static Export
- All API routes have been removed as they're not compatible with static exports
- The application uses client-side Firebase for authentication and data fetching
- For local testing, Firebase emulators can be started with `firebase emulators:start`
