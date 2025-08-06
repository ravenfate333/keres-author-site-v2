import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAmazon, faTiktok, faInstagram, faFacebook, faGoodreads } from "@fortawesome/free-brands-svg-icons";

const socialLinks = [
  { icon: faAmazon, href: "https://amazon.com/author/beronikakeres" },
  { icon: faTiktok, href: "https://tiktok.com/@beronikakeres" },
  { icon: faInstagram, href: "https://instagram.com/beronikakeres" },
  { icon: faFacebook, href: "https://facebook.com/AuthorBeronikaKeres" },
  { icon: faGoodreads, href: "https://www.goodreads.com/author/show/20537997.Beronika_Keres" }
];

const SocialLinks = () => {
  return (
    // Replaces .social-links from footer.scss
    <div className="flex items-center justify-center gap-4 text-2xl">
      {socialLinks.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400 transition-colors">
          <FontAwesomeIcon icon={link.icon} />
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;