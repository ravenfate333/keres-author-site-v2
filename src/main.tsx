import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css'; // Tailwind styles

// --- Components and Pages ---
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SeriesPage from './pages/SeriesPage';
import BookPage from './pages/BookPage';
import AboutPage from './pages/AboutPage';
import AllBooksPage from './pages/AllBooksPage';
// import ContactPage from './pages/ContactPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'series/:slug', element: <SeriesPage /> },
      { path: 'books/:slug', element: <BookPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'books', element: <AllBooksPage /> },
      // { path: 'contact', element: <ContactPage /> },
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);