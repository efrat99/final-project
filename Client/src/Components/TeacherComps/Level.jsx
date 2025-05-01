import { Card } from 'primereact/card';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { useNavigate } from 'react-router-dom';
import first from '../../Images/3.png';
import { useLocation } from 'react-router-dom';
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

            // const courseRes = await axios.get(`http://localhost:6660/levels/`, {
            //     params: {
            //         courseId: courseId,
            //         number: level,
            //     },
            // });
            // const course = courseRes.data;

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

    const header = (
        <img alt="Card" src={first} style={{ width: '300px', height: '200px' }} />
    );

    const footer = (level) => {
        const exists = levelArr.some(l => l.number === level);
        return (
            <Button
                label={exists ? "עדכן" : "הוסף"}
                onClick={() => handleLearningClick(level, exists)}
            />
        );
    };


    return (<>
        <h1>הוספת שלבים</h1>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Card title="שלב 1" footer={footer(1)} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            <Card title="שלב 2" footer={footer(2)} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            <Card title="שלב 3" footer={footer(3)} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            <Card title="שלב 4" footer={footer(4)} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
        </div>
    </>
    );
}
export default Level;



