
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Learning from './Components/Learning';
import Home from './Components/Home';
import Practice from './Components/Practice';
import StudentLearning from './Components/StudentLearning';
import Courses from './Components/Courses';

import './App.css';
import './login.css';

import { Menubar } from 'primereact/menubar'; // Import Menubar from primereact
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

import './index.css';
import './flags.css';
import Level from './Components/Level';

function App() {
  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command: () => window.location.href = '/'  // ניווט לעמוד הבית
    },
    {
      label: 'Students',
      icon: 'pi pi-star',
    },
    {
      label: 'Teachers',
      icon: 'pi pi-search',
    },
    {
      label: 'Courses',
      icon: 'pi pi-envelope',
      command: () => window.location.href = '/courses' // ניווט לעמוד הקורסים
    }
  ];

  return (
    <Router>
      <div className="card">
        <Menubar model={items} />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/level" element={<Level />} />
        <Route path="/studentLearning" element={<StudentLearning />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </Router>
    
  );
}

export default App;



// //////////לסדר את הבעיה של מייל כפול בדחיפות!!!!!!!!!!!!!!!!
// // עוד דברים לעשות:
// // 1. להוסיף עמוד להוספת תלמידים ומורים וציונים
// // 2. להוסיף עמוד להוספת תלמידים ומורים וציונים ולהציג אותם בטבלה
// // 3. להוסיף עמוד להצגת תלמידים ומורים וציונים בטבלה
// //............................................ 