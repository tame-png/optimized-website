import { Suspense, lazy } from 'react';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import Header, { SkipLink } from './components/Header.jsx';
import { Postcard, ScrollManager } from './components/Layout.jsx';
import { ARTIFACT } from './lib/paths.js';
import Home from './pages/Home.jsx';
import TideProvider from './tide/TideProvider.jsx';

const Notebooks = lazy(() => import('./pages/Notebooks.jsx'));
const Viewer = lazy(() => import('./pages/Viewer.jsx'));
const Files = lazy(() => import('./pages/Files.jsx'));
const Certificates = lazy(() => import('./pages/Certificates.jsx'));
const Paper = lazy(() => import('./pages/Paper.jsx'));
const Resume = lazy(() => import('./pages/Resume.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// The website uses normal addresses (/resume). An artifact is served from a path it does not
// control, so that build keeps the route after a # instead.
const Router = ARTIFACT ? HashRouter : BrowserRouter;

function Loading() {
  return (
    <main className="page wrap">
      <p className="loading" role="status">
        Loading…
      </p>
    </main>
  );
}

export default function App() {
  return (
    <TideProvider>
      <Router>
        <ScrollManager />
        <SkipLink />
        <Header />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/notebooks" element={<Notebooks />} />
            <Route path="/notebooks/:slug" element={<Viewer />} />
            <Route path="/files" element={<Files />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/paper/lbrhe" element={<Paper />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Postcard />
      </Router>
    </TideProvider>
  );
}
