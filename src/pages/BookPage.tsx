import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import sanityClient from '../sanityClient';
import BookCard from '../components/BookCard'; // Reuse BookCard!
import type { Book } from '../types';

const BookPage = () => {
  const { slug } = useParams(); // Get the book's slug from the URL
  const [book, setBook] = useState<Book | null>(null);

useEffect(() => {
  if (!slug) return;

  const query = `*[_type == "book" && slug.current == $slug][0]{
      ..., // "..." translation: "give me all the existing book fields"
      // Combined list of genres
      "genres": (
          // "coalesce" prevents errors if a field doesn't exist
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
      {/* Conditional render. If we have a book, show it. */}
      {book ? (
        <BookCard book={book} />
      ) : (
        <p>Loading book...</p> // Or show a loading message
      )}
    </div>
  );
};

export default BookPage;