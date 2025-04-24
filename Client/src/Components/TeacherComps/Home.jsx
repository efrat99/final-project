import React from 'react';
import { Button } from 'primereact/button'; 
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
  return (
    <div className="home">
      <h1>Teacher Home Page</h1>
      <p>Welcome to the Teacher Home Page</p>
      {/* Add more components or features here */}
      <Button onClick={() =>  navigate('/Courses')}> לצפייה בקורסים</Button>
    </div>
  );
}
export default Home;