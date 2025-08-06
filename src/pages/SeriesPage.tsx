import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import the hook
import sanityClient from '../sanityClient';
import BookCard from '../components/BookCard';
import type { Book } from '../types';

const SeriesPage = () => {
  const { slug } = useParams(); // Get the slug from the URL (e.g., "cracked-coffins")
  const [books, setBooks] = useState<Book[] | null>(null);
  // We can also store the series title
  const [seriesTitle, setSeriesTitle] = useState('');

  useEffect(() => {
    if (!slug) return;
    // Items to be rendered on site
    const query = `*[_type == "series" && slug.current == $slug][0]{
      title,
      "books": *[_type == "book" && references(^._id)] | order(bookNumber asc){
        _id,
        title,
        slug,
        bookNumber,
        bookNumberLabel,
        coverImage{
          asset->{
            url
          }
        },
        blurb,
        retailerButtons,
        themeColor
      }
    }`;
    const params = { slug };

    // Data sets to fetch from Sanity
    sanityClient.fetch(query, params)
      .then((data) => {
        if (data) {
          setSeriesTitle(data.title);
          setBooks(data.books);
        }
      })
      .catch(console.error);
  }, [slug]);

  // How books are rendered on page
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-8">{seriesTitle}</h1>

      <div className="space-y-12">
        {books && books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default SeriesPage;