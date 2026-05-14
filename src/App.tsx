import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from '@/theme/GlobalStyles';
import { Header } from '@/components/Header';
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
      <main>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/handmade" element={<Handmade />} />
            <Route path="/colophon" element={<Colophon />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
