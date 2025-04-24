import { useState, useEffect } from "react";
import axios from 'axios';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

//לא גמור!!
//צריך ליצור קורס כלשהו ע"מ לבדוק את הנכונות

// const Courses = async () => {
//     const [courses, setCourses] = useState([]);
//     const _id = "67e990d9f705145ac4f35189" //example id, replace with the actual id
//     const student = await axios.get(`http://localhost:6660/students/${_id}`);//מיותר אם מקבלים ID של STUDENT
//     try {
//         const res = await axios.get("http://localhost:6660/courses/");
//         if (res.status === 200) {
//             setCourses(res.data);
//         }
//     }
//     catch (e) {
//         console.error(e);
//     }
//     const studentCourses = courses.filter((course) => {
//         return course.students.some((student) => student._id === _id);
//     });
const Courses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const _id = "680a06bf8d8af53d9b7ba981"; // example id, replace with the actual id

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get("http://localhost:6660/courses/");
                setCourses(res.data);
            } catch (e) {
                console.error(e);
            }
        };

        fetchCourses();
    }, []);

    const teacherCourses = courses.filter((course) => {
        return course.teacher.some((teacher) => teacher._id === _id);
    });

    return (
        <div className="myCourses">
            <h1>My Courses</h1>
            <div className="courseListPerUser">
                {teacherCourses.map((course) => (
                    <div key={course._id} className="courseCard">
                        <h2>{course.name}</h2>
                        {/* <p>{course.description}</p> */}
                        {/* <button onClick={() => handleEnroll(course._id)}>Enroll</button> */}
                    </div>
                ))}
            </div>
            <Button onClick={() =>  navigate('/Course')}>הוספת קורס</Button>
            {/* ליצור ניתוב כלשהו לכל הקורסים שלא נמצאים ברשימת הקורסים של התלמיד, ככרטיס שנפתח
            או בדף אחר */}
            {/* add course */}
            <div className="courseList">
                {courses.map((course) => (
                    <div key={course._id} className="courseCard">
                        <h2>{course.language}</h2>
                        {/* <p>{course.description}</p> */}
                        {/* <button onClick={() => handleEnroll(course._id)}>Enroll</button> */}
                    </div>
                ))}
            </div>
        </div>


    );
}
export default Courses