import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicWebView } from './views/PublicWebView';
import { PwaClientView } from './views/PwaClientView';
import { BackofficeView } from './views/BackofficeView';
import { useWebConfig } from './hooks/useWebConfig';
import { AuthProvider } from './context/AuthContext';
import Grainient from './components/Grainient';

export function App() {
  // Synchronize document.title, favicon and global branding on boot
  useWebConfig();

  return (
    <AuthProvider>
      <div className="relative min-h-screen w-full isolate">
        {/* React Bits Grainient - Background Global */}
        <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
          <Grainient
            color1="#FFF2F6"
            color2="#FFCCD9"
            color3="#8A2E4B"
            timeSpeed={0.15}
            warpStrength={0.65}
            warpFrequency={3.5}
            warpSpeed={1.2}
            warpAmplitude={35.0}
            blendAngle={30.0}
            blendSoftness={0.10}
            rotationAmount={320.0}
            noiseScale={1.6}
            grainAmount={0.05}
            grainScale={2.0}
            grainAnimated={true}
            contrast={1.05}
            gamma={1.0}
            saturation={1.02}
            zoom={0.95}
          />
        </div>

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
      </div>
    </AuthProvider>
  );
}

export default App;

