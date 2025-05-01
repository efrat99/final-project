import { useState, useEffect } from "react";
import axios from 'axios';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useSelector } from 'react-redux';


const Course = () => {

    const language = [
        { "value": "ar", "label": "ערבית 🇸🇦" },
        { "value": "en", "label": "אנגלית 🇬🇧🇺🇸" },
        { "value": "es", "label": "ספרדית 🇪🇸" },
        { "value": "fr", "label": "צרפתית 🇫🇷" },
        { "value": "de", "label": "גרמנית 🇩🇪" },
        { "value": "ru", "label": "רוסית 🇷🇺" },
        { "value": "zh", "label": "סינית 🇨🇳" },
        { "value": "hi", "label": "הינדי 🇮🇳" },
        { "value": "pt", "label": "פורטוגזית 🇵🇹🇧🇷" },
        { "value": "ja", "label": "יפנית 🇯🇵" },
        { "value": "it", "label": "איטלקית 🇮🇹" },
        { "value": "nl", "label": "הולנדית 🇳🇱" },
        { "value": "ko", "label": "קוריאנית 🇰🇷" },
        { "value": "tr", "label": "טורקית 🇹🇷" },
        { "value": "he", "label": "עברית 🇮🇱" },
        { "value": "fa", "label": "פרסית 🇮🇷" },
        { "value": "pl", "label": "פולנית 🇵🇱" },
        { "value": "uk", "label": "אוקראינית 🇺🇦" },
        { "value": "sv", "label": "שוודית 🇸🇪" },
        { "value": "fi", "label": "פינית 🇫🇮" },
        { "value": "no", "label": "נורווגית 🇳🇴" },
        { "value": "da", "label": "דנית 🇩🇰" },
        { "value": "cs", "label": "צ'כית 🇨🇿" },
        { "value": "el", "label": "יוונית 🇬🇷" },
        { "value": "th", "label": "תאית 🇹🇭" },
        { "value": "id", "label": "אינדונזית 🇮🇩" },
        { "value": "vi", "label": "וייטנאמית 🇻🇳" },
        { "value": "hu", "label": "הונגרית 🇭🇺" },
        { "value": "ro", "label": "רומנית 🇷🇴" },
        { "value": "bg", "label": "בולגרית 🇧🇬" },
        { "value": "sr", "label": "סרבית 🇷🇸" },
        { "value": "sk", "label": "סלובקית 🇸🇰" },
        { "value": "sl", "label": "סלובנית 🇸🇮" },
        { "value": "hr", "label": "קרואטית 🇭🇷" },
        { "value": "lt", "label": "ליטאית 🇱🇹" },
        { "value": "lv", "label": "לטבית 🇱🇻" },
        { "value": "et", "label": "אסטונית 🇪🇪" },
        { "value": "ms", "label": "מלאית 🇲🇾" },
        { "value": "bn", "label": "בנגלית 🇧🇩" },
        { "value": "tl", "label": "טאגאלוג 🇵🇭" },
        { "value": "sw", "label": "סוואהילית 🇰🇪" },
        { "value": "mt", "label": "מלטזית 🇲🇹" },
        { "value": "is", "label": "איסלנדית 🇮🇸" },
        { "value": "ga", "label": "אירית 🇮🇪" },
        { "value": "cy", "label": "וולשית 🇬🇧" }
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
        const fetchCourses = async () => {
            try {
                const res = await axios.get("http://localhost:6660/courses");
                if (res.status === 200) {
                    const filteredCourses = res.data.filter((course) => {
                        return course.teacher === _id;
                    });
                    setCourses(filteredCourses); // Update state
                }
            }
            catch (e) {
                console.error(e);
            }
        };
        fetchCourses();
    }, [_id]);

    const handleEnterCourse = (courseId) => {
        navigate(`/level`, { state: { courseId } });
    };
    return (
        <div className="myCourses">
            <h1>הקורסים שלי</h1>
            <div className="card flex justify-content-center">
                <Dropdown value={selectedlanguage} onChange={(e) => setSelectedlanguage(e.value)} options={getAvailableLanguages()} optionLabel="label"
                    placeholder="Select a language" className="w-full md:w-14rem" />
            </div>
            <div className="courseListPerUser">
                {courses.map((course) => (
                    <div key={course._id} className="courseCard">
                        <h2>{course.name}</h2>
                    </div>
                ))}
            </div>
            <Button onClick={() => { saveCourse() }}>הוספת קורס</Button>
            <div className="courseList">
                {courses.map((course) => (
                    <div key={course._id} className="courseCard">
                        <h2>{course.name}</h2>
                        <h1>שפה:{course.language}</h1>
                        <Button label="כניסה לקורס" onClick={() => handleEnterCourse(course._id)} />
                    </div>
                ))}
            </div>
        </div>


    );
}
export default Course