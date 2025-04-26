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
  const _id = useSelector(state => state.token.user._id)
  const fetchCourses = async () => {
    try {
        const res = await axios.get("http://localhost:6660/courses/");
        if (res.status === 200) {
          setCourses(res.data); // Update state with all courses
            const filteredCourses = res.data.filter((course) => {
                return course.students.some((student) => student === _id);
            });
            setStudentCourses(filteredCourses); // Update state
        }
    } catch (e) {
        console.error(e);
    }
};
  useEffect(() => {
  
      fetchCourses();
  }, [_id]);

const AddStudentToCourse = async (course) => {  
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




  const header = (
    <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
);
const footer =(course)=> (
    <>
      <Button label="הכנס" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} onClick={()=>{}}/>
        <Button label="מחק" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} onClick={()=>{DeleteStudentFromCourse(course)}} />
    </>
);

  return (
    <div className="home">
      <h1>קורסים לבחירה</h1>
      {Courses.map((course) => (
            <Card title="Advanced Card" subTitle="Card subtitle" header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-25rem">
            <p className="m-0">{course.language}</p>
            <Button label="הרשם" icon="pi pi-check"  onClick={()=>{AddStudentToCourse(course)}} disabled={course.students.includes(_id)}/>
        </Card>
          ))}
      <div className="myCourses">
        <p>הקורסים שלי</p>
        <div className="courseListPerUser">
          {studentCourses.map((course) => (
            <Card title="Advanced Card" subTitle="Card subtitle" footer={footer(course)} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-25rem">
            <p className="m-0">{course.language}
            </p>
        </Card>
          ))}
        </div>
      </div>
      {/* <Button onClick={() => navigate('/Courses')}> לצפייה בקורסים</Button> */}
      {/* Add more components or features here */}
    </div>
  );
}
export default Home;