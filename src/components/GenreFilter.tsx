// TODO: Additional Styling

interface Genre {
    _id: string;
    title: string;
  }
  
  interface GenreFilterProps {
    genres: Genre[];
    selectedGenreIds: string[];
    onGenreToggle: (genreId: string) => void;
    onClear: () => void;
  }
  
  const GenreFilter: React.FC<GenreFilterProps> = ({
    genres,
    selectedGenreIds,
    onGenreToggle,
    onClear,
  }) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {genres.map((genre) => (
          <button
            key={genre._id}
            onClick={() => onGenreToggle(genre._id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selectedGenreIds.includes(genre._id)
                ? 'bg-red-600 text-white' // Active style
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600' // Inactive style
            }`}
          >
            {genre.title}
          </button>
        ))}
        {selectedGenreIds.length > 0 && (
          <button
            onClick={onClear}
            className="px-4 py-2 rounded-full text-sm font-semibold text-red-400 hover:text-red-300"
          >
            Clear
          </button>
        )}
      </div>
    );
  };
  
  export default GenreFilter;