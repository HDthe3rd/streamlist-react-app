import React, { useState } from 'react';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import StreamListPage from './components/StreamListPage/StreamListPage';
import MoviesPage from './components/MoviesPage/MoviesPage';
import CartPage from './components/CartPage/CartPage';
import AboutPage from './components/AboutPage/AboutPage';
import { styles } from './styles/styles';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <StreamListPage />;
      case 'movies':
        return <MoviesPage />;
      case 'cart':
        return <CartPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <StreamListPage />;
    }
  };

  return (
    <div style={styles.app}>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main style={styles.main}>
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;