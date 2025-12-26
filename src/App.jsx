import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';

// Placeholder components
const Portfolio = () => <div className="p-20 text-center text-4xl">Software Portfolio (Coming Soon)</div>;
const Architecture = () => <div className="p-20 text-center text-4xl">Architecture Gallery (Coming Soon)</div>;

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/architecture" element={<Architecture />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
