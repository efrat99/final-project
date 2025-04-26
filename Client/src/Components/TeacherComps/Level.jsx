
import React, { useState } from "react";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Level = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    // קבלת הנתונים שנשלחו מ-PRACTICE
    const { practice, learning, level, courseId } = location.state || {}; // אם אין נתונים, תשתמש בערך ברירת מחדל

    // פונקציה לשמירת הנתונים
    const saveLevel = async () => {
        const data = {
            number: level,
            learning: learning.map(i => i._id),    // מיפוי של ה-ID של כל אובייקט בלמידה
            practice: practice.map(i => i._id)     // מיפוי של ה-ID של כל אובייקט בפרקטיקה
        }

        try {
            console.log(data);  // הצגת המידע שנשלח
            const res = await axios.post('http://localhost:6660/levels/', data);
            console.log('Response status:', res.status);
            if (res.status === 200) {
                console.log(res.data);  // הצגת התגובה מהשרת    
                setProducts([...products, res.data]);  // עדכון רשימת המוצרים

                const courseRes = await axios.get(`http://localhost:6660/courses/${courseId}`);
                const course = courseRes.data;
    
                // עדכון מערך ה-levels המקומי
                course.levels.push(res.data._id);
    
                // שליחת הקורס המעודכן לשרת
                await axios.put(`http://localhost:6660/courses/`, course);
                navigate('/course');
            }
        } catch (e) {
            console.error(e);  // טיפול בשגיאות
        }

    }

    return (
        <div>
            <h1>שמירת רמה</h1>
            <button onClick={saveLevel}>שמירה</button>
        </div>
    )
}

export default Level;

