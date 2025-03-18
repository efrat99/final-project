// import logo from './logo.svg';
//import Login from './Components/login';
import Learning from './Components/Learning';
import Home from './Components/Home';

import './App.css';
import './login.css'

import { PrimeReactProvider } from 'primereact/api';
import { Menubar } from 'primereact/menubar'; // Import Menubar from primereact
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

import './index.css';
import './flags.css';

function App() {
  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home'
    },
    {
      label: 'Students',
      icon: 'pi pi-star'
    },
    {
      label: 'teachers',
      icon: 'pi pi-search',
    },
    {
      label: 'Grades',
      icon: 'pi pi-envelope'
    }
  ];

  return (
    <>
      <div className="card">
        <Menubar model={items} />
      </div>
      {/* <Login /> */}
      <Home/>
      <Learning />
    </>
  );
}

export default App;

//////////לסדר את הבעיה של מייל כפול בדחיפות!!!!!!!!!!!!!!!!
// עוד דברים לעשות:
// 1. להוסיף עמוד להוספת תלמידים ומורים וציונים
// 2. להוסיף עמוד להוספת תלמידים ומורים וציונים ולהציג אותם בטבלה
// 3. להוסיף עמוד להצגת תלמידים ומורים וציונים בטבלה    
//............................................  