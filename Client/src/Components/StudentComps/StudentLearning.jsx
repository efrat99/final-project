
import React, { useState } from 'react';
import { Card } from 'primereact/card';
import '../../FlipCard.css'; // נקרא לקובץ CSS שבו נמצא האפקט

const StudentLearning = () => {
    const [flipped, setFlipped] = useState(false);
    return (
        <div className="card-container" onClick={() => setFlipped(!flipped)}>
            <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
                <Card className="flip-card-front">
                    <h3>Front Side</h3>
                    <p>This is the front of the card. Click to flip!</p>
                </Card>
                <Card className="flip-card-back">
                    <h3>Back Side</h3>
                    <p>This is the back of the card.</p>
                </Card>
            </div>
        </div>
    );
}
export default StudentLearning;



