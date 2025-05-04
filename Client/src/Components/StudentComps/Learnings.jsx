// import React from 'react';
// import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
// import { useState } from 'react';
// import axios from 'axios';
// import { Button } from 'primereact/button';
// import { useNavigate } from 'react-router-dom';
// const Learning = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { course, vocabulary, practice, level } = location.state || {};
//     return (<>
//         <Button onClick={() => { navigate('/studentLearning', { state: { vocabulary: vocabulary, practice: practice, course: course } }) }}>אוצר מילים</Button>
//         <Button onClick={() => { navigate('/studentPractice', { state: { practice: practice, course: course, level: level } }) }}>תרגול</Button>
//     </>
//     )
// }
// export default Learning;