
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Learning from './Components/TeacherComps/Learning';
import Home from './Components/AccesPage';
import Practice from './Components/TeacherComps/Practice';
import StudentLearning from './Components/StudentComps/StudentLearning';
// import Course from './Components/TeacherComps/Course';
import TeacherLevel from './Components/TeacherComps/Level';
import StudentCourse from './Components/StudentComps/Course';
import TeacherCourse from './Components/TeacherComps/Course';
import Level from './Components/TeacherComps/Level';
import Levels from './Components/StudentComps/Levels';
import Learnings from './Components/StudentComps/Learnings';
import TeacherHomePage from './Components/TeacherComps/Home';
import StudentHomePage from './Components/StudentComps/Home';
import StudentPractice from './Components/StudentComps/StudentPractice';
import foxImage from './Images/fox.png';


import './App.css';
import './login.css';

import { Menubar } from 'primereact/menubar'; // Import Menubar from primereact
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setToken, logOut } from './redux/tokenSlice';

import './index.css';
import './flags.css';


function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.token.user);
  console.log("Current user in Redux:", user);


  // ...(user ? 

  const items = [
    {
      icon: 'pi pi-sign-out',
      command: () => {
        console.log("User logged out");
        dispatch(logOut());
        window.location.href = '/'; // ניווט לעמוד הבית
      }
    },
    {
      label: 'Home',
      icon: <img src={foxImage} alt="Home" style={{ width: '50px', height: 'auto' }} />,
      command: () => window.location.href = '/home'  // ניווט לעמוד הבית
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
    },

  ];



  return (
    <Router>
      {user && <div className="card">
        <Menubar model={items} />
      </div>}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={!user ? <Home /> : <Navigate to="/home" replace />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/learnings" element={<Learnings />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/level" element={<Level />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/studentLearning" element={<StudentLearning />} />
        <Route path="/studentPractice" element={<StudentPractice />} />
        {/* <Route path="/course" element={<Course />} /> */}
        {/* <Route path="/student" element={<StudentLearning />} /> */}
        {user && (
          <Route
            path="/level"
            element={user.role === 'Teacher' ? <TeacherLevel /> : <StudentCourse />} />)}
        {user && (
          <Route
            path="/home"
            element={user.role === 'Teacher' ? <TeacherHomePage /> : <StudentHomePage />}
          />
        )}
          {user && (
          <Route
            path="/course"
            element={user.role === 'Teacher' ? <TeacherCourse /> : <StudentCourse />}
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