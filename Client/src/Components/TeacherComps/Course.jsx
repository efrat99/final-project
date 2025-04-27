import { Card } from 'primereact/card';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { useNavigate } from 'react-router-dom';
import first from '../../Images/2.png';
import { useLocation } from 'react-router-dom';

const Course = () => {
    const navigate = useNavigate();
    const [Levels, setLevels] = useState([]);
   
    const location = useLocation();
    const { language ,courseId} = location.state || {}; // קבלת הרמה שנבחרה

    // const isLevelExists = Levels.some((l) => l.number === level);
  

    const handleLearningClick = (level) => {
        navigate('/learning', { state: { level: level ,courseId:courseId} });
    };
    const header = (
        <img alt="Card" src={first} style={{ width: '300px', height: '200px' }} />
    );
    const footer = (level) => (
        
        <Button label="הוסף" onClick={() => handleLearningClick(level)} />
    //     <Button
    //     label={isLevelExists ? "עדכן" : "הוסף"}
    //     onClick={() => handleLearningClick(level)}
    // />
    );
    return (<>
        <h1>הוספת קורס</h1>
      
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Card title="שלב 4" footer={footer('4')} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            <Card title="שלב 3" footer={footer('3')} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            <Card title="שלב 2" footer={footer('2')} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            <Card title="1 שלב" footer={footer('1')} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
        </div>
    </>
    );
}
export default Course;



