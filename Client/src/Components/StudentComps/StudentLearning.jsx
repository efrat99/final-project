// // import React, { useState, useEffect } from 'react';
// // import { Card } from 'primereact/card';
// // import { useLocation } from 'react-router-dom';
// // import axios from 'axios';
// // import '../../FlipCard.css'; // נקרא לקובץ CSS שבו נמצא האפקט

// // const StudentLearning = () => {
// //     const location = useLocation();
// //     const { vocabulary } = location.state || {};
// //     const [flipped, setFlipped] = useState(false);
// //     const [objects, setObjects] = useState([]);

// //     // useEffect(() => {
// //     //     if (vocabulary && vocabulary.length > 0) {
// //     //         // קריאות GET BY ID
// //     //         vocabulary.map(async (id) => {
// //     //             try {
// //     //                 const response = await axios.get(`http://localhost:6660/learnings/${id}`);
// //     //                 if (response == 200) {
// //     //                     setObjects(prevObjects => [...prevObjects, response.data]);
// //     //                     console.log(objects)
// //     //                 }
// //     //             } catch (error) {
// //     //                 console.error(`Error fetching object with ID ${id}:`, error);
// //     //             }
// //     //         });
// //     //     }
// //     // }, []);
// //     // useEffect(() => {
// //     //     console.log("objects updated:", objects);
// //     // }, [objects]);

// //     useEffect(() => {
// //     const fetchData = async () => {
// //         if (vocabulary && vocabulary.length > 0) {
// //             try {
// //                 // Use Promise.all to fetch all data simultaneously
// //                 const responses = await Promise.all(
// //                     vocabulary.map((id) =>
// //                         axios.get(`http://localhost:6660/learnings/${id}`)
// //                     )
// //                 );

// //                 // Filter successful responses and extract data
// //                 const fetchedObjects = responses
// //                     .filter((response) => response.status === 200)
// //                     .map((response) => response.data);

// //                 setObjects(fetchedObjects); // Update state once
// //             } catch (error) {
// //                 console.error("Error fetching objects:", error);
// //             }
// //         }
// //     };

// //     fetchData();
// // }, [vocabulary]);

// // useEffect(() => {
// //     console.log("objects updated:", objects);
// // }, [objects]);

// // return (
// //     <div className="card-container" onClick={() => setFlipped(!flipped)}>
// //         {console.log(vocabulary)}
// //         <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
// //             <Card className="flip-card-front">
// //                 {/* <h3>Front Side {objects[0].Word}</h3> */}
// //                 <p>This is the front of the card. Click to flip!</p>
// //             </Card>
// //             <Card className="flip-card-back">
// //     <h3>Back Side</h3>
// //     {objects && objects.length > 0 ? (
// //         <ul>
// //             {objects.map((wordObj, index) => (
// //                 <li key={wordObj._id || index}>
// //                     {wordObj.word} - {wordObj.translatedWord}
// //                 </li>
// //             ))}
// //         </ul>
// //     ) : (
// //         <p>This is the back of the card.</p>
// //     )}
// // </Card>
// //         </div>
// //     </div>
// // );
// // }
// // export default StudentLearning;




import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../FlipCard.css';

const StudentLearning = () => {
    const location = useLocation();
    const { vocabulary } = location.state || {};
    const [objects, setObjects] = useState([]);
    const [flippedStates, setFlippedStates] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (vocabulary && vocabulary.length > 0) {
                try {
                    // Fetch all data for the vocabulary IDs
                    const responses = await Promise.all(
                        vocabulary.map((id) => axios.get(`http://localhost:6660/learnings/${id}`))
                    );

                    // Extract the data from successful responses
                    const fetchedObjects = responses
                        .filter((response) => response.status === 200)
                        .map((response) => response.data);

                    setObjects(fetchedObjects); // Update state with fetched objects
                    setFlippedStates(new Array(fetchedObjects.length).fill(false)); // Initialize flipped states
                } catch (error) {
                    console.error("Error fetching objects:", error);
                }
            }
        };

        fetchData();
    }, [vocabulary]);

    const toggleFlip = (index) => {
        setFlippedStates((prev) =>
            prev.map((flipped, i) => (i === index ? !flipped : flipped))
        );
    };

    return (
        <div className="cards-container">
            {objects.map((item, index) => (
                <div
                    key={item._id || index}
                    className={`flip-card ${flippedStates[index] ? 'flipped' : ''}`}
                    onClick={() => toggleFlip(index)}
                >
                    {/* Front Side */}
                    <Card className="flip-card-front">
                    <p>מילה</p>
                        <h3>{item.word}</h3>
                    </Card>

                    {/* Back Side */}
                    <Card className="flip-card-back">
                        <p>תרגום</p>
                        <h3>{item.translatedWord}</h3>
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default StudentLearning;