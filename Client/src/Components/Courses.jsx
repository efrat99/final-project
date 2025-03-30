import { useState } from "react";
import axios from 'axios';

//לא גמור!!
//צריך ליצור קורס כלשהו ע"מ לבדוק את הנכונות

const Courses = async () => {
    const [courses, setCourses] = useState([]);
    const _id = "67e990d9f705145ac4f35189" //example id, replace with the actual id
    const student = await axios.get(`http://localhost:6660/students/${_id}`);
    try {
        const res = await axios.get("http://localhost:6660/courses/");
        if (res.status === 200) {
            setCourses(res.data);
        }
    }
    catch (e) {
        console.error(e);
    }
    const studentCourses = courses.filter((course) => {
        return course.students.some((student) => student._id === _id);
    });


    return (
        <div className="myCourses">
            <h1>My Courses</h1>
            <div className="courseListPerStudent">
                {studentCourses.map((course) => (
                    <div key={course._id} className="courseCard">
                        <h2>{course.name}</h2>
                        {/* <p>{course.description}</p> */}
                        {/* <button onClick={() => handleEnroll(course._id)}>Enroll</button> */}
                    </div>
                ))}
            </div>
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