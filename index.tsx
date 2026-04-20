/**
 * index.tsx
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Global error handler to display errors on page
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#f8f8f8;padding:20px;overflow:auto;font-family:monospace;z-index:9999;';
  errorDiv.innerHTML = `<div style="color:red;font-size:18px;font-weight:bold;">⚠️ RUNTIME ERROR</div><pre style="color:red;white-space:pre-wrap;word-wrap:break-word;">${event.error?.stack || event.message}</pre>`;
  document.body.appendChild(errorDiv);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#f8f8f8;padding:20px;overflow:auto;font-family:monospace;z-index:9999;';
  errorDiv.innerHTML = `<div style="color:red;font-size:18px;font-weight:bold;">⚠️ UNHANDLED PROMISE REJECTION</div><pre style="color:red;white-space:pre-wrap;word-wrap:break-word;">${event.reason?.stack || String(event.reason)}</pre>`;
  document.body.appendChild(errorDiv);
});

console.log('App starting...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log('Root element found, creating React root...');

const root = ReactDOM.createRoot(rootElement);
console.log('Rendering App component...');

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

console.log('App rendered');