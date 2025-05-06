
// import React, { useState, useEffect } from 'react';
// import { Chart } from 'primereact/chart';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// function Grades() {
//     const [chartData, setChartData] = useState({});
//     const [chartOptions, setChartOptions] = useState({});
//     const user = useSelector((state) => state.token.user)
//     const [uniqueCourses,setuniqueCourses]=useState()
//     useEffect(() => {
//         const getGrades = asyn() => {
//             try {
//                 const res = await axios.get(`http://localhost:6660/grades/${user._id}`)
//                 if (res.status == 200) {
//                   const allGrades =res.data 
//                     const allCourses = allGrades.map((grade)=>(grade.courseId))
//                     setuniqueCourses ( [...new Set(allCourses)]);
//             }}
//             catch (e) {

//             }
//         }
//         getGrades()
    
//         const data = {
//             labels: ['שלב 1', 'שלב 2', 'שלב 3', 'שלב 4'],
//             datasets: [
//                 {
//                     label: 'Grades',
//                     data: [100, 100, 100, 100],
//                     backgroundColor: [
//                         'rgba(255, 159, 64, 0.2)',
//                         'rgba(75, 192, 192, 0.2)',
//                         'rgba(54, 162, 235, 0.2)',
//                         'rgba(153, 102, 255, 0.2)'
//                     ],
//                     borderColor: [
//                         'rgb(255, 159, 64)',
//                         'rgb(75, 192, 192)',
//                         'rgb(54, 162, 235)',
//                         'rgb(153, 102, 255)'
//                     ],
//                     borderWidth: 1
//                 }
//             ]
//         };
//         const options = {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         };

//         setChartData(data);
//         setChartOptions(options);
//     }, []);

//     return (
//         <div className="card">
//             <Chart type="bar" data={chartData} options={chartOptions} />
//         </div>
//     );
// }

// export default Grades;