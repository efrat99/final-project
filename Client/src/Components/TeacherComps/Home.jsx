import { useState, useEffect } from "react";
import axios from 'axios';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import Flag from 'react-world-flags';
const Home = () => {

    const language = [
        { "value": "ערבית", "label": "ae" },  // United Arab Emirates (ערבית)
        { "value": "אנגלית", "label": "us" },  // United States (אנגלית)
        { "value": "ספרדית", "label": "es" },  // Spain (ספרדית)
        { "value": "צרפתית", "label": "fr" },  // France (צרפתית)
        { "value": "גרמנית", "label": "de" },  // Germany (גרמנית)
        { "value": "רוסית", "label": "ru" },  // Russia (רוסית)
        { "value": "סינית", "label": "cn" },  // China (סינית)
        { "value": "הינדי", "label": "in" },  // India (הינדי)
        { "value": "פורטוגזית", "label": "pt" },  // Portugal (פורטוגזית)
        { "value": "יפנית", "label": "jp" },  // Japan (יפנית)
        { "value": "איטלקית", "label": "it" },  // Italy (איטלקית)
        { "value": "הולנדית", "label": "nl" },  // Netherlands (הולנדית)
        { "value": "קוריאנית", "label": "kr" },  // South Korea (קוריאנית)
        { "value": "טורקית", "label": "tr" },  // Turkey (טורקית)
        { "value": "עברית", "label": "il" },  // Israel (עברית)
        { "value": "פרסית", "label": "ir" },  // Iran (פרסית)
        { "value": "פולנית", "label": "pl" },  // Poland (פולנית)
        { "value": "אוקראינית", "label": "ua" },  // Ukraine (אוקראינית)
        { "value": "שוודית", "label": "se" },  // Sweden (שוודית)
        { "value": "פינית", "label": "fi" },  // Finland (פינית)
        { "value": "נורווגית", "label": "no" },  // Norway (נורווגית)
        { "value": "דנית", "label": "dk" },  // Denmark (דנית)
        { "value": "צ'כית", "label": "cz" },  // Czech Republic (צ'כית)
        { "value": "יוונית", "label": "gr" },  // Greece (יוונית)
        { "value": "תאית", "label": "th" },  // Thailand (תאית)
        { "value": "אינדונזית", "label": "id" },  // Indonesia (אינדונזית)
        { "value": "וייטנאמית", "label": "vn" },  // Vietnam (וייטנאמית)
        { "value": "הונגרית", "label": "hu" },  // Hungary (הונגרית)
        { "value": "רומנית", "label": "ro" },  // Romania (רומנית)
        { "value": "בולגרית", "label": "bg" },  // Bulgaria (בולגרית)
        { "value": "סרבית", "label": "rs" },  // Serbia (סרבית)
        { "value": "סלובקית", "label": "sk" },  // Slovakia (סלובקית)
        { "value": "סלובנית", "label": "si" },  // Slovenia (סלובנית)
        { "value": "קרואטית", "label": "hr" },  // Croatia (קרואטית)
        { "value": "ליטאית", "label": "lt" },  // Lithuania (ליטאית)
        { "value": "לטבית", "label": "lv" },  // Latvia (לטבית)
        { "value": "אסטונית", "label": "ee" },  // Estonia (אסטונית)
        { "value": "מלאית", "label": "my" },  // Malaysia (מלאית)
        { "value": "בנגלית", "label": "bd" },  // Bangladesh (בנגלית)
        { "value": "טאגאלוג", "label": "ph" },  // Philippines (טאגאלוג)
        { "value": "סוואהילית", "label": "ke" },  // Kenya (סוואהילית)
        { "value": "מלטזית", "label": "mt" },  // Malta (מלטזית)
        { "value": "איסלנדית", "label": "is" },  // Iceland (איסלנדית)
        { "value": "אירית", "label": "ie" },  // Ireland (אירית)
        { "value": "וולשית", "label": "gb" }  // Wales (וולשית)
    ];


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

    const getCountryCode = (langName) => {
        const match = language.find(lang => lang.value === langName);
        return match ? match.label : null;
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px", gap: "30px" }}>
                {/* הקורסים שלי */}
                <div style={{ flex: "0 0 75%", backgroundColor: "#f9f9f9", borderRadius: "12px", padding: "20px", boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)" }}>
                    <h2 style={{ textAlign: "center", marginBottom: "20px", fontSize: "1.5rem", color: "#333" }}>הקורסים שלי</h2>

                    <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
                        {courses.map((course) => (
                            <Card
                                key={course._id}
                            >
                                <div className="courseCard" style={{ textAlign: "center", padding: "20px", display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                        <Flag code={getCountryCode(course.language)} style={{ width: '300px', height: '100px', objectFit: "cover", borderRadius: '5px' }} />
                                    </div>
                                    <h3 style={{ marginTop: "15px", fontSize: "1.5rem", color: "#333", fontWeight: "600" }}>{course.language}</h3>
                                    {course.students.length > 0 ? (
                                        <>
                                            <h4 style={{ margin: "10px 0", fontSize: "1rem", color: "#666" }}>תלמידים:</h4>
                                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                                {course.students.map((student) => (
                                                    <li key={student._id} style={{ margin: "2px 0", color: "#333", fontSize: "0.95rem" }}>
                                                        {student.firstName} {student.lastName}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>) : (
                                        <h4 style={{ margin: "10px 0", fontSize: "1rem", color: "#666" }}>אין תלמידים</h4>
                                    )}
                                    {/* <>{checkCourse(course)}</>
                                    <p>{message}</p> */}
                                    <Button label="כניסה לקורס" onClick={() => handleEnterCourse(course._id)} className="p-button-primary p-mt-3" style={{ width: "100%" }} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>


                {/*  הוספת קורס */}
                <div style={{ position: "fixed", left: "50px", flex: "0 0 30%", backgroundColor: "#f9f9f9", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>

                    <h3 style={{ textAlign: "center", marginBottom: "20px" }}>הוספת קורס</h3>
                    <Dropdown
                        value={selectedlanguage}
                        onChange={(e) => setSelectedlanguage(e.value)}
                        options={getAvailableLanguages()}
                        optionLabel="value"
                        placeholder="בחר שפה"
                        className="p-mb-4 w-full md:w-14rem"
                        style={{ marginBottom: "20px", borderRadius: "8px", backgroundColor: "#fff", marginRight: "24%" }}
                    />
                    <Button
                        style={{ padding: "10px 20px", borderRadius: "8px", width: "50%", backgroundColor: "#4CAF50", color: "white", border: "none", marginRight: "24%" }}
                        onClick={() => { saveCourse() }}
                    >
                        הוספת קורס
                    </Button>
                </div>
            </div>

        </div>


    );
}
export default Home