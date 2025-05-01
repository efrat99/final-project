import { Button } from "primereact/button"
import React, { useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { useNavigate } from 'react-router-dom';

const Levels = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { course } = location.state || {};
    const [vocabulary, setVocabulary] = useState([]);
    const [practice, setPractice] = useState([]);
    const EnterCourse = async (numLevel) => {
        try {
            if (course.levels.length > 0) {
                // שליחת בקשות לכל ה-levels במקביל
                const responses = await Promise.all(
                    course.levels.map((levelId) =>
                        axios.get(`http://localhost:6660/levels/${levelId}`)
                    )
                );
    
                // יצירת מערך של אובייקטים עם המידע שהתקבל
                const levelArr = responses.map((res) => {
                    if (res.status === 200) {
                        return {
                            id: res.data._id,
                            number: res.data.number,
                            learning: res.data.learning,
                            practice: res.data.practice,
                        };
                    }
                    return null;
                }).filter((level) => level !== null); // סינון ערכים null במקרה של שגיאה
    
                // חיפוש ה-levels שהמספר שלהם שווה ל-numLevel
                const matchingLevel= levelArr.find((level) => level.number === numLevel);
    
                if (matchingLevel) {
                    console.log("Matching level:", matchingLevel);
    
                    // עדכון ה-state עם ה-learning של ה-level המתאים
                    setVocabulary(matchingLevel.learning);
                    setPractice(matchingLevel.practice);
                    console.log("Updated vocabulary:", matchingLevel.learning);
                    console.log("Updated practice:", matchingLevel.practice);
                    navigate('/learnings', { state: { course: course,vocabulary:matchingLevel.learning,practice: matchingLevel.practice} })
                } else {
                    console.log(`No level found with number ${numLevel}`);
                }
            }
        } catch (error) {
            console.error("Error fetching levels:", error);
        }
       }
        return (
            <div className="levels">
                <Button label="Level 1" icon="pi pi-check" className="p-button-success" onClick={() => { EnterCourse(1) }} />
                <Button label="Level 2" icon="pi pi-check" className="p-button-success" onClick={() => { EnterCourse(2) }} />
                <Button label="Level 3" icon="pi pi-check" className="p-button-success" onClick={() => { EnterCourse(3) }} />
                <Button label="Level 4" icon="pi pi-check" className="p-button-success" onClick={() => { EnterCourse(4) }} />
            </div>
        )

    }
    export default Levels;