import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
const Course = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { course } = location.state || {};
    const [vocabulary, setVocabulary] = useState([]);
    const showCourse = async () => {
        console.log(course)
        try {
            if (course.levels.length > 0) {
                const res = await axios.get(`http://localhost:6660/levels/${course.levels[0]}`);  // Fetch the course details from the server
                if (res.status === 200) {
                    const arr = res.data.learning
                    setVocabulary((prevVocabulary) => [...prevVocabulary,...arr])
                    console.log(vocabulary)
                }
            }

        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        showCourse();
    }, []);
    useEffect(() => {
        console.log("Vocabulary updated:", vocabulary);
    }, [vocabulary]);
    return (
        <>
            <h1>hi</h1>
            <h2>כאן אמורים להופיע פרטי המידע על הקורס</h2>
            <div className="course-card">
                <Button onClick={() => { navigate('/levels', { state: { course: course } }) }}>כניסה לקורס</Button>
                {/* <Button onClick={() => { navigate('/StudentLearning', { state: { vocabulary: vocabulary } }) }}>אוצר מילים</Button>
                <Button >תרגול</Button> */}
            </div>
        </>
    );
}
export default Course;