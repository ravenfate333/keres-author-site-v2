const AboutPage = () => {
    return (
      // Main page container
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        <h1 className="text-4xl font-bold text-center mb-8">About Beronika Keres</h1>
  
        {/* Bio Container */}
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
          
          {/* Author Image */}
          {/* w-3/5 is 60% width, lg:w-1/3 changes it to 33% on large screens */}
          <img
            className="w-3/5 rounded-lg shadow-lg lg:w-1/3"
            src="/authorphoto.webp"
          />
  
          {/* Author Bio Text */}
          {/* space-y-4 adds margin between the <p> tags */}
          <div className="text-lg space-y-4">
            <p>
              Beronika Keres is the Canadian author of the dark fantasy thriller
              series, Cracked Coffins. In the second grade, she decided she
              wanted to be an author and has spent her life honing her craft and
              pursuing her dream. She can often be found chasing plot bunnies
              and writing books.
            </p>
            <p>
              When she’s not writing, she enjoys spending time with her family,
              or listening to some gothic rock, punk, or metal while working on
              her newest spike and patch covered project.
            </p>
          </div>
  
        </div>
      </div>
    );
  };
  
  export default AboutPage;