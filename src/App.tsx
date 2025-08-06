import Footer from './components/Footer';

function App() {
  // The `h-screen` makes the main div take up the full screen height
  // The `flex` and `flex-col` stack the items vertically
  // `justify-between` pushes the h1 to the top and the footer to the bottom
  return (
    <div className="flex flex-col h-screen justify-between bg-gray-800">
      <h1 className="text-white text-center text-3xl p-8">
        My New Website
      </h1>

      <Footer />
    </div>
  );
}

export default App;