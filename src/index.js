import React from "react";
import ReactDOM from "react-dom/client";  // Use 'react-dom/client' in React 18
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

// React 18 approach:
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Router>
      <App />
    </Router>
  // </React.StrictMode>
);
