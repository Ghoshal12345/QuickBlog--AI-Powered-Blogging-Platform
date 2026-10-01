# QuickBlog --- AI-Powered Blogging Platform

A full-stack blogging platform built with the MERN stack, featuring
AI-assisted writing, secure authentication, rich-text editing, image
uploads, and an admin dashboard.

> **Project status:** Core blogging, authentication, AI-writing, and
> moderation features are implemented. Redis caching and background-job
> processing are planned future enhancements, not current features.

## ✨ Features

### ✍️ Blogging and content creation

-   Create, edit, delete, and manage blog posts.
-   Save posts as drafts or publish them.
-   Write and format content with the Quill rich-text editor.
-   Upload blog images through ImageKit.
-   Organize posts with categories.
-   Generate blog content with the Groq API.

### 🔐 Authentication and account management

-   JWT-based authentication using cookies.
-   Google OAuth sign-in.
-   Email OTP verification during registration.
-   OTP-based password recovery.
-   Protected routes and role-based access control.
-   User profile management, including profile image updates.
-   Email-change verification and account-management flows.

### 🛡️ Administration and moderation

-   Admin dashboard with platform statistics.
-   Manage blog posts.
-   Review and moderate comments.
-   Protected admin functionality.

### 💬 Comments and user experience

-   Comment management and moderation workflows.
-   Personal dashboard for managing your own blogs.
-   Responsive interface with loading states, notifications, and
    animated interactions.

## 🧰 Tech Stack

  Area               Technologies
  ------------------ ------------------------------------------
  Frontend           React, Vite, Tailwind CSS, Redux Toolkit
  Backend            Node.js, Express.js
  Database           MongoDB, Mongoose
  Authentication     JWT, cookies, Google OAuth
  AI                 Groq API
  Rich-text editor   Quill
  Image hosting      ImageKit
  Email delivery     Resend
  API testing        Postman

## 🖼️ Screenshots

Add real screenshots from your running application to
`docs/screenshots/`, then uncomment and update the image paths below.

```{=html}
<!--
### Home page
![QuickBlog home page](docs/screenshots/home.png)

### Blog editor
![QuickBlog blog editor](docs/screenshots/editor.png)

### Admin dashboard
![QuickBlog admin dashboard](docs/screenshots/admin-dashboard.png)

### Authentication
![QuickBlog authentication](docs/screenshots/login.png)
-->
```
Suggested screenshots: home page, blog detail page, editor with AI
generation, user dashboard, and admin dashboard. Use screenshots of your
actual app rather than mockups.

## 🏗️ Project Structure

This README assumes the repository has separate `client` and `server`
directories. Adjust the paths if your actual repository uses different
names.

``` text
QuickBlog/
├── client/             # React + Vite frontend
│   ├── src/
│   └── package.json
├── server/             # Express API and backend services
│   ├── ...
│   └── package.json
├── .gitignore
└── README.md
```

## 🚀 Run Locally

### 1. Prerequisites

Install: - Node.js (LTS recommended) - npm - A MongoDB database (local
MongoDB or MongoDB Atlas)

You will also need credentials for the external services used by the
features you enable: Google OAuth, ImageKit, Groq, and Resend.

### 2. Clone the repository

``` bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd QuickBlog
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the actual repository URL.

### 3. Configure the backend

Go to the backend directory and install dependencies:

``` bash
cd server
npm install
```

Create a `.env` file in the backend directory. Use the backend example
environment file as a reference and set the values for your environment:

``` env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_long_random_secret
CLIENT_URL=http://localhost:5173

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=replace_with_a_strong_password

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
GOOGLE_CLIENT_ID=your_google_client_id
```

Do not commit your real `.env` file or any API keys. Use strong, unique
values for admin credentials and JWT secrets. Keep variable names
aligned with the backend code and your supplied environment example.

Start the backend using the script defined in `server/package.json`, for
example:

``` bash
npm run dev
```

If your project uses a different script, run the corresponding script
listed in `package.json`.

### 4. Configure the frontend

Open a second terminal:

``` bash
cd client
npm install
```

Create `client/.env`:

``` env
VITE_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Vite exposes variables prefixed with `VITE_` to browser code. **Never
put private keys, database credentials, or server secrets in frontend
environment variables.**

Start the frontend:

``` bash
npm run dev
```

Open the local URL printed by Vite, commonly `http://localhost:5173`.

### 5. Configure third-party services

-   **MongoDB:** Create a database and use its connection string in
    `MONGO_URI`.
-   **Google OAuth:** Configure the authorized JavaScript origin for
    your local frontend and use the client ID expected by both frontend
    and backend.
-   **ImageKit:** Set the public key, private key, and URL endpoint on
    the backend.
-   **Groq:** Create an API key and set `GROQ_API_KEY` on the backend.
-   **Resend:** Configure the API key and verify the sender/domain as
    required by your Resend account.

Some features will not work until their corresponding service is
configured correctly.

## 🔑 Environment Variables

### Backend

  Variable                  Purpose
  ------------------------- ----------------------------------------
  `PORT`                    Backend server port
  `MONGO_URI`               MongoDB connection string
  `JWT_SECRET_KEY`          Secret used for signing/verifying JWTs
  `CLIENT_URL`              Frontend origin used by the backend
  `ADMIN_EMAIL`             Admin account email/configuration
  `ADMIN_PASSWORD`          Admin account password/configuration
  `IMAGEKIT_PUBLIC_KEY`     ImageKit public key
  `IMAGEKIT_PRIVATE_KEY`    ImageKit private key --- keep secret
  `IMAGEKIT_URL_ENDPOINT`   ImageKit media endpoint
  `GROQ_API_KEY`            Groq API key --- keep secret
  `RESEND_API_KEY`          Resend API key --- keep secret
  `GOOGLE_CLIENT_ID`        Google OAuth client ID

### Frontend

  Variable                  Purpose
  ------------------------- -----------------------------------------
  `VITE_BASE_URL`           Backend API base URL
  `VITE_GOOGLE_CLIENT_ID`   Google OAuth client ID for the frontend

## 🔒 Security Notes

-   Never commit `.env` files, access tokens, or private API keys.
-   Replace example admin credentials before running the application.
-   Use a strong, unique JWT secret.
-   Configure production CORS origins and OAuth redirect/origin settings
    explicitly.
-   Keep private service credentials on the backend only.
-   Validate authentication and authorization behavior before deploying
    publicly.

## 🧪 Testing

Use Postman or your preferred API client to verify authentication, blog
CRUD, comment workflows, and admin-only endpoints. Add automated unit
and integration tests as the project evolves.

## 🛣️ Roadmap

Potential next improvements: - Redis caching for frequently accessed
blog data. - Cache invalidation when posts are updated or deleted. -
BullMQ background jobs for email and other long-running tasks. -
Automated API tests and GitHub Actions CI. - Structured logging,
monitoring, and performance metrics. - Advanced search and blog
analytics.

These are planned improvements; only describe them as implemented after
they are working in the repository.

## 🤝 Contributing

Contributions and suggestions are welcome. For substantial changes, open
an issue first to discuss what you would like to improve.

## 📄 License

No license has been specified yet. Add a `LICENSE` file before
presenting this repository as open source.

------------------------------------------------------------------------

Built as a full-stack project to explore modern web development,
authentication, AI-assisted content creation, and application
administration.
