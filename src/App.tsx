import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from '@/theme/GlobalStyles';
import { Header } from '@/components/Header';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Footer } from '@/components/Footer';
import Home from '@/routes/Home';

const Handmade = lazy(() => import('@/routes/Handmade'));
const Colophon = lazy(() => import('@/routes/Colophon'));
const NotFound = lazy(() => import('@/routes/NotFound'));

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header />
      <div id="main-content">
        <Suspense fallback={<div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>}>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/handmade" element={<Handmade />} />
              <Route path="/colophon" element={<Colophon />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </div>
      <Footer />
    </BrowserRouter>
  );
}
