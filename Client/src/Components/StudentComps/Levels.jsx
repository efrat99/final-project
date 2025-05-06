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
    const [validGrades, setValidGrades] = useState([]);

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
                    fetchedLevels.map(async (level) => {
                        try {
                            const response = await axios.get(`http://localhost:6660/grades`, {
                                params: {
                                    student: user._id,
                                    level: level._id,
                                },
                            });
                            if (response.data && response.status === 200) {
                                return {
                                    level: level,
                                    grade: response.data,
                                };
                            } else {
                                return null;
                            }
                        } catch (error) {
                            console.error(`Error fetching grade for level ${level._id}:`, error.message);
                            return null;
                        }
                    })
                );

                const resValidGrades = gradeResponses.filter((response) => response !== null);
                setValidGrades(resValidGrades);
            } catch (error) {
                console.error("Error fetching levels:", error);
            }
        };

        fetchLevelsAndGrades();
    }, [course, user]);

    // פונקציה לבדיקת אם אפשר לגשת לרמה
    const canAccessLevel = (levelNum) => {
        if (levelNum === 1) return true; // רמה 1 תמיד פתוחה
        const prevLevel = levels.find((l) => l.number === levelNum - 1); // מצא את הרמה הקודמת
        const prevLevelGrade = validGrades.find(
            (grade) => grade.level.number === prevLevel.number
        );
        return prevLevelGrade !== undefined; // אם יש ציון ברמה הקודמת, אפשר לגשת
    };

    const handleEnterLevel = (level) => {
        navigate("/studentLearning", {
            state: {
                course,
                level: level._id,
                vocabulary: level.learning,
                practice: level.practice,
                validGrades: validGrades,
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
                        // בדוק אם אפשר לגשת לרמה
                        const isAccessAllowed = canAccessLevel(level.number);
                        const isCompleted = validGrades.some((grade) => grade.level._id === level._id);

                        const footer = (
                            <Button
                                label={isCompleted ? "הושלם" : isAccessAllowed ? "התחל" : "נעול"}
                                icon={isCompleted ? "pi pi-check" : isAccessAllowed? "pi pi-book": "pi pi-lock"}
                                className={`p-button ${isCompleted ? "p-button-secondary" : "p-button-success"}`}
                                onClick={() => handleEnterLevel(level)}
                                disabled={!isAccessAllowed} // disable button אם אין גישה
                                style={{
                                    width: "100%",
                                    backgroundColor: isCompleted ? "gray" : "", // אפור אם הושלם
                                    color: isCompleted ? "white" : "", // צבע לבן אם הושלם
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
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default Levels;

