
// import React, { useState, useEffect } from 'react';
// import { Chart } from 'primereact/chart';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// function Grades() {
//     const [chartData, setChartData] = useState({});
//     const [chartOptions, setChartOptions] = useState({});
//     const user = useSelector((state) => state.token.user);
//     const [gradesByCourse, setGradesByCourse] = useState({}); // Store grades grouped by course

//     useEffect(() => {
//         const getGrades = async () => {
//             try {
//                 const res = await axios.get(`http://localhost:6660/grades/student/${user._id}`);
//                 if (res.status === 200) {
//                     const allGrades = res.data;

//                     // Group grades by course
//                     const groupedGrades = allGrades.reduce((acc, grade) => {
//                         if (!acc[grade.courseId]) {
//                             acc[grade.courseId] = [];
//                         }
//                         acc[grade.courseId].push(grade.mark); // Assuming `grade.score` holds the grade
//                         return acc;
//                     }, {});

//                     setGradesByCourse(groupedGrades);
//                 }
//             } catch (e) {
//                 console.error("Failed to fetch grades:", e);
//             }
//         };

//         getGrades();
//     }, [user._id]);

//     useEffect(() => {
//         if (Object.keys(gradesByCourse).length > 0) {
//             // const courses = Object.keys(gradesByCourse);
//             // const labels = courses.map(courseId => `Course ${courseId}`);
//             const datasets = courses.map((courseId, index) => ({
//                 label: `Course ${courseId}`,
//                 data: gradesByCourse[courseId],
//                 backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.2)`,
//                 borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
//                 borderWidth: 1
//             }));

//             setChartData({
//                 labels,
//                 datasets
//             });

//             setChartOptions({
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             });
//         }
//     }, [gradesByCourse]);

//     return (
//         <div className="card">
//             <Chart type="bar" data={chartData} options={chartOptions} />
//         </div>
//     );
// }

// export default Grades;