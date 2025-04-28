import React, { useState ,useEffect} from 'react';
import { Card } from 'primereact/card';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; 
import '../../FlipCard.css'; // נקרא לקובץ CSS שבו נמצא האפקט

const StudentLearning = () => {
    const location = useLocation();
    const { vocabulary } = location.state || {};
    const [flipped, setFlipped] = useState(false);
    const [objects, setObjects] = useState([]);

    useEffect(() => {
        if (vocabulary && vocabulary.length > 0) {
            // קריאות GET BY ID
            vocabulary.map(async (id) => {
                try {
                    const response = await axios.get(`http://localhost:6660/learnings/${id}`);
                    setObjects(prevObjects => [...prevObjects, response.data]);
                } catch (error) {
                    console.error(`Error fetching object with ID ${id}:`, error);
                }
            });
        }
    }, [vocabulary]);

    return (
        <div className="card-container" onClick={() => setFlipped(!flipped)}>
            {console.log(vocabulary)}
            <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
                <Card className="flip-card-front">
                    <h3>Front Side</h3>
                    <p>This is the front of the card. Click to flip!</p>
                </Card>
                <Card className="flip-card-back">
                    <h3>Back Side</h3>
                    {objects && objects.length> 0 ? (
                        <ul>
                            {objects.map((word,index) => (
                                <li key={index}>{word}</li>
                            ))}
                        </ul>
                    ) : (
                    <p>This is the back of the card.</p> 
                    )}
                </Card>
            </div>
        </div>
    );
}
export default StudentLearning;



