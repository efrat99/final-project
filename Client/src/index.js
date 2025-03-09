import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PrimeReactProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PrimeReactProvider>
);
// reportWebVitals();
