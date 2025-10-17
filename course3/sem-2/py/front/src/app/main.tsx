import { createRoot } from 'react-dom/client'
import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from '@/pages/layout';
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const IndexPage = lazy(() => import(/* webpackPrefetch: true */ '@/pages/index'))
const NotFoundPage = lazy(() => import(/* webpackPrefetch: true */ '@/pages/notFound'))

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<IndexPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
)
