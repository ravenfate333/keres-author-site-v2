import { useEffect, useState } from 'react';
import sanityClient, { urlFor } from '../sanityClient';
import { PortableText } from '@portabletext/react';
import { customPortableTextComponents } from '../utils/portableTextComponents';

interface AuthorData {
  author: string;
  bio: any;
  image?: {
    asset?: any;
    alt?: string;
  };  
}

const AuthorPage = () => {
  const [author, setAuthor] = useState<AuthorData | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        console.log('Starting fetch...');
        const query = `*[_type == "author"][0]{
          author,
          bio,
          image {
            asset->{
              _id,
              url
            },
            alt
          }
        }`;
        
        const result = await sanityClient.fetch(query);
        console.log('Author fetch result:', result);
        setAuthor(result);
      } catch (err) {
        console.error('Error fetching author:', err);
      }
    };
  
    fetchAuthor();
  }, []);
  

  if (!author) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">About {author.author}</h1>

      <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
        {author.image?.asset?.url && (
          <img
            className="w-3/5 rounded-lg shadow-lg lg:w-1/3"
            src={urlFor(author.image).url()}
            alt={author.image.alt || author.author}
          />
        )}

        <div className="text-lg space-y-4">
          <PortableText value={author.bio} components={customPortableTextComponents} />
        </div>
      </div>
    </div>
  );
};

export default AuthorPage;
