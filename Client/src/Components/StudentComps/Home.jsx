import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [studentCourses, setStudentCourses] = useState([]);
  const [Courses, setCourses] = useState([]);
  const [teacherNames, setTeacherNames] = useState({});
  const _id = useSelector(state => state.token.user._id)
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:6660/courses/");
      if (res.status === 200) {
        const courses = res.data;
  
        // שליפת שמות המורים
        const teacherNamesMap = {};
        await Promise.all(
          courses.map(async (course) => {
            if (course.teacher && !teacherNamesMap[course.teacher]) {
              teacherNamesMap[course.teacher] = await TeacherName(course.teacher);
            }
          })
        );
  
        setTeacherNames(teacherNamesMap); // עדכון שמות המורים ב-state
        setCourses(courses); // עדכון הקורסים
        const filteredCourses = courses.filter((course) => {
          return course.students.some((student) => student === _id);
        });
        setStudentCourses(filteredCourses); // עדכון הקורסים של התלמיד
      }
    } catch (e) {
      console.error(e);
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
      <Button label="היכנס" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} onClick={() => { EnterCourse(course) }} />
      <Button label="מחק" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} onClick={() => { DeleteStudentFromCourse(course) }} />
    </>
  );

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
               <h3>מורה:{teacherNames[course.teacher] || "Loading..."}</h3> 
              
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Home;