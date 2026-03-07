import React from 'react';
import Hero from '../Hero';
import Contato from '../Contato';
import Projetos from '../Projetos';
import Footer from '../Footer';

const Home = () => {
  return (
    <div className="bg-gray-100 font-sans">
      <Hero />
      <Projetos />
      <Contato />
      <Footer />
    </div>
  );
};

export default Home;
