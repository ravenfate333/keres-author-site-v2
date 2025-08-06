import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../sanityClient';
import type { Book } from '../types';

// Define a new type for a Series that includes its books
interface SeriesWithBooks {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  books: Book[];
}

interface AllBooksData {
  series: SeriesWithBooks[];
  standalones: Book[];
}

const AllBooksPage = () => {
  const [allBooksData, setAllBooksData] = useState<AllBooksData | null>(null);

  useEffect(() => {
    const query = `
      {
        "series": *[_type == "series"]{
          _id,
          title,
          slug,
          "books": *[_type == "book" && references(^._id)] | order(bookNumber asc){
            _id,
            title,
            slug,
            coverImage{
              asset->{
                url
              }
            }
          }
        },
        "standalones": *[_type == "book" && !defined(series)]{
            _id,
            title,
            slug,
            coverImage{
              asset->{
                url
              }
            }
        }
      }
    `;

    sanityClient.fetch(query)
      .then((data) => setAllBooksData(data))
      .catch(console.error);
  }, []);

  if (!allBooksData) {
    return <div>Loading all books...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-12">All Books</h1>

      {/* --- Render Each Series --- */}
      {allBooksData.series.map((series) => (
        <section key={series._id} className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">{series.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {series.books.map((book) => (
              <Link to={`/series/${series.slug.current}`} key={book._id}>
                <img 
                  src={book.coverImage?.asset.url} 
                  alt={`Cover for ${book.title}`}
                  className="rounded-md shadow-lg hover:scale-105 transition-transform duration-200"
                />
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* --- Render Standalone Books --- */}
      {allBooksData.standalones.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Standalones</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allBooksData.standalones.map((book) => (
              <Link to={`/books/${book.slug?.current}`} key={book._id}>
                 <img 
                  src={book.coverImage?.asset.url} 
                  alt={`Cover for ${book.title}`}
                  className="rounded-md shadow-lg hover:scale-105 transition-transform duration-200"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default AllBooksPage;