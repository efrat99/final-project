
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Learning from './Components/TeacherComps/Learning';
import Home from './Components/AccesPage';
import Practice from './Components/TeacherComps/Practice';
import StudentLearning from './Components/StudentComps/StudentLearning';
import Courses from './Components/TeacherComps/Courses';
import Course from './Components/TeacherComps/Course';
import Level from './Components/TeacherComps/Level';
import TeacherHomePage from './Components/TeacherComps/Home';
import StudentHomePage from './Components/StudentComps/Home';

import './App.css';
import './login.css';

import { Menubar } from 'primereact/menubar'; // Import Menubar from primereact
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { useSelector } from 'react-redux';

import './index.css';
import './flags.css';


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
  const user = useSelector(state => state.token.user);
  console.log("Current user in Redux:", user);

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
        <Route path="/course" element={<Course />} />
        <Route path="/student" element={<StudentLearning />} />
        {/* <Route path="/dashboard" element={user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />} /> */}
        {user && (
          <Route
            path="/home"
            element={user.role === 'Teacher' ? <TeacherHomePage /> : <StudentHomePage />}
          />
        )}
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