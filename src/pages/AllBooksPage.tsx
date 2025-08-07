import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import sanityClient from '../sanityClient';
import type { Book } from '../types';
import { featureFlags } from '../utils/featureFlags';
import GenreFilter from '../components/GenreFilter';

interface Genre { _id: string; title: string; }
interface AllBooksData {
  series: { _id: string; title: string; slug: { current: string }; books: Book[]; }[];
  standalones: Book[];
  genres: Genre[];
  showSorter?: boolean;
}


const AllBooksPage = () => {
  const [allData, setAllData] = useState<AllBooksData | null>(null);
  const [selectedGenreIds, setSelectedGenreIds] = useState<string[]>([]);
  const [filteredContent, setFilteredContent] = useState<{ series: AllBooksData['series']; standalones: Book[] }>({ series: [], standalones: [] });

  // Fetch all data from Sanity
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
            coverImage{ asset->{ url } },
            "genreIds": coalesce(genres[]->_id, []) + coalesce(series->genres[]->_id, [])
          }
        },
        "standalones": *[_type == "book" && !defined(series)]{
          _id,
          title,
          slug,
          coverImage{ asset->{ url } },
          "genreIds": coalesce(genres[]->_id, [])
        },
        "genres": *[_type == "genre"] | order(title asc),
        "showSorter": coalesce(*[_type == "settings" && _id == 'settings'][0].showGenreSorter, false)
      }
    `;

    sanityClient.fetch<AllBooksData>(query)
      .then((data) => {
        setAllData(data);
        setFilteredContent({ series: data.series, standalones: data.standalones });
      })
      .catch(console.error);
  }, []);

  // Filter the books whenever the selected genres change
  useEffect(() => {
    if (!allData) return;

    if (selectedGenreIds.length === 0) {
      setFilteredContent({ series: allData.series, standalones: allData.standalones });
      return;
    }

    const newFilteredStandalones = allData.standalones.filter(book =>
      selectedGenreIds.some(id => book.genreIds?.includes(id))
    );

    const newFilteredSeries = allData.series
      .map(series => ({
        ...series,
        books: series.books.filter(book =>
          selectedGenreIds.some(id => book.genreIds?.includes(id))
        ),
      }))
      .filter(series => series.books.length > 0);

    setFilteredContent({ series: newFilteredSeries, standalones: newFilteredStandalones });
  }, [selectedGenreIds, allData]);


  // Render the UI
  const shouldShowSorter = featureFlags.enableGenreSorter && allData?.showSorter;

  if (!allData) {
    return <div className="text-white text-center p-8">Loading all books...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center mb-6 text-white">All Books</h1>

      {shouldShowSorter && allData.genres.length > 0 && (
        <GenreFilter 
          genres={allData.genres}
          selectedGenreIds={selectedGenreIds}
          onGenreToggle={(genreId) => setSelectedGenreIds(prev => 
            prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId]
          )}
          onClear={() => setSelectedGenreIds([])}
        />
      )}

      {/* --- Render Series --- */}
      {filteredContent.series.map((series) => (
        <section key={series._id} className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-white">{series.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
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

      {/* --- Render Standalones --- */}
      {filteredContent.standalones.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-white">Standalones</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filteredContent.standalones.map((book) => (
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