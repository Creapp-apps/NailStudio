import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicWebView } from './views/PublicWebView';
import { PwaClientView } from './views/PwaClientView';
import { BackofficeView } from './views/BackofficeView';
import { useWebConfig } from './hooks/useWebConfig';
import { AuthProvider } from './context/AuthContext';

export function App() {
  // Synchronize document.title, favicon and global branding on boot
  useWebConfig();

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Isolated View Routing */}
        <Routes>
          {/* 1. Web Pública (Editorial Haute Glamour & Booking) */}
          <Route path="/" element={<PublicWebView />} />

          {/* 2. Portal PWA Clientas (Digital Wallet, Points, Health Diagnostics) */}
          <Route path="/pwa" element={<PwaClientView />} />

          {/* 3. Backoffice Administrativo (Agenda, CRM, Insumos, Finanzas, Concierge) */}
          <Route path="/backoffice" element={<BackofficeView />} />
          <Route path="/admin" element={<Navigate to="/backoffice" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

