# CMS-Driven MERN Developer Portfolio

Professional portfolio built with React, Vite, Express, MongoDB Atlas, Mongoose, JWT admin auth, Multer uploads, and a full CMS admin dashboard.

## What Is Dynamic

All public portfolio content now comes from MongoDB APIs instead of hardcoded frontend profile data:

- Hero / profile
- About
- Skills
- Experience
- Education
- Certifications
- Projects
- Resume PDF
- Social links
- Contact info
- Achievements
- Tech stack
- Testimonials
- Site settings and SEO metadata

## New Backend Structure

- `backend/models/index.js`: Mongoose schemas for `HeroProfile`, `About`, `Skill`, `Experience`, `Education`, `Certification`, `Resume`, `SocialLink`, `ContactInfo`, `Achievement`, `TechStack`, `Testimonial`, `SiteSetting`, plus existing `User`, `Project`, and `Message`.
- `backend/routes/cms.js`: CMS API layer.
- `backend/routes/upload.js`: Admin-protected profile image, project image, and resume PDF uploads.
- `backend/seed.js`: Seeds Hishamudin Hussain's portfolio content into MongoDB.

## API Structure

Public:

- `GET /api/cms/public`: full portfolio payload
- `GET /api/projects`: public project list
- `POST /api/messages`: contact form submission storage

Admin protected:

- `GET /api/cms/analytics`: projects, skills, experience, and contact submission counts
- `GET /api/cms/:section`: read CMS section
- `PUT /api/cms/:section`: update singleton sections such as `hero`, `about`, `resume`, `contactInfo`, `settings`
- `POST /api/cms/:section`: create list item
- `PUT /api/cms/:section/:id`: update list item
- `DELETE /api/cms/:section/:id`: delete list item
- `POST /api/upload/image`: upload profile/project image
- `POST /api/upload/images`: upload multiple project images
- `POST /api/upload/resume`: upload resume PDF

CMS section names: `hero`, `about`, `resume`, `contactInfo`, `settings`, `projects`, `skills`, `experience`, `education`, `certifications`, `socialLinks`, `achievements`, `techStack`, `testimonials`.

## Frontend Structure

- `frontend/src/pages/Portfolio.jsx`: fetches `/api/cms/public` once and passes CMS content into sections.
- `frontend/src/pages/AdminDashboard.jsx`: sidebar CMS dashboard with CRUD pages and analytics.
- `frontend/src/utils/cms.js`: navigation, skill grouping, social lookup, and dynamic SEO helpers.
- `frontend/src/components/sections/*`: public sections render from CMS props.

## Run Locally

Backend:

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Required backend `.env` values:

```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=replace_with_a_long_secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
ADMIN_EMAIL=your_email@example.com
```

Seed CMS content:

```bash
cd backend
node seed.js
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Admin is at `http://localhost:5173/admin`.

Default seeded admin, when no admin already exists:

- Email: value of `ADMIN_EMAIL`, or `admin@portfolio.dev`
- Password: `admin123456`

Change this before production.

## Deployment

Render backend:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `node server.js`
- Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `BACKEND_URL`, optional email vars.

Vercel frontend:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL=https://your-render-backend.onrender.com/api`

After deployment, run `node seed.js` once against the production MongoDB connection or create content through `/admin`.
