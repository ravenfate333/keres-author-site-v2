const MailchimpForm = () => {
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">Join My Newsletter!</h3>
        <form className="flex flex-col items-center gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 rounded-md text-gray-900 w-full max-w-xs"
          />
          <button
            type="submit"
            className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-md w-full max-w-xs transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    );
  };
  
  export default MailchimpForm;