# Author Portfolio Site

A modern, responsive author website built with **Next.js (React)**, **Sanity v3**, and **Tailwind CSS**.  
This project is designed for scalability and reusability — ideal for single-author sites with basic to high site needs, but easily adaptable for other non-author clients.

---

## Features

- **Book Showcase** – Dynamic book pages populated from Sanity.
- **Blog/News Integration** – Manageable via the CMS.
- **Social Links Management** – Easily configurable in Sanity, reusable site-wide.
- **Responsive Design** – Mobile-first with Tailwind CSS.
- **Fast Build** – Optimized with Next.js and incremental static regeneration.
- **Customizable Theme** – Easily update brand colors and fonts.

---

## Navigation
TODO

## Author Page
TODO

## Books
TODO

## Social Links

This site uses a **singleton Sanity document** to manage social media links in one central location.

- **Sanity v3 Singleton** → Ensures only one `socialLinks` document exists.
- **Shared Config** → All platforms (Amazon, Instagram, etc.) are defined in `shared/platforms.ts` and used by both the CMS and the React app.
- **Dynamic Icons** → Icons come from [React Icons](https://react-icons.github.io/react-icons/) with support for brand colors or monochrome mode.
- **No Empty UI** → If no links are enabled in Sanity, the component won’t render.

> Adding a new platform only requires adding an entry to `shared/platforms.ts` — no changes needed in multiple files.

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS  
- **Backend/CMS:** Sanity v3 (Headless CMS)  
- **Icons:** React Icons  
- **Hosting:** TODO  
- **Data Fetching:** GROQ queries + Sanity Client
