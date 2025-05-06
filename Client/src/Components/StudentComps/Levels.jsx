// import { Button } from "primereact/button"
// import React, { useEffect, useState } from "react"
// import { useLocation } from "react-router-dom"
// import axios from "axios"
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from "react-redux";

// const Levels = () => {
//     const location = useLocation()
//     const navigate = useNavigate()
//     const { course } = location.state || {};
//     const [vocabulary, setVocabulary] = useState([]);
//     const [practice, setPractice] = useState([]);
//     const [isPracticeDisabled, setIsPracticeDisabled] = useState([]); // State to control the button
//     const [levelArray, setLevelArray] = useState([]);
//     const [completedLevels, setCompletedLevels] = useState([]); // שלבים עם ציונים
//     const user = useSelector(state => state.token.user); // Get the current user from Redux


//     useEffect(() => {
//             const getLevelsArray = async () => {
//                 console.log(course);

//                 if (!course || !course._id) {
//                     console.error("Course or course._id is not defined");
//                     return;
//                 }
//             try {
//                 const res = await axios.get(`http://localhost:6660/courses/${course._id}`);
//                 setLevelArray(res.levels);
//             } catch (error) {
//                 console.error("Error fetching grades:", error);
//             }
//         }

//         const checkPracticeStatus = async () => {
//             const completed = [];
//             for (const level of levelArray) {
//                 try {
//                     const response = await axios.get(`http://localhost:6660/grades`, {
//                         params: {
//                             student: user._id, // Filter by the current student
//                             level: level._id, // Filter by the current level
//                         },
//                     });
//                     if (response.data) {
//                         completed.push(level._id); // הוספת ה-ID של השלב עם ציון
//                     }
//                 } catch (error) {
//                     console.error("Error fetching grades:", error);
//                 }
//             }
//             setCompletedLevels(completed); // עדכון ה-state עם השלבים שהושלמו
//         };
//         getLevelsArray();
//         checkPracticeStatus();
//     }, []);


//     const EnterCourse = async (numLevel) => {
//         try {
//             if (course.levels.length > 0) {
//                 // שליחת בקשות לכל ה-levels במקביל
//                 const responses = await Promise.all(
//                     course.levels.map((levelId) =>
//                         axios.get(`http://localhost:6660/levels/${levelId}`)
//                     )
//                 );

//                 // יצירת מערך של אובייקטים עם המידע שהתקבל
//                 const levelArr = responses.map((res) => {
//                     if (res.status === 200) {
//                         return {
//                             id: res.data._id,
//                             number: res.data.number,
//                             learning: res.data.learning,
//                             practice: res.data.practice,
//                         };
//                     }
//                     return null;
//                 })
//                 //לכאורה זה מיותר? לבדוק את זה
//                 //.filter((level) => level !== null); // סינון ערכים null במקרה של שגיאה

//                 // חיפוש ה-levels שהמספר שלהם שווה ל-numLevel
//                 const matchingLevel = levelArr.find((level) => level.number === numLevel);

//                 if (matchingLevel) {
//                     console.log("Matching level:", matchingLevel);

//                     // עדכון ה-state עם ה-learning של ה-level המתאים
//                     setVocabulary(matchingLevel.learning);
//                     setPractice(matchingLevel.practice);
//                     console.log("Updated vocabulary:", matchingLevel.learning);
//                     console.log("Updated practice:", matchingLevel.practice);
//                     navigate('/studentLearning', { state: { course: course, level: matchingLevel._id, vocabulary: matchingLevel.learning, practice: matchingLevel.practice, level: matchingLevel.id } })
//                 } else {
//                     console.log(`No level found with number ${numLevel}`);
//                 }
//             }
//         } catch (error) {
//             console.error("Error fetching levels:", error);
//         }
//     }
//     return (
//         <div className="levels">
//         {levelArray && levelArray.length > 0 ? (
//             levelArray.map((level) => (
//                 <Button
//                     key={level._id}
//                     label={`Level ${level.number}`}
//                     icon="pi pi-check"
//                     className={`p-button ${completedLevels.includes(level._id) ? 'p-button-secondary' : 'p-button-success'}`}
//                     onClick={() => EnterCourse(level.number)}
//                 />
//             ))
//         ) : (
//             <p>טוען שלבים...</p> // הודעה למשתמש בזמן הטעינה
//         )}
//     </div>
//     )

// }
// export default Levels;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";

import level1 from "../../Images/level1.jpg";
import level2 from "../../Images/level2.jpg";
import level3 from "../../Images/level3.jpg";
import level4 from "../../Images/level4.jpg";

const Levels = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { course } = location.state || {};
    const user = useSelector((state) => state.token.user);

    const [levels, setLevels] = useState([]);
    const [completedLevelIds, setCompletedLevelIds] = useState([]);

    useEffect(() => {
        const fetchLevelsAndGrades = async () => {
            if (!course?._id || !course?.levels?.length) return;

            try {
                const levelResponses = await Promise.all(
                    course.levels.map((levelId) =>
                        axios.get(`http://localhost:6660/levels/${levelId}`)
                    )
                );
                const fetchedLevels = levelResponses.map((res) => res.data);
                setLevels(fetchedLevels);


                const gradeResponses = await Promise.all(
                    fetchedLevels.map((level) =>
                        axios.get(`http://localhost:6660/grades`, {
                            params: {
                                student: user._id, // Filter by the current student
                                level: level._id, // Filter by the current level
                            },
                        })
                    )
                );
                const completedIds = gradeResponses
                    .filter((res) => res.data)
                    .map((_, i) => fetchedLevels[i]._id);

                setCompletedLevelIds(completedIds);
            } catch (error) {
                console.error("Error fetching levels or grades:", error);
            }
        };

        fetchLevelsAndGrades();
    }, [course, user]);

    const handleEnterLevel = (level) => {
        navigate("/studentLearning", {
            state: {
                course,
                level: level._id,
                vocabulary: level.learning,
                practice: level.practice,
            },
        });
    };

    const getImageForLevel = (number) => {
        const images = [level1, level2, level3, level4];
        return images[number - 1] || level1;
    };

    return (
        <div>
            {/* <h2 style={{ textAlign: "center", margin: "1rem 0" }}>בחר שלב</h2> */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    flexWrap: "wrap",
                }}
            >
                {levels
                    .sort((a, b) => a.number - b.number)
                    .map((level) => {
                        const isCompleted = completedLevelIds.includes(level._id);

                        const footer = (
                            <Button
                                label={isCompleted ? "הושלם" : "למד"}
                                icon={isCompleted ? "pi pi-check" : "pi pi-book"}
                                className={`p-button ${isCompleted ? "p-button-secondary" : "p-button-success"
                                    }`}
                                onClick={() => handleEnterLevel(level)}
                                disabled={isCompleted}
                                style={{ width: "100%" }}
                            />
                        );

                        const header = (
                            <img
                                alt={`Level ${level.number}`}
                                src={getImageForLevel(level.number)}
                                style={{ width: "100%", height: "auto" }}
                            />
                        );

                        return (
                            <Card
                                key={level._id}
                                header={header}
                                footer={footer}
                                style={{ width: "250px", fontSize: "0.9rem" }}
                                className="md:w-20rem"
                            >
                                <div style={{ textAlign: "center" }}>
                                    <h3>שלב {level.number}</h3>
                                </div>
                            </Card>
                        );
                    })}
            </div>
        </div>
    );
};

export default Levels;
