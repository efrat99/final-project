
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/AccesPage';
import TeacherLearning from './Components/TeacherComps/Learning';
import StudentLearning from './Components/StudentComps/Learning';
import TeacherPractice from './Components/TeacherComps/Practice';
import StudentPractice from './Components/StudentComps/Practice';
import TeacherLevel from './Components/TeacherComps/Level';
import StudentLevel from './Components/StudentComps/Level';
import TeacherHomePage from './Components/TeacherComps/Home';
import StudentHomePage from './Components/StudentComps/Home';
import Grades from './Components/StudentComps/Grades';

import foxImage from './Images/fox.png';

import './App.css';
import './login.css';

import { Menubar } from 'primereact/menubar';
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

  const items = [
    {
      icon: 'pi pi-sign-out',
      label: user ? user.firstName : '',
      command: () => {
        console.log("User logged out");
        dispatch(logOut());
        window.location.href = '/'; // ניווט לעמוד הבית
      }
    },
    {
      label: 'דף הבית',
      icon: <img src={foxImage} alt="Home" style={{ width: '50px', height: 'auto' }} />,
      command: () => window.location.href = '/home'  // ניווט לעמוד הבית
    },
    user && user.role === 'Student' && {
      label: 'ציונים',
      icon: 'pi pi-graduation-cap',
      command: () => window.location.href = '/grades' // ניווט לעמוד הקורסים
    }

  ];



  return (
    <Router>
      {user && <div className="card">
        <Menubar model={items} />
      </div>}
      <Routes>
        <Route path="/" element={!user ? <Home /> : <Navigate to="/home" replace />} />
        {user && (
        <Route
          path="/learning"
          element={user.role === 'Teacher' ? <TeacherLearning /> : <StudentLearning />} />
        )}
        {user && (
          <Route
            path="/practice"
            element={user.role === 'Teacher' ? <TeacherPractice /> : <StudentPractice />} />
        )}
        {user && (
          <Route
            path="/level"
            element={user.role === 'Teacher' ? <TeacherLevel /> : <StudentLevel />}
          />)}
        {user && (
          <Route
            path="/home"
            element={user.role === 'Teacher' ? <TeacherHomePage /> : <StudentHomePage />}
          />
        )}
        <Route path="/grades" element={<Grades />} />
      </Routes>
    </Router>

  );
}

export default App;

