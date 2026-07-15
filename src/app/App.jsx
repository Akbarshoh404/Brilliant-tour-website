import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import useLenis from '../hooks/useLenis';
import { SearchOverlayProvider } from '../context/SearchOverlayContext';
import { ThemeProvider } from '../context/ThemeContext';
import { organizationSchema, websiteSchema } from '../utils/structuredData';
import ScrollToTop from './ScrollToTop';
import PageLoader from './PageLoader';
import { routes } from './routes';

// Rendered once for the whole app: the business/site identity graph that
// every crawled page should carry, without every page re-declaring it.
const SITE_JSON_LD = [organizationSchema(), websiteSchema()];

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            {routes.map(({ path, element: Element }) => (
              <Route key={path} path={path} element={<Element />} />
            ))}
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  useLenis();

  return (
    <ThemeProvider>
      <SearchOverlayProvider>
        <Helmet>
          {SITE_JSON_LD.map((schema, i) => (
            <script key={i} type="application/ld+json">
              {JSON.stringify(schema)}
            </script>
          ))}
        </Helmet>
        <ScrollToTop />
        <Navbar />
        <main>
          <AnimatedRoutes />
        </main>
        <Footer />
      </SearchOverlayProvider>
    </ThemeProvider>
  );
}
