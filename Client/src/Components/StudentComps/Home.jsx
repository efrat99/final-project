import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
const Home = () => {

  const navigate = useNavigate();
  const studentCourses = courses.filter((course) => {
    return course.student.some((student) => student._id ===_id);
});
  return (
    <div className="home">
      <h1>Student Home Page</h1>
      <p>Welcome to the Student Home Page!</p>
      <p>הקורסים שלי</p>
      {/* <Button onClick={() => navigate('/Courses')}> לצפייה בקורסים</Button> */}
      {/* Add more components or features here */}
    </div>
  );
}
export default Home;