import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Mount the React application into the DOM.  StrictMode helps
// surface potential problems in an application by intentionally
// invoking certain lifecycle methods twice during development.
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);