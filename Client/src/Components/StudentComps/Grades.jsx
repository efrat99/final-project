import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';

function Grades() {
    const [gradesByCourse, setGradesByCourse] = useState({});
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedCourseName, setSelectedCourseName] = useState(null);
    const [selectedCourseLanguage, setSelectedCourseLanguage] = useState(null); // חדש עבור השפה
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const user = useSelector((state) => state.token.user);

    useEffect(() => {
        const getGrades = async () => {
            try {
                const res = await axios.get(`http://localhost:6660/grades/student/${user._id}`);

                if (res.status === 200) {
                    const allGrades = res.data;
                    const groupedGrades = {};

                    // שליפת הציונים ומבנה הנתונים לפי קורס
                    for (const grade of allGrades) {
                        if (!grade.course) {
                            console.error("Missing course information for grade:", grade);
                            continue; // Skip if the courseId or courseName is missing
                        }
                        if (!groupedGrades[grade.course]) {
                            groupedGrades[grade.course] = { scores: [] };  // בהנחה שאין שם לקורס
                        }
                        groupedGrades[grade.course].scores.push(grade.mark);  // דחוף את הציון למערך
                    }

                    // שליפת השפה עבור כל קורס
                    for (const courseId of Object.keys(groupedGrades)) {
                        const languageRes = await axios.get(`http://localhost:6660/courses/${courseId}`);
                        if (languageRes.status === 200) {
                            const courseLanguage = languageRes.data.language; // השפה שהתקבלה
                            groupedGrades[courseId].language = courseLanguage; // שמירה של השפה במבנה הנתונים
                        }
                    }

                    setGradesByCourse(groupedGrades);
                }
            } catch (e) {
                console.error("Failed to fetch grades or course languages:", e);
            }
        };

        getGrades();
    }, [user._id]);

    useEffect(() => {
        if (selectedCourseId && gradesByCourse[selectedCourseId]) {
            const scores = gradesByCourse[selectedCourseId].scores;
            const labels = scores.map((_, index) => `${index + 1}`);
            const courseLanguage = gradesByCourse[selectedCourseId].language;

            const getBorderColor = (score) => {
                return score === 0 ? 'rgb(255, 98, 0)' : 'rgb(200, 50, 0)';
            };

            setChartData({
                labels,
                datasets: [
                    {
                        label: `ציונים לקורס ${courseLanguage}`,
                        data: scores,
                        backgroundColor: 'rgb(255, 98, 0)',  // צבע הרקע
                        borderColor: scores.map(score => getBorderColor(score)),  // קביעת צבע הגבול לכל ציון
                        borderWidth: scores.map(score => score === 0 ? 3 : 1),  // קביעת רוחב הגבול לפי הציון
                        // label: {
                        //     font: {
                        //         size: 18, // הגדלת גודל הגופן של הלייבל
                        //         weight: 'bold', // אם תרצה גם משקל מודגש
                        //     }
                        // }
                    }
                ]
            });


            setChartOptions({
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,  // מתחיל מהערך 0
                        min: 0,  // קובע שהציר לא ירד מתחת ל-0
                        max: 100,  // קובע שהציר יגיע עד 100
                        ticks: {
                            font: {
                                family: 'MyCustomFont',  // הגדרת הגופן לציר Y
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: 'MyCustomFont',  // הגדרת הגופן בכותרת
                            }
                        }
                    }
                }
            });



            // עדכון שם הקורס ושפת הקורס
            setSelectedCourseName(gradesByCourse[selectedCourseId].name);
            setSelectedCourseLanguage(gradesByCourse[selectedCourseId].language); // עדכון השפה
        }
    }, [selectedCourseId, gradesByCourse]);


    const renderAverage = () => {
        if (!selectedCourseId || !gradesByCourse[selectedCourseId]) return null;

        const scores = gradesByCourse[selectedCourseId].scores;
        const totalExpectedLevels = 4; // מספר השלבים הצפוי

        if (scores.length < totalExpectedLevels) return <p style={{ fontSize: '20px' }}>הקורס לא הושלם<br /><strong>מספר שלבים שהושלמו:</strong> {scores.length} מתוך {totalExpectedLevels}</p>;

        const average = (scores.reduce((sum, val) => sum + val, 0) / scores.length).toFixed(2);
        return <p style={{ fontSize: '20px' }}>הקורס הושלם<br /><strong>ציון ממוצע לקורס:</strong> {average}%</p>;
    };


    return (
        <>
            <h2>בחר קורס:</h2>
            <div style={{ marginBottom: '1rem' }}>
                {Object.keys(gradesByCourse).map(courseId => (
                    <Button
                        key={courseId}
                        onClick={() => setSelectedCourseId(courseId)}
                        label={gradesByCourse[courseId].language} // מציג את שם הקורס ושפת הקורס
                        style={{
                            margin: '0.25rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: selectedCourseId === courseId ? '#007ad9' : '#eee',
                            color: selectedCourseId === courseId ? '#fff' : '#000',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    />
                ))}
            </div>
            {selectedCourseId && (
                <div className="card">
                    {selectedCourseId && gradesByCourse[selectedCourseId] && gradesByCourse[selectedCourseId].scores.length > 0 && (
                        <>
                            {renderAverage()}
                            <div style={{ width: '500px', height: '300px', margin: '0 auto' }}>

                                <Chart type="bar" data={chartData} options={chartOptions} />
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}

export default Grades;
