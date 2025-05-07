import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Flag from 'react-world-flags';

const Home = () => {
//   const language = [
//     { "value": "ערבית", "label": "ar" },
//     { "value": "אנגלית", "label": "en" },
//     { "value": "ספרדית", "label": "es" },
//     { "value": "צרפתית", "label": "fr" },
//     { "value": "גרמנית", "label": "de" },
//     { "value": "רוסית", "label": "ru" },
//     { "value": "סינית", "label": "zh" },
//     { "value": "הינדי", "label": "hi" },
//     { "value": "פורטוגזית", "label": "pt" },
//     { "value": "יפנית", "label": "ja" },
//     { "value": "איטלקית", "label": "it" },
//     { "value": "הולנדית", "label": "nl" },
//     { "value": "קוריאנית", "label": "ko" },
//     { "value": "טורקית", "label": "tr" },
//     { "value": "עברית", "label": "he" },
//     { "value": "פרסית", "label": "fa" },
//     { "value": "פולנית", "label": "pl" },
//     { "value": "אוקראינית", "label": "uk" },
//     { "value": "שוודית", "label": "sv" },
//     { "value": "פינית", "label": "fi" },
//     { "value": "נורווגית", "label": "no" },
//     { "value": "דנית", "label": "da" },
//     { "value": "צ'כית", "label": "cs" },
//     { "value": "יוונית", "label": "el" },
//     { "value": "תאית", "label": "th" },
//     { "value": "אינדונזית", "label": "id" },
//     { "value": "וייטנאמית", "label": "vi" },
//     { "value": "הונגרית", "label": "hu" },
//     { "value": "רומנית", "label": "ro" },
//     { "value": "בולגרית", "label": "bg" },
//     { "value": "סרבית", "label": "sr" },
//     { "value": "סלובקית", "label": "sk" },
//     { "value": "סלובנית", "label": "sl" },
//     { "value": "קרואטית", "label": "hr" },
//     { "value": "ליטאית", "label": "lt" },
//     { "value": "לטבית", "label": "lv" },
//     { "value": "אסטונית", "label": "et" },
//     { "value": "מלאית", "label": "ms" },
//     { "value": "בנגלית", "label": "bn" },
//     { "value": "טאגאלוג", "label": "tl" },
//     { "value": "סוואהילית", "label": "sw" },
//     { "value": "מלטזית", "label": "mt" },
//     { "value": "איסלנדית", "label": "is" },
//     { "value": "אירית", "label": "ga" },
//     { "value": "וולשית", "label": "cy" }
// ]

  const navigate = useNavigate();
  const [studentCourses, setStudentCourses] = useState([]);
  const [Courses, setCourses] = useState([]);
  const [teacherNames, setTeacherNames] = useState({});
  const _id = useSelector(state => state.token.user._id)
  
const fetchCourses = async () => {
  try {
      const res = await axios.get("http://localhost:6660/courses/");
      const courses = res.data;

      if (res.status === 200) {
          console.log("קורסים שהתקבלו מהשרת:", courses);

          // סינון קורסים עם פחות מ-4 רמות או רמות לא תקינות
          const filteredCourses = await Promise.all(
              courses.map(async (course) => {
                  const levels = course.levels || [];
                  if (levels.length < 4) {
                      console.log(`קורס "${course.language}" נפסל - פחות מ-4 רמות (${levels.length})`);
                      return null; // הסר קורסים עם פחות מ-4 רמות
                  }

                  // בדוק אם כל הרמות מכילות Learnings ו-Practices תקינים
                  const allLevelsHaveContent = await Promise.all(
                      levels.map(async (levelId, i) => {
                          try {
                              const learningsRes = await axios.get(`http://localhost:6660/learnings/`, {params:{level:levelId}});
                              const learnings = learningsRes.data;

                              if (!learnings || learnings.length === 0) {
                                  console.log(`קורס "${course.language}" - רמה ${i + 1} בעיה: אין Learnings`);
                                  return false;
                              }
                              const practicesRes = await axios.get(`http://localhost:6660/practices/`, {params:{level:levelId}});
                              const practices = practicesRes.data;

                              if (!practices || practices.length === 0) {
                                  console.log(`קורס "${course.language}" - רמה ${i + 1} בעיה: אין practices`);
                                  return false;
                              }

                              return true;
                          } catch (error) {
                              console.error(`שגיאה בשליפת Learnings עבור רמה ${i + 1} בקורס "${course.language}":`, error);
                              return false;
                          }
                      })
                  );

                  // אם אחת הרמות לא תקינה, הסר את הקורס
                  if (allLevelsHaveContent.includes(false)) {
                      console.log(`קורס "${course.language}" נפסל - לא כל הרמות תקינות`);
                      return null;
                  }

                  return course; // הקורס תקין
              })
          );

          // הסר ערכים null מהתוצאה
          const validCourses = filteredCourses.filter((course) => course !== null);

          console.log("קורסים מסוננים:", validCourses);

          // עדכן את ה-state עם הקורסים המסוננים
          setCourses(validCourses);

          // סינון הקורסים של הסטודנט
          const studentFilteredCourses = validCourses.filter((course) =>
              course.students.some((student) => student === _id)
          );
          setStudentCourses(studentFilteredCourses);

        const teacherNamesMap = {};
        await Promise.all(
          courses.map(async (course) => {
            if (course.teacher && !teacherNamesMap[course.teacher]) {
              teacherNamesMap[course.teacher] = await TeacherName(course.teacher);
            }
          })
        );
  
        setTeacherNames(teacherNamesMap); // עדכון שמות המורים ב-state      
      }
  } catch (e) {
      console.error("שגיאה בשליפת קורסים:", e);
  }
};

  useEffect(() => {
    fetchCourses();
  }, [_id]);

  const AddStudentToCourse = async (course) => {
    console.log(_id);
    try {
      course.students.push(_id);  // Add the student ID to the course's students arra
      const res = await axios.put(`http://localhost:6660/courses/`, course);  // Update the course on the server
      console.log(res.status);
      if (res.status === 200) {
        console.log(res.data);  // Display the response from the server
      }
      fetchCourses();  // Refresh the courses after adding the student
    } catch (e) {
      console.error(e);  // Handle errors
    }
  }

  const DeleteStudentFromCourse = async (course) => {
    try {
      course.students = course.students.filter(student => student !== _id);  // Remove the student ID from the course's students array
    const res1=  await axios.delete('http://localhost:6660/grades/deleteByStudentAndCourse', {data:{studentId: _id,courseId: course._id}});
    console.log(res1.status);
      const res = await axios.put(`http://localhost:6660/courses/`, course);  // Update the course on the server
      console.log(res.status);
      if (res.status === 200) {
        console.log(res.data);  // Display the response from the server
      }
      fetchCourses();

    } catch (e) {
      console.error(e);  // Handle errors
    }
  }

  const EnterCourse = async (course) => {
    try {
      const res = await axios.get(`http://localhost:6660/courses/${course._id}`);  // Fetch the course details from the server
      if (res.status === 200) {
        console.log(res.data);  // Display the course details
        const resCourse = res.data
        navigate('/levels', { state: { course: resCourse } });  // Navigate to the Course page with the course data
      }
    } catch (e) {
      console.error(e);  // Handle errors
    }
  }

  const TeacherName = async (teacherId) => {
    try {
      const res = await axios.get(`http://localhost:6660/users/${teacherId}`);
      if (res.status === 200) {
        return res.data.firstName+" "+res.data.lastName; // נניח ששם המורה נמצא בשדה `name`
      }
    } catch (e) {
      console.error(`Error fetching teacher name for ID ${teacherId}:`, e);
      return "Unknown Teacher"; // ערך ברירת מחדל במקרה של שגיאה
    }
  };



  const header = (
    <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
  );
  const footer = (course) => (
    <>
      <Button label="היכנס" icon="pi pi-times" style={{ marginLeft: '0.5em' }} onClick={() => { EnterCourse(course) }} />
      <Button label="מחק"  icon="pi pi-times" style={{ marginLeft: '0.5em' }} onClick={() => { DeleteStudentFromCourse(course) }} />
    </>
  );

//   const getCountryCode = (langName) => {
//     const match = language.find(lang => lang.value === langName);
//     return match ? match.label : null;
// }

  return (
    <div className="home">
      <h1>קורסים לבחירה</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {Courses.map((course) => !course.students.includes(_id) ? (
          <Card header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem', flex: '0 1 auto' }} className="md:w-25rem">
            <h1 className="m-0">{course.language}</h1>
            <h3>מורה:{teacherNames[course.teacher] || "Loading..."}</h3> 
            <Button label="הירשם" icon="pi pi-check" onClick={() => { AddStudentToCourse(course) }} />
          </Card>
        ) : null)}</div>
      <div className="myCourses">
        <p>הקורסים שלי</p>
        <div className="courseListPerUser" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {studentCourses.map((course) => (
            <Card  footer={footer(course)} header={header} style={{ width: '300px', height: '400px', fontSize: '0.9rem', flex: '0 1 auto' }} className="md:w-25rem">
              <h1 className="m-0">{course.language } </h1>
               <h3>מורה:  {teacherNames[course.teacher] || "Loading..."}</h3> 
              
            </Card>
          ))}
        </div>
      </div>
    </div>
    
  );
}
export default Home;