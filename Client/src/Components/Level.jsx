
import React, { useState } from "react";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Level = () => {
    const [products, setProducts] = useState([]); 
    const location = useLocation();
    
    // קבלת הנתונים שנשלחו מ-PRACTICE
    const { practice, learning, level} = location.state || {}; // אם אין נתונים, תשתמש בערך ברירת מחדל

    // פונקציה לשמירת הנתונים
    const saveLevel = async () => {
        const data = {
            number: level,  // הרמה בברירת מחדל, אפשר לשנות אם נדרש
            learning: learning.map(i => i._id),    // מיפוי של ה-ID של כל אובייקט בלמידה
            practice: practice.map(i => i._id)     // מיפוי של ה-ID של כל אובייקט בפרקטיקה
        }

        try {
            console.log(data);  // הצגת המידע שנשלח
            const res = await axios.post('http://localhost:6660/levels/', data);
            if (res.status === 200) {
                setProducts([...products, res.data]);  // עדכון רשימת המוצרים
            // setLevels([...Levels, res.data]);  // עדכון הרמה
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

