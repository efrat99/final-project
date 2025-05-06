import { useState, useEffect } from "react";
import axios from 'axios';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useSelector } from 'react-redux';
import { Card } from 'primereact/card';
const Home = () => {

    const language = [
        { "value": "ערבית", "label": "ar" },
        { "value": "אנגלית", "label": "en" },
        { "value": "ספרדית", "label": "es" },
        { "value": "צרפתית", "label": "fr" },
        { "value": "גרמנית", "label": "de" },
        { "value": "רוסית", "label": "ru" },
        { "value": "סינית", "label": "zh" },
        { "value": "הינדי", "label": "hi" },
        { "value": "פורטוגזית", "label": "pt" },
        { "value": "יפנית", "label": "ja" },
        { "value": "איטלקית", "label": "it" },
        { "value": "הולנדית", "label": "nl" },
        { "value": "קוריאנית", "label": "ko" },
        { "value": "טורקית", "label": "tr" },
        { "value": "עברית", "label": "he" },
        { "value": "פרסית", "label": "fa" },
        { "value": "פולנית", "label": "pl" },
        { "value": "אוקראינית", "label": "uk" },
        { "value": "שוודית", "label": "sv" },
        { "value": "פינית", "label": "fi" },
        { "value": "נורווגית", "label": "no" },
        { "value": "דנית", "label": "da" },
        { "value": "צ'כית", "label": "cs" },
        { "value": "יוונית", "label": "el" },
        { "value": "תאית", "label": "th" },
        { "value": "אינדונזית", "label": "id" },
        { "value": "וייטנאמית", "label": "vi" },
        { "value": "הונגרית", "label": "hu" },
        { "value": "רומנית", "label": "ro" },
        { "value": "בולגרית", "label": "bg" },
        { "value": "סרבית", "label": "sr" },
        { "value": "סלובקית", "label": "sk" },
        { "value": "סלובנית", "label": "sl" },
        { "value": "קרואטית", "label": "hr" },
        { "value": "ליטאית", "label": "lt" },
        { "value": "לטבית", "label": "lv" },
        { "value": "אסטונית", "label": "et" },
        { "value": "מלאית", "label": "ms" },
        { "value": "בנגלית", "label": "bn" },
        { "value": "טאגאלוג", "label": "tl" },
        { "value": "סוואהילית", "label": "sw" },
        { "value": "מלטזית", "label": "mt" },
        { "value": "איסלנדית", "label": "is" },
        { "value": "אירית", "label": "ga" },
        { "value": "וולשית", "label": "cy" }
    ]

    const user = useSelector(state => state.token.user);
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [selectedlanguage, setSelectedlanguage] = useState(null);

    const _id = useSelector(state => state.token.user._id);
    const data = {
        language: selectedlanguage,
        teacher: user._id,
        students: [],
        levels: []
    }

    const getAvailableLanguages = () => {
        const usedLanguages = courses.map(course => course.language);
        return language.filter(lang => !usedLanguages.includes(lang.value));
    };

    const saveCourse = async () => {
        if (!selectedlanguage) {
            alert("בחירת שפה היא חובה");
            return;
        }
        try {
            const res = await axios.post("http://localhost:6660/courses", data);
            navigate('/level', { state: { language: language, courseId: res.data._id } });
        } catch (e) {
            console.error(e);
        }

    }


    useEffect(() => {
        const fetchCoursesWithStudents = async () => {
            try {
                const res = await axios.get("http://localhost:6660/courses");
                if (res.status === 200) {
                    const filteredCourses = await Promise.all(
                        res.data.filter(course => course.teacher === _id).map(async (course) => {
                            const students = await fetchStudents(course.students); // שליפת נתוני התלמידים
                            return { ...course, students };
                        })
                    );
                    setCourses(filteredCourses);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchCoursesWithStudents();
    }, [_id]);
    // פונקציה לשליפת תלמיד לפי ID או לפי מערך IDs
    const fetchStudents = async (studentIds) => {
        try {
            const ids = Array.isArray(studentIds) ? studentIds : [studentIds];
            const studentPromises = ids.map(async (id) => {
                const res = await axios.get(`http://localhost:6660/users/${id}`);
                return res.data;
            });

            const students = await Promise.all(studentPromises);
            return students.filter(student => student !== null); // סינון תלמידים שנכשלו
        } catch (e) {
            console.error("Error fetching students:", e);
            return [];
        }
    };
    const handleEnterCourse = (courseId) => {
        navigate(`/level`, { state: { courseId } });
    };

    return (
        <div className="myCourses">
            <h1>שלום {user.firstName}</h1>
            <h2>הקורסים שלי</h2>
            <div className="card flex justify-content-center">
                <Dropdown value={selectedlanguage} onChange={(e) => setSelectedlanguage(e.value)} options={getAvailableLanguages()} optionLabel="value"
                    placeholder="Select a language" className="w-full md:w-14rem" />
            </div>
            <Button onClick={() => { saveCourse() }}>הוספת קורס</Button>
            <div className="courseList">
                {courses.map((course) => (
                    <Card key={course._id}>
                        <div className="courseCard">
                            <h2>{course.name}</h2>
                            <h1>{course.language}</h1>
                            <h3>תלמידים:</h3>
                            <ul>
                                {course.students.map((student) => (
                                    <li key={student._id}>{student.firstName} {student.lastName}</li>
                                ))}
                            </ul>
                            <Button label="כניסה לקורס" onClick={() => handleEnterCourse(course._id)} />
                        </div></Card>
                ))}
            </div>
        </div>


    );
}
export default Home