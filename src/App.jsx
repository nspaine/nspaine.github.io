import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import BinaryLoader from './components/Loaders/BinaryLoader';

// Lazy load heavy components
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Architecture = lazy(() => import('./pages/Architecture'));

// Root Layout Wrapper to provide Outlet context
const RootLayout = () => (
  <Layout>
    <Suspense fallback={<BinaryLoader />}>
      <Outlet />
    </Suspense>
  </Layout>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "portfolio",
        loader: () => import('./pages/Portfolio').then(() => null), // Force router to wait for chunk, triggering loading state
        element: <Portfolio />,
      },
      {
        path: "architecture",
        loader: () => import('./pages/Architecture').then(() => null), // Force router to wait for chunk, triggering loading state
        element: <Architecture />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_URL
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;
