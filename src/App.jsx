import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useRouteError } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import BinaryLoader from './components/Loaders/BinaryLoader';
import ErrorFallback from './components/ErrorFallback';

// Wrapper for ErrorFallback to passing router error
const RouterErrorFallback = () => {
  const error = useRouteError();
  return <ErrorFallback error={error} resetErrorBoundary={() => window.location.reload()} />;
};

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
    errorElement: <RouterErrorFallback />,
    children: [
      {
        index: true,
        loader: async () => {
          // Check if Home was visited before
          const visited = JSON.parse(sessionStorage.getItem('visitedPages') || '[]');
          if (!visited.includes('/')) {
            // First visit - wait for loader animation
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          return null;
        },
        element: <Home />,
      },
      {
        path: "portfolio",
        loader: async () => {
          // Check if Portfolio was visited before
          const visited = JSON.parse(sessionStorage.getItem('visitedPages') || '[]');
          if (!visited.includes('/portfolio')) {
            // First visit - wait for loader animation
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          await import('./pages/Portfolio');
          return null;
        },
        element: <Portfolio />,
      },
      {
        path: "architecture",
        loader: async () => {
          // Check if Architecture was visited before
          const visited = JSON.parse(sessionStorage.getItem('visitedPages') || '[]');
          if (!visited.includes('/architecture')) {
            // First visit - wait for loader animation
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          await import('./pages/Architecture');
          return null;
        },
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
