import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { installScrollMemory } from './lib/scroll.js';
import './styles/base.css';
import './styles/responsive.css';

installScrollMemory();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
