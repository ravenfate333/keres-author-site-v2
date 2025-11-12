import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import the hook
import { PortableText } from '@portabletext/react';
import sanityClient from '../sanityClient';
import BookCard from '../components/BookCard';
import type { Book } from '../types';

const SeriesPage = () => {
  const { slug } = useParams(); // Get the slug from the URL (e.g., "cracked-coffins")
  const [books, setBooks] = useState<Book[] | null>(null);
  // We can also store the series title
  const [seriesTitle, setSeriesTitle] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [seriesDescription, setSeriesDescription] = useState<any[] | null>(null);

  useEffect(() => {
    if (!slug) return;
    // Items to be rendered on site
    const query = `*[_type == "series" && slug.current == $slug][0]{
      title,
      "genres": genres[]->title,
      description,
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
    sanityClient
      .fetch(query, params)
      .then((data) => {
        if (data) {
          setSeriesTitle(data.title);
          setGenres(data.genres ?? []);
          setSeriesDescription(data.description ?? '');
          setBooks(data.books);
        }
      })
      .catch(console.error);
  }, [slug]);

  // How books are rendered on page
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-8">{seriesTitle}</h1>

      {genres?.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-2 mb-6">
          {genres.map((g) => (
            <li
              key={g}
              className="px-3 py-1 text-sm uppercase tracking-wide rounded-full
                   border border-red-900/50 bg-red-950/30 text-red-200
                   shadow-[0_0_10px_rgba(255,0,0,0.2)]"
            >
              {g}
            </li>
          ))}
        </ul>
      )}

      {seriesDescription && (
        <div className="prose prose-invert mx-auto mb-10 text-center">
          <PortableText value={seriesDescription} />
        </div>
      )}

      <div className="space-y-12">
        {books && books.map((book) => <BookCard key={book._id} book={book} />)}
      </div>
    </div>
  );
};

export default SeriesPage;
