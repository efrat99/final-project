import { Card } from 'primereact/card';
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import first from '../Images/2.png';
const Course= () => {
     const navigate = useNavigate();
    // const levels = [
    //     { label: 'Level 1', value: '1' },
    //     { label: 'Level 2', value: '2' },
    //     { label: 'Level 3', value: '3' },
    //     { label: 'Level 4', value: '4' }
    // ];
const saveCourse = async () => {


}
    const handleLearningClick = (level) => {
        navigate('/learning', { state: { level: level } });
    };
    const header = (
        <img alt="Card" src={first} style={{ width: '300px', height: '200px' }} />
    );
    const footer = (level)=>(
        <Button label="הוסף" onClick={() => handleLearningClick(level)}/>
    );
    return (<>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <Card title="שלב 4" footer={footer('4')} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
        <Card title="שלב 3" footer={footer('3')} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
        <Card title="שלב 2" footer={footer('2')} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
        <Card title="1 שלב" footer={footer('1')} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
        </div>
        <Button label="הוסף קורס" onClick={saveCourse}  />
        </>
    );
}
export default Course;