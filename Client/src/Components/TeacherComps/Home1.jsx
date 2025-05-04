// import React from 'react';
// import { Button } from 'primereact/button';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// const Home = () => {
//   const navigate = useNavigate();
//   const teacher = useSelector((state) => state.token.user)
//   return (
//     <div className="home">
//       <h1>שלום {teacher.firstName} {teacher.lastName}  </h1>
//       <h2>ברוך הבא למערכת ניהול הקורסים</h2>
//       <p>התלמידים שלך</p>
//       {/* <ul>
//         {teacher.students.map((student) => (
//           <li key={student._id}>
//             {student.firstName} {student.lastName}
//           </li>
//         ))}
//       </ul> */}

//       {/* Add more components or features here */}
//       <Button onClick={() => navigate('/course')}>לצפייה בקורסים שלך</Button>
//     </div>
//   );
// }
// export default Home;