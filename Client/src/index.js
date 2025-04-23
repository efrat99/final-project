import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'primereact/resources/themes/lara-light-blue/theme.css';  // ערכת נושא
import 'primereact/resources/primereact.min.css';               // סגנונות בסיסיים
import 'primeicons/primeicons.css';                             // אייקונים
//import 'primeflex/primeflex.css';                               // מערכת גריד ועיצוב
import { store } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './redux/store'; // Make sure your store is configured correctly
import { Provider } from 'react-redux';
// import reportWebVitals from './reportWebVitals';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <PrimeReactProvider>
     <Provider store={store} >
     <PersistGate loading={null} persistor={persistor}>
    {/* <BrowserRouter> */}
      <App/>
      </PersistGate>
      </Provider>
    {/* </BrowserRouter> */}
  </PrimeReactProvider>
);
// reportWebVitals();
