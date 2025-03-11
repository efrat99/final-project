import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'primereact/resources/themes/lara-light-blue/theme.css';  // ערכת נושא
import 'primereact/resources/primereact.min.css';               // סגנונות בסיסיים
import 'primeicons/primeicons.css';                             // אייקונים
//import 'primeflex/primeflex.css';                               // מערכת גריד ועיצוב


// import reportWebVitals from './reportWebVitals';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PrimeReactProvider>
    {/* <BrowserRouter> */}
      <App />
    {/* </BrowserRouter> */}
  </PrimeReactProvider>
);
// reportWebVitals();
