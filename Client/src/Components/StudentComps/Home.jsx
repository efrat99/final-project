import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Flag from 'react-world-flags';

const Home = () => {
  const language = [
    { "value": "ערבית", "label": "ae" },  // United Arab Emirates (ערבית)
    { "value": "אנגלית", "label": "us" },  // United States (אנגלית)
    { "value": "ספרדית", "label": "es" },  // Spain (ספרדית)
    { "value": "צרפתית", "label": "fr" },  // France (צרפתית)
    { "value": "גרמנית", "label": "de" },  // Germany (גרמנית)
    { "value": "רוסית", "label": "ru" },  // Russia (רוסית)
    { "value": "סינית", "label": "cn" },  // China (סינית)
    { "value": "הינדי", "label": "in" },  // India (הינדי)
    { "value": "פורטוגזית", "label": "pt" },  // Portugal (פורטוגזית)
    { "value": "יפנית", "label": "jp" },  // Japan (יפנית)
    { "value": "איטלקית", "label": "it" },  // Italy (איטלקית)
    { "value": "הולנדית", "label": "nl" },  // Netherlands (הולנדית)
    { "value": "קוריאנית", "label": "kr" },  // South Korea (קוריאנית)
    { "value": "טורקית", "label": "tr" },  // Turkey (טורקית)
    { "value": "עברית", "label": "il" },  // Israel (עברית)
    { "value": "פרסית", "label": "ir" },  // Iran (פרסית)
    { "value": "פולנית", "label": "pl" },  // Poland (פולנית)
    { "value": "אוקראינית", "label": "ua" },  // Ukraine (אוקראינית)
    { "value": "שוודית", "label": "se" },  // Sweden (שוודית)
    { "value": "פינית", "label": "fi" },  // Finland (פינית)
    { "value": "נורווגית", "label": "no" },  // Norway (נורווגית)
    { "value": "דנית", "label": "dk" },  // Denmark (דנית)
    { "value": "צ'כית", "label": "cz" },  // Czech Republic (צ'כית)
    { "value": "יוונית", "label": "gr" },  // Greece (יוונית)
    { "value": "תאית", "label": "th" },  // Thailand (תאית)
    { "value": "אינדונזית", "label": "id" },  // Indonesia (אינדונזית)
    { "value": "וייטנאמית", "label": "vn" },  // Vietnam (וייטנאמית)
    { "value": "הונגרית", "label": "hu" },  // Hungary (הונגרית)
    { "value": "רומנית", "label": "ro" },  // Romania (רומנית)
    { "value": "בולגרית", "label": "bg" },  // Bulgaria (בולגרית)
    { "value": "סרבית", "label": "rs" },  // Serbia (סרבית)
    { "value": "סלובקית", "label": "sk" },  // Slovakia (סלובקית)
    { "value": "סלובנית", "label": "si" },  // Slovenia (סלובנית)
    { "value": "קרואטית", "label": "hr" },  // Croatia (קרואטית)
    { "value": "ליטאית", "label": "lt" },  // Lithuania (ליטאית)
    { "value": "לטבית", "label": "lv" },  // Latvia (לטבית)
    { "value": "אסטונית", "label": "ee" },  // Estonia (אסטונית)
    { "value": "מלאית", "label": "my" },  // Malaysia (מלאית)
    { "value": "בנגלית", "label": "bd" },  // Bangladesh (בנגלית)
    { "value": "טאגאלוג", "label": "ph" },  // Philippines (טאגאלוג)
    { "value": "סוואהילית", "label": "ke" },  // Kenya (סוואהילית)
    { "value": "מלטזית", "label": "mt" },  // Malta (מלטזית)
    { "value": "איסלנדית", "label": "is" },  // Iceland (איסלנדית)
    { "value": "אירית", "label": "ie" },  // Ireland (אירית)
    { "value": "וולשית", "label": "gb" }  // Wales (וולשית)
  ];

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
                  const learningsRes = await axios.get(`http://localhost:6660/learnings/`, { params: { level: levelId } });
                  const learnings = learningsRes.data;

                  if (!learnings || learnings.length === 0) {
                    console.log(`קורס "${course.language}" - רמה ${i + 1} בעיה: אין Learnings`);
                    return false;
                  }
                  const practicesRes = await axios.get(`http://localhost:6660/practices/`, { params: { level: levelId } });
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
      try {
        const res1 = await axios.delete('http://localhost:6660/grades/deleteByStudentAndCourse', { data: { studentId: _id, courseId: course._id } });
      }
      catch (e) {
        console.log(e);
      }
      const res = await axios.put(`http://localhost:6660/courses/`, course);  // Update the course on the server
      console.log(res.status);
      if (res.status === 200) {
        console.log(res.data);  // Display the response from the server

        fetchCourses();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const EnterCourse = async (course) => {
    try {
      const res = await axios.get(`http://localhost:6660/courses/${course._id}`);  // Fetch the course details from the server
      if (res.status === 200) {
        console.log(res.data);  // Display the course details
        const resCourse = res.data
        navigate('/level', { state: { course: resCourse } });  // Navigate to the Course page with the course data
      }
    } catch (e) {
      console.error(e);  // Handle errors
    }
  }

  const TeacherName = async (teacherId) => {
    try {
      const res = await axios.get(`http://localhost:6660/users/${teacherId}`);
      if (res.status === 200) {
        return res.data.firstName + " " + res.data.lastName; // נניח ששם המורה נמצא בשדה `name`
      }
    } catch (e) {
      console.error(`Error fetching teacher name for ID ${teacherId}:`, e);
      return "Unknown Teacher"; // ערך ברירת מחדל במקרה של שגיאה
    }
  };

  const getCountryCode = (langName) => {
    const match = language.find(lang => lang.value === langName);
    return match ? match.label : null;
  }



  const header = (course) => (
    < div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
      <Flag code={getCountryCode(course.language)} style={{ width: '300px', height: '100px', objectFit: "cover", borderRadius: '5px' }} />
    </div>
  );
  const footer = (course) => (
    <>
      <Button label="היכנס" icon="pi pi-arrow-left" style={{ marginLeft: '0.5em' }} onClick={() => { EnterCourse(course) }} />
      <Button label="מחק" icon="pi pi-times" style={{ marginLeft: '0.5em' }} onClick={() => { DeleteStudentFromCourse(course) }} />
    </>
  );

    return (
      <div className="home">
        <h1>קורסים לבחירה</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {Courses.map((course) => !course.students.includes(_id) ? (
            <Card header={header(course)} style={{ width: '300px', height: '350px', fontSize: '0.9rem', flex: '0 1 auto' }} className="md:w-25rem">
              <h1 className="m-0">{course.language}</h1>
              <h3>מורה: {teacherNames[course.teacher] || "Loading..."}</h3>
              <Button label="הירשם" icon="pi pi-check" onClick={() => { AddStudentToCourse(course) }} />
            </Card>
          ) : null)}</div>
        <div className="myCourses">
          <p>הקורסים שלי</p>
          <div className="courseListPerUser" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {studentCourses.map((course) => (
              <Card footer={footer(course)} header={header(course)} style={{ width: '300px', height: '400px', fontSize: '0.9rem', flex: '0 1 auto' }} className="md:w-25rem">
                <h1 className="m-0">{course.language} </h1>
                <h3>מורה:  {teacherNames[course.teacher] || "Loading..."}</h3>

              </Card>
            ))}
          </div>
        </div>
      </div>

    );
}
export default Home;