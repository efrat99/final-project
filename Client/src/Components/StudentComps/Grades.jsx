
// import React, { useState, useEffect } from 'react';
// import { Chart } from 'primereact/chart';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// function Grades() {
//     const [chartData, setChartData] = useState({});
//     const [chartOptions, setChartOptions] = useState({});
//     const user = useSelector((state) => state.token.user);
//     const [gradesByCourse, setGradesByCourse] = useState({}); // Store grades grouped by course
//     const [courseNames, setCourseNames] = useState({}); // Map of courseId to courseName

//     // Fetch grades for the student
//     useEffect(() => {
//         const getGrades = asyn() => {
//             try {
//                 const res = await axios.get(`http://localhost:6660/grades/student/${user._id}`);
//                 if (res.status === 200) {
//                     const allGrades = res.data;
//                     console.log("Grades data:", allGrades);

//                     // Group grades by course
//                     const groupedGrades = allGrades.reduce((acc, grade) => {
//                         if (!acc[grade.course]) {
//                             acc[grade.course] = [];
//                         }
//                         acc[grade.course].push(grade.mark); // Assuming `grade.mark` holds the grade
//                         return acc;
//                     }, {});

//                     setGradesByCourse(groupedGrades);
//                     console.log("Grades grouped by course:", groupedGrades);
//                 }
//             } catch (e) {
//                 console.error("Failed to fetch grades:", e);
//             }
//         };

//         getGrades();
//     }, [user._id]);

//     // Fetch course names
//     useEffect(() => {
//         const fetchCourseNames = async () => {
//             try {
//                 const res = await axios.get('http://localhost:6660/courses'); // API שמחזיר את כל הקורסים
//                 if (res.status === 200) {
//                     const courses = res.data;
//                     const courseMap = courses.reduce((acc, course) => {
//                         acc[course._id] = course.name; // Map courseId to courseName
//                         return acc;
//                     }, {});
//                     setCourseNames(courseMap);
//                 }
//             } catch (e) {
//                 console.error("Failed to fetch course names:", e);
//             }
//         };

//         fetchCourseNames();
//     }, []);

//     // Update chart data
//     useEffect(() => {
//         if (Object.keys(gradesByCourse).length > 0) {
//             const courses = Object.keys(gradesByCourse);
//             const labels = courses.map(courseId => courseNames[courseId] || `Course ${courseId}`); // השתמש בשם הקורס אם קיים
//             const datasets = courses.map((courseId, index) => ({
//                 label: courseNames[courseId] || `Course ${courseId}`, // השתמש בשם הקורס אם קיים
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
//     }, [gradesByCourse, courseNames]); // הוסף את courseNames כתלות

//     return (
//         <div className="card">
//             <Chart type="bar" data={chartData} options={chartOptions} />
//         </div>
//     );
// }

// export default Grades;