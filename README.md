# GlobalLodge 🏠

A full-stack lodging marketplace built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **EJS** templates, styled with **Tailwind/Custom CSS**. It lets users browse, search, filter by category, view details, authenticate, and manage their own listings & reviews.

---

## 📽️ Demo

[▶️ Watch the demo](https://drive.google.com/drive/folders/1Q9m4qcA15gycXZxRbvN3lIx_Zhlxa0-C?usp=drive_link)

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
├─ controllers/
├─ init/
├─ models/
├─ public/
├─ routes/
├─ utils/
├─ views/
├─ .env
├─ app.js
├─ cloudConfig.js
├─ middleware.js
├─ schema.js
├─ package.json
└─ README.md
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites

* Node.js **v18+**
* MongoDB (local or Atlas)
* Cloudinary account

---

### 2. Clone & install

```bash
git clone <your-repo-url>
cd GlobalLodge
npm install
```

---

### 3. Configure Environment

Create a `.env` file:

```env
CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MAP_TOKEN=

ATLASDB_URL=

SECRET=
```

---

### 4. Run the app

```bash
npm run dev
# or
npm start
```

Visit: http://localhost:3000

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

---

### Reviews

| Method | Path                         | Description   |
| -----: | ---------------------------- | ------------- |
|   POST | `/listings/:id/reviews`      | Add review    |
| DELETE | `/listings/:id/reviews/:rid` | Delete review |

---

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

```bash
node init/index.js
```

---

## 🚀 Deployment

* Render / Railway / Fly.io
* Add environment variables
* Start command: `npm start`

---

## 🔐 Security

* helmet
* Strong SECRET
* Joi validation
* Cloudinary limits

---

## 📄 License

MIT License

---

## 📬 Contact

* Author: Aman Shrivastav
* Email: [saurbhsrivastv6@gmail.com](mailto:saurbhsrivastv6@gmail.com)
