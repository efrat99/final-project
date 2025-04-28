
import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { useLocation } from 'react-router-dom';
import '../../FlipCard.css'; // נקרא לקובץ CSS שבו נמצא האפקט

const StudentLearning = () => {
    const location = useLocation();
    const { vocabulary } = location.state || {};
    const [flipped, setFlipped] = useState(false);
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
                    {vocabulary && vocabulary.length > 0 ? (
                        <ul>
                            {vocabulary.map((word,index) => (
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



