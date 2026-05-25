import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Nav from '@/components/layout/nav';
import Footer from '@/components/layout/footer';
import { AuthProvider } from '@/lib/auth-provider';
import RequireAdmin from '@/components/admin/require-admin';
import Home from '@/routes/home';
import Blogs from '@/routes/blogs';
import BlogDetail from '@/routes/blog-detail';
import Contact from '@/routes/contact';
import NotFound from '@/routes/not-found';
import AdminLogin from '@/routes/admin/login';
import AdminDashboard from '@/routes/admin/index';
import AdminPostEditor from '@/routes/admin/post-editor';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <main className="mx-auto max-w-7xl px-8 pb-16 pt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:slug" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/posts/new"
              element={
                <RequireAdmin>
                  <AdminPostEditor mode="new" />
                </RequireAdmin>
              }
            />
            <Route
              path="/admin/posts/:slug/edit"
              element={
                <RequireAdmin>
                  <AdminPostEditor mode="edit" />
                </RequireAdmin>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}
