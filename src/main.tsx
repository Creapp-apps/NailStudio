import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';
import './index.css';

window.addEventListener('error', (event) => {
  console.error('GLOBAL_WINDOW_ERROR:', event.error);
  const el = document.getElementById('debug-error-overlay');
  if (!el) {
    const div = document.createElement('div');
    div.id = 'debug-error-overlay';
    div.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#1a050b;color:#ff88a3;padding:24px;z-index:999999;font-family:monospace;white-space:pre-wrap;overflow:auto;font-size:14px;';
    div.textContent = 'GLOBAL ERROR:\n' + (event.error?.stack || event.error?.message || String(event.error) || event.message);
    document.body.appendChild(div);
  }
});

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('REACT_ERROR_BOUNDARY_CAUGHT:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div id="debug-error-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#1a050b',
          color: '#ff88a3',
          padding: '24px',
          zIndex: 999999,
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
          overflow: 'auto',
          fontSize: '14px'
        }}>
          <h2>⚠️ React Error Caught:</h2>
          <pre>{this.state.error?.stack || String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

Sentry.init({
  dsn: 'https://e0b2d77086fbd39f1eccc683650ffd0e@o4512200993275904.ingest.us.sentry.io/4512201144664064',
  environment: import.meta.env.MODE || 'production',
  tracesSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
