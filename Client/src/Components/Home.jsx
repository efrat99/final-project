

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import Register from './Register';
import SignIn from './SignIn';
import 'primeicons/primeicons.css';
import first from '../Images/2.png'; // Import the image
const Home = () => {
    const [showRegisterDialog, setShowRegisterDialog] = useState(false);
    const [showSignInDialog, setShowSignInDialog] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const navigate = useNavigate();

    const levels = [
        { label: 'Level 1', value: '1' },
        { label: 'Level 2', value: '2' },
        { label: 'Level 3', value: '3' },
        { label: 'Level 4', value: '4' }
    ];

    const handleLearningClick = () => {
        // if (!selectedLevel) {
        //     alert("Please select a level first.");
        //     return;
        // }
        // ניווט לעמוד Learning עם הרמה שנבחרה
        navigate('/learning', { state: { level: selectedLevel } });
    };
    const header = (
        <img alt="Card" src={first} style={{ width: '300px', height: '200px' }} />
    );
    const footer = (
        <Button label="הוסף" onClick={() => handleLearningClick()}/>
    );
    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Welcome to Learning App</h2>

            <Button onClick={() => setShowRegisterDialog(true)}>הרשמה</Button>
            <Button onClick={() => setShowSignInDialog(true)}>Sign In</Button>
            <br /><br />

            {/* Dropdown לבחירת רמה
            <Dropdown
                value={selectedLevel}
                options={levels}
                onChange={(e) => setSelectedLevel(e.value)}
                placeholder="Select a level"
                className="w-full md:w-14rem"
            />
            <br /><br /> */}

            {/* <Button onClick={handleLearningClick} disabled={!selectedLevel}>Move to Learning Page</Button> */}

            <Dialog visible={showSignInDialog} onHide={() => setShowSignInDialog(false)} header="Sign In" modal>
                <SignIn onClose={() => setShowSignInDialog(false)} />
            </Dialog>

            <Dialog visible={showRegisterDialog} onHide={() => setShowRegisterDialog(false)} header="הרשמה" modal>
                <Register onClose={() => setShowRegisterDialog(false)} />
            </Dialog>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <Card title="שלב 4" footer={footer} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            <Card title="שלב 3" footer={footer} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            <Card title="שלב 2" footer={footer} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            <Card title="1 שלב" footer={footer} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
            {/* <Card title="שלב 5" footer={footer} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"> </Card> */}
            </div>
        </div>
    );
};

export default Home;
