import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    // This flex container ensures the footer stays at the bottom
    <div className="min-h-screen flex flex-col text-white">
      <Navbar />
      
      {/* Renders the current page (e.g., HomePage). */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;