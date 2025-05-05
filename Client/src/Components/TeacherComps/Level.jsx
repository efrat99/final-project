import { Card } from 'primereact/card';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { useNavigate } from 'react-router-dom';
import level1 from '../../Images/level1.jpg';
import level2 from '../../Images/level2.jpg';
import level3 from '../../Images/level3.jpg'; 
import level4 from '../../Images/level4.jpg';
import { useLocation } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';  

const Level = () => {
    const navigate = useNavigate();
    const [Levels, setLevels] = useState([]);
    const [course, setCourse] = useState(null);
    const [levelArr, setLevelArr] = useState([]);

    const location = useLocation();
    const { language, courseId } = location.state || {};


    useEffect(() => {
        const fetching = async () => {
            try {
                const courseRes = await axios.get(`http://localhost:6660/courses/${courseId}`);
                setCourse(courseRes.data);
                const levels = courseRes.data.levels || [];
                console.log("levels", levels);

                const responses = await Promise.all(
                    levels.map((levelId) =>
                        axios.get(`http://localhost:6660/levels/${levelId}`)
                    )
                );
                const levelsData = responses.map(res => res.data);
                console.log("levelsData", levelsData);
                setLevelArr([...levelsData]);
                console.log(levelArr);
            }
            catch (e) {
                console.error(e);
            }
        }
        fetching();
    }, []);


    const handleLearningClick = async (level, exists) => {
        console.log("courseId " + courseId);
        const data = {
            number: level,
            learning: [],
            practice: []
        }
        console.log(data);
        try {
            console.log(data);  // הצגת המידע שנשלח
            if (!exists) {
                const res = await axios.post('http://localhost:6660/levels/', data);
                console.log('Response status:', res.status);
                if (res.status === 200) {
                    console.log(res.data);  // הצגת התגובה מהשרת   


                    // עדכון מערך ה-levels המקומי
                    course.levels.push(res.data._id);

                    // שליחת הקורס המעודכן לשרת
                    await axios.put(`http://localhost:6660/courses/`, course);
                    navigate('/learning', { state: { language: language, courseId: courseId, level: res.data._id } });
                }
            }
            else {
                navigate('/learning', { state: { language: language, courseId: courseId, level: levelArr.find(l => l.number === level)._id } });
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    const header = (level) => {
        const images = [level1, level2, level3, level4]; // מערך התמונות לפי רמות
        return (
            <img alt={`Level ${level}`} src={images[level - 1]} style={{ width: '100%', height: 'auto' }} />
        );
    };
    
    const footer = (level) => {
        const exists = levelArr.some(l => l.number === level);
        return (
            <div className="card-footer">
            <Button
            
                label={exists ? "עדכן" : "הוסף"}
                onClick={() => handleLearningClick(level, exists)}
                 
                style={{ textAlign: 'center', width: '100%', height: '100%' }}
            />
            </div>
        );
    };


    return (<>
        <h1>הוספת שלבים</h1>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Card footer={footer(1)} header={header(1)} style={{ width: '100%', height: 'auto', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            <Card  footer={footer(2)} header={header(2)} style={{ width: '100%', height: 'auto', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            <Card  footer={footer(3)} header={header(3)} style={{ width: '100%', height: 'auto', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            <Card footer={footer(4)} header={header(4)} style={{ width: '100%', height: 'auto', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
        </div>
    </>
    );
}
export default Level;



