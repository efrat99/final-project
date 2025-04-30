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
                    // console.log(res.data);  // Display the course details
                    // const resCourse=res.data
                    // navigate('/Course', { state: { course:resCourse  } });  // Navigate to the Course page with the course data
                }
            }

            // if (course.levels.length > 0) {
            //     try {
            //         // Fetch all levels
            //         const responses = await Promise.all(
            //             course.levels.map(levelId =>
            //                 axios.get(`http://localhost:6660/levels/${levelId}`)
            //             )
            //         );
            
            //         // Create an object where each key is levelId and each value is the learnings array
            //         const levelsLearnings = responses.reduce((acc, res, index) => {
            //             if (res.status === 200) {
            //                 acc[course.levels[index]] = res.data.learning; // group learnings by levelId
            //             }
            //             return acc;
            //         }, {});
            
            //         // Update the state with the structured data
            //         setVocabulary(levelsLearnings);
            
            //         console.log("Updated vocabulary:", levelsLearnings);
            //     } catch (error) {
            //         console.error("Error fetching levels:", error);
            //     }
            // }
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
                <Button onClick={() => { navigate('/StudentLearning', { state: { vocabulary: vocabulary } }) }}>אוצר מילים</Button>
                <Button >תרגול</Button>
                {/* <span>{showCourse()}</span> */}
                {/* <h3>{course.language}</h3> */}
                {/* <p>Students Enrolled: {course.students.length}</p> */}
                {/* <button onClick={() => EnterCourse(course)}>Enter Course</button> */}
            </div>
        </>
    );
}
export default Course;