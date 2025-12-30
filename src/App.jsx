import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';

import BinaryLoader from './components/Loaders/BinaryLoader';

// Lazy load heavy components (Visual delay managed by Layout.jsx)
const Portfolio = lazy(() => import('./pages/Portfolio'));

const Architecture = () => <div className="p-20 text-center text-4xl">Architecture Gallery (Coming Soon)</div>;

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Suspense fallback={<BinaryLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/architecture" element={<Architecture />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
