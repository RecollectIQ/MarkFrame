import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const mountNode = document.getElementById('root');

if (!mountNode) {
  throw new Error('Root element with id "root" not found');
}

const root = createRoot(mountNode);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

