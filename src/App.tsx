/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import PaintingDetail from './pages/PaintingDetail';
import Admin from './pages/Admin';
import Chatbot from './components/Chatbot';

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/painting/:id" element={<PaintingDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Chatbot />
        </Layout>
      </Router>
    </HelmetProvider>
  );
}
