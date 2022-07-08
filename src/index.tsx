import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element is not found!');
}

createRoot(root).render(<App />);
