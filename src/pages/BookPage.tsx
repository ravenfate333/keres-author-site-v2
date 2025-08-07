import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sanityClient from '../sanityClient';
import BookCard from '../components/BookCard';
import type { Book } from '../types';

const BookPage = () => {
  const { slug } = useParams(); // Get the book's slug from the URL
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    if (!slug) return;

    const query = `*[_type == "book" && slug.current == $slug][0]{
        ..., // Keep the spread operator to get all top-level fields
        coverImage{
          asset->{ // But explicitly "follow" the asset reference to get the URL
            url
          }
        },
        // Combined list of genres
        "genres": (
            coalesce(genres[]->, []) + coalesce(series->genres[]->, [])
        )
    }`;
    const params = { slug };

    sanityClient.fetch(query, params)
      .then((data) => setBook(data))
      .catch(console.error);
  }, [slug]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      {/* Conditional render. If there's a book, show it. */}
      {book ? (
        <BookCard book={book} />
      ) : (
        <p className="text-white">Loading book...</p> // Or show a loading message
      )}
    </div>
  );
};

export default BookPage;