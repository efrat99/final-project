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
    const location = useLocation()
    const navigate = useNavigate()
    const { course } = location.state || {};
    const user = useSelector((state) => state.token.user);

    const [levels, setLevels] = useState([]);
    // const [completedLevelIds, setCompletedLevelIds] = useState([]);
    const [validGrades, setValidGrades] = useState([]);

    useEffect(() => {
        console.log(course);
        const fetchLevelsAndGrades = async () => {
            if (!course) {
                console.log("no courses");
            }
            if (!course?._id || !course?.levels?.length) return;

            try {
                const levelResponses = await Promise.all(

                    course.levels.map((levelId) =>
                        axios.get(`http://localhost:6660/levels/${levelId}`)
                    )
                );
                const fetchedLevels = levelResponses.map((res) => res.data);
                setLevels(fetchedLevels);
                console.log("Fetched levels:", fetchedLevels);

                console.log(user._id);


                const gradeResponses = await Promise.all(
                    fetchedLevels.map(async (level) => {
                        console.log(level._id);
                        try {
                            const response = await axios.get(`http://localhost:6660/grades`, {
                                params: {
                                    student: user._id, // סינון לפי הסטודנט הנוכחי
                                    level: level._id, // סינון לפי הרמה הנוכחית
                                },
                            });
                            if (response.data && response.status === 200) {
                                console.log(`Grade found for level ${level._id}:`, response.data);
                                return {
                                    level: level,
                                    grade: response.data,
                                };
                            } else {
                                console.log(`No grade for level ${level._id}`);
                                return null;
                            }
                        } catch (error) {
                            // טיפול בשגיאה במקרה ואין גרייד
                            if (error.response && error.response.status === 400) {
                                console.log(`No grade for level ${level._id}`);
                            } else {
                                console.error(`Error fetching grade for level ${level._id}:`, error.message);
                            }
                            return null;
                        }

                    }
                    )
                );

                // const completedIds = gradeResponses
                //     // console.log(completedIds);
                //     .filter((res) => res.data)
                //     .map((_, i) => fetchedLevels[i]._id);
                const resValidGrades = gradeResponses.filter((response) => response !== null);
                console.log("Valid grades and levels:", resValidGrades);
                // setCompletedLevelIds(completedIds);
                setValidGrades(resValidGrades);

            } catch (error) {
                console.error("Error fetching levels:", error);
            }
        }

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
                        // בדיקה אם הרמה הושלמה
                        const isCompleted = validGrades.some((grade) => grade.level._id === level._id);
    
                        const footer = (
                            <Button
                            label={isCompleted ? "הושלם" : "התחל"}
                            icon={isCompleted ? "pi pi-check" : "pi pi-book"}
                            className={`p-button ${isCompleted ? "p-button-secondary" : "p-button-success"}`}
                            onClick={() => handleEnterLevel(level)}
                            style={{
                                width: "100%",
                                backgroundColor: isCompleted ? "gray" : "", // אפור אם הושלם, אחרת ברירת מחדל
                                color: isCompleted ? "white" : "", // צבע טקסט לבן עבור אפור
                            }}
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
                            </Card>
                        );
                    })}
            </div>
        </div>
    );

//         <div>
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     gap: "20px",
//                     flexWrap: "wrap",
//                 }}
//             >
//                 {levels
//                     .sort((a, b) => a.number - b.number)
//                     .map((level) => {
//                         const isCompleted = validGrades.includes(level._id);

//                         const footer = (
//                             <Button
//                                 label={isCompleted ? "הושלם" : "למד"}
//                                 icon={isCompleted ? "pi pi-check" : "pi pi-book"}
//                                 className={`p-button ${isCompleted ? "p-button-secondary" : "p-button-success"
//                                     }`}
//                                 onClick={() => handleEnterLevel(level)}
//                                 disabled={isCompleted}
//                                 style={{ width: "100%" }}
//                             />
//                         );

//                         const header = (
//                             <img
//                                 alt={`Level ${level.number}`}
//                                 src={getImageForLevel(level.number)}
//                                 style={{ width: "100%", height: "auto" }}
//                             />
//                         );

//                         return (
//                             <Card
//                                 key={level._id}
//                                 header={header}
//                                 footer={footer}
//                                 style={{ width: "250px", fontSize: "0.9rem" }}
//                                 className="md:w-20rem"
//                             >
//                             </Card>
//                         );
//                     })}
//             </div>
//         </div>
//     );
};

export default Levels;
