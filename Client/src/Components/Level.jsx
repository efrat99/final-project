
// import React, { useState } from "react";
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';

// const Level = () => {
//     const [products, setProducts] = useState([]); 
//    const location = useLocation();
//    const { practice, learning, level } = location.state || {}; // קבלת הנתונים שנשלחו
//     const saveLevel = async () => {
       

//         const data = {
//             number:Number(level.number[0].cname),
//             learning:learning.map(i=>i._id),//??
//             practice:practice.map(i=>i._id)//??
//         }

//         try {
//             console.log(data)
//             const res = await axios.post('http://localhost:6660/levels/', data);
//             if (res.status === 200) {
//                 setProducts([...products, res.data]);
//                 // reset();
//             }
//         } catch (e) {
//             console.error(e);
//         }
//     }
//     return (
//         <div>
//             <h1>Save Level</h1>
//             <button onClick={saveLevel}>Save Level</button>
//         </div>
//     )
// }
// export default Level;
import React, { useState } from "react";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Level = () => {
    const [products, setProducts] = useState([]); 
    const location = useLocation();
    
    // קבלת הנתונים שנשלחו מ-PRACTICE
    const { practice, learning, level } = location.state || {}; // אם אין נתונים, תשתמש בערך ברירת מחדל

    // פונקציה לשמירת הנתונים
    const saveLevel = async () => {
        const data = {
            number: Number(level.number[0].cname),  // המרה למספר
            learning: learning.map(i => i._id),    // מיפוי של ה-ID של כל אובייקט בלמידה
            practice: practice.map(i => i._id)     // מיפוי של ה-ID של כל אובייקט בפרקטיקה
        }

        try {
            console.log(data);  // הצגת המידע שנשלח
            const res = await axios.post('http://localhost:6660/levels/', data);
            if (res.status === 200) {
                setProducts([...products, res.data]);  // עדכון רשימת המוצרים
            }
        } catch (e) {
            console.error(e);  // טיפול בשגיאות
        }
    }

    return (
        <div>
            <h1>Save Level</h1>
            <button onClick={saveLevel}>Save Level</button>
        </div>
    )
}

export default Level;
