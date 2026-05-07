import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Nav from '@/components/layout/nav';
import Footer from '@/components/layout/footer';
import Home from '@/routes/home';
import Blogs from '@/routes/blogs';
import BlogDetail from '@/routes/blog-detail';
import Contact from '@/routes/contact';
import NotFound from '@/routes/not-found';

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <main className="mx-auto max-w-5xl px-8 pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </BrowserRouter>
  );
}
