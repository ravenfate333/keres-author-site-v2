import SocialLinks from './SocialLinks';
import MailchimpForm from './MailchimpForm';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-5 md:py-6">
        {/* Main content */}
        <div className="grid md:grid-cols-2 items-center gap-6">
          {/* Social Links Section */}
          <section aria-labelledby="footer-social" className="justify-self-center text-center">
            <h3 id="footer-social" className="text-lg font-semibold mb-2">Find Me On Social Media!</h3>
            <div className="flex justify-center">
              <SocialLinks />
            </div>
          </section>

          {/* Newsletter Section */}
          <section aria-labelledby="footer-newsletter" className="justify-self-center w-full md:w-auto text-center">
            <MailchimpForm />
          </section>
        </div>

        {/* Divider */}
        <hr className="my-5 border-red-800/60" />

        {/* Legal Section */}
        <div className="text-center text-xs text-gray-400 space-y-1.5">
          <p>All Rights Reserved © 2025 Beronika Keres</p>
          <p>
            All writings, blogs, books, and content within this site belong to Beronika Keres and are not permitted to be
            used without written permission.
          </p>
          <p>
            <a href="/privacy" className="underline hover:opacity-80">Privacy Policy</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;