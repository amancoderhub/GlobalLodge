# GlobalLodge 🏠

A full‑stack lodging marketplace built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **EJS** templates, styled with **Tailwind/Custom CSS**. It lets users browse, search, filter by category, view details, authenticate, and manage their own listings & reviews.

---

## 📽️ Demo

[![Watch the demo](https://drive.google.com/drive/folders/1Q9m4qcA15gycXZxRbvN3lIx_Zhlxa0-C?usp=drive_link)]

> Replace `YOUR_VIDEO_LINK_HERE` with the link to demo video.

---

## ✨ Features

* **User Authentication**: Register, login, and manage sessions.
* **Listings CRUD**: Create, read, update, and delete stays.
* **Reviews System**: Add, edit, and delete reviews for listings.
* **Category Filter & Search**: Browse listings by category or keyword.
* **Responsive UI**: EJS layouts + Tailwind/Custom CSS.
* **Flash Messages**: Success/error notifications.
* **Cloudinary Integration**: Image upload and storage.
* **Error Handling**: Custom `ExpressError` + async wrapper.

---

## 🧱 Tech Stack

* **Server**: Node.js, Express
* **Views**: EJS (layouts, includes, partials)
* **Database**: MongoDB with Mongoose ODM
* **Auth**: Passport.js / Session-based
* **Styling**: TailwindCSS & custom CSS
* **Image Hosting**: Cloudinary
* **Utilities**: dotenv, method-override, express-session, connect-mongo

---

## 📁 Project Structure

```bash
GlobalLodge/
├─ controllers/       # Controller logic (listings, reviews, users)
├─ init/              # Initial data scripts
├─ models/            # Mongoose models (Listing, Review, User)
├─ public/            # Static files (CSS, JS)
├─ routes/            # Express route files
├─ utils/             # Helpers (ExpressError, wrapAsync)
├─ views/             # EJS templates
│  ├─ includes/       # Partials (navbar, footer, flash)
│  ├─ layouts/        # Layout boilerplate
│  ├─ listings/       # Listing pages (index, new, edit, show)
│  ├─ users/          # User pages (login, signup)
│  └─ error.ejs       # Error page
├─ .env               # Environment variables
├─ app.js             # Main app setup
├─ cloudConfig.js     # Cloudinary config
├─ middleware.js      # Custom middlewares
├─ schema.js          # Joi validation schemas
├─ package.json       # NPM dependencies & scripts
└─ README.md          # Project documentation
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites

* Node.js **v18+** and npm
* MongoDB (local or Atlas)
* Cloudinary account (for image hosting)

### 2. Clone & install

```bash
git clone <your-repo-url>
cd GlobalLodge
npm install
```

### 3. Configure Environment

Create a `.env` file:
```dotenv
PORT=3000
MONGODB_URI=mongodb://localhost:27017/globallodge
SESSION_SECRET=super-secret-key

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_KEY=your-key
CLOUDINARY_SECRET=your-secret
```

### 4. Run the app

```bash
npm run dev   # nodemon (dev)
# or
npm start     # production
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 🧭 Routes Overview

### Listings

| Method | Path                 | Description          |
| -----: | -------------------- | -------------------- |
|    GET | `/listings`          | Browse listings      |
|    GET | `/listings/new`      | New listing form     |
|   POST | `/listings`          | Create listing       |
|    GET | `/listings/:id`      | Show listing details |
|    GET | `/listings/:id/edit` | Edit listing form    |
|    PUT | `/listings/:id`      | Update listing       |
| DELETE | `/listings/:id`      | Delete listing       |

### Reviews

| Method | Path                         | Description   |
| -----: | ---------------------------- | ------------- |
|   POST | `/listings/:id/reviews`      | Add review    |
| DELETE | `/listings/:id/reviews/:rid` | Delete review |

### Users

| Method | Path      | Description   |
| -----: | --------- | ------------- |
|    GET | `/login`  | Login form    |
|   POST | `/login`  | Login         |
|    GET | `/signup` | Signup form   |
|   POST | `/signup` | Register user |
|   POST | `/logout` | Logout        |

---

## 🌱 Seed Data

Populate the DB with sample listings:

```bash
node init/index.js
```

---

## 🚀 Deployment

* Use **Render / Railway / Fly.io** for backend deployment.
* Add environment variables in dashboard.
* Start command: `npm start`.

---

## 🔐 Security

* `helmet` for HTTP headers
* Strong `SESSION_SECRET`
* Joi validation schemas (`schema.js`)
* Cloudinary file size/type limits

---

## 🤝 Contributing

1. Fork & clone repo
2. Create feature branch
3. Commit & push
4. Open PR

---

## 📄 License

MIT License

---

## 📬 Contact

* Author: Your Name
* Email: [you@example.com](mailto:you@example.com)
* Repo: [GlobalLodge](https://github.com/yourusername/GlobalLodge)
