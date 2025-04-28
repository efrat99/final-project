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
            if (course.level.length > 0) {
                const res = await axios.get(`http://localhost:6660/levels/${course.level[0]}`);  // Fetch the course details from the server
                if (res.status === 200) {
                    setVocabulary (res.data.learning)

                    // console.log(res.data);  // Display the course details
                    // const resCourse=res.data
                    // navigate('/Course', { state: { course:resCourse  } });  // Navigate to the Course page with the course data
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
    return (

        <>
            <h1>hi</h1>
            <h2>כאן אמורים להופיע פרטי המידע על הקורס</h2>
            <div className="course-card">
                <Button onClick={() => { navigate('/StudentLearning',{state:{vocabulary:vocabulary}}) }}>אוצר מילים</Button>
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