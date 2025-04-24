import React from 'react';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
const Home = () => {
  const navigate = useNavigate();
  const _id = useSelector(state => state.token.user._id)
  const studentCourses = courses.filter((course) => {
    return course.student.some((student) => student._id === _id);
  });


  const header = (
    <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
);
const footer = (
    <>
        <Button label="כניסה" icon="pi pi-check"  onClick={()=>{}}/>
        <Button label="Cancel" severity="secondary" icon="pi pi-times" style={{ marginLeft: '0.5em' }} />
    </>
);
  return (
    <div className="home">
      <h1>Student Home Page</h1>
      <div className="myCourses">
        <p>הקורסים שלי</p>
        <div className="courseListPerUser">
          {studentCourses.map((course) => (
            <Card title="Advanced Card" subTitle="Card subtitle" footer={footer} header={header} className="md:w-25rem">
            <p className="m-0">
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