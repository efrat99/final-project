

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
    const [completedLevelIds, setCompletedLevelIds] = useState([]);

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
