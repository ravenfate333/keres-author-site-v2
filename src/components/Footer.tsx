import SocialLinks from './SocialLinks';
import MailchimpForm from './MailchimpForm';

const Footer = () => {
  return (
    <footer className="bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Main content */}
        <div className="flex flex-col md:flex-row justify-around items-center border-b-4 border-red-800/80 pb-8 gap-8">
          
          {/* Social Links Section */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Find Me On Social Media!</h3>
            <SocialLinks />
          </div>

          {/* Newsletter Section */}
          <div className="w-full md:w-auto">
            <MailchimpForm />
          </div>

        </div>

        {/* Legal Section */}
        <div className="text-center text-xs text-gray-400 pt-8 space-y-2">
          <p>All Rights Reserved © 2025 Beronika Keres</p>
          <p>
            All writings, blogs, books, and content within this site belong to
            Beronika Keres and are not permitted to be used without written
            permission.
          </p>
          <p>Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;