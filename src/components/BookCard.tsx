import { PortableText } from '@portabletext/react';
import type { Book } from '../types';
import { customPortableTextComponents } from '../utils/portableTextComponents';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  let backgroundColor = '#000000'; // Default fallback color

  // Check if themeColor and its rgb property exist
  if (book.themeColor && book.themeColor.rgb) {
    // Construct the rgba string for the background
    const { r, g, b, a } = book.themeColor.rgb;
    backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  const sectionStyle = {
    backgroundColor: backgroundColor,
  };

  return (
    <div style={sectionStyle} className="rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row items-center gap-8 p-8">
        <img
          src={book.coverImage.asset.url}
          alt={`Cover for ${book.title}`}
          className="w-3/5 md:w-1/3 rounded-md shadow-md"
        />
        <div className="flex-1 text-white">
          <h2 className="text-3xl font-bold mb-4">{book.title}</h2>

          {/* This will only render if book.bookNumber has a value */}
          {book.bookNumber && (
            <p className="text-xl text-gray-300 -mt-2 mb-4">
              {book.bookNumberLabel || 'Book'} {book.bookNumber}
            </p>
          )}

          {Array.isArray(book.genres) && book.genres.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-4">
              {book.genres.map((g, i) => (
                <li
                  key={`${g}-${i}`} // avoids duplicate-key warnings if texts repeat
                  className="px-3 py-1 text-xs rounded-full
                   border border-white/25 bg-white/10 text-white/90
                   backdrop-blur-sm"
                  aria-label={`Genre: ${g}`}
                >
                  {g}
                </li>
              ))}
            </ul>
          )}

          <div className="prose prose-invert max-w-none">
            <PortableText value={book.blurb} components={customPortableTextComponents} />
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            {book.retailerButtons?.map((button) => (
              <a
                key={button._key} // Unique _key from Sanity
                href={button.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold underline hover:text-gray-300 transition-colors"
              >
                {button.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
