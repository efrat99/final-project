
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import fox from '../Images/fox.png';
import '../App.css';

import Register from './Register';
import SignIn from './SignIn';
import 'primeicons/primeicons.css';
// Import the image
const AccesPage = () => {
    const [showRegisterDialog, setShowRegisterDialog] = useState(false);
    const [showSignInDialog, setShowSignInDialog] = useState(true);

    const handleRegisterClick = () => {
        setShowSignInDialog(false); // לסגור את דיאלוג הכניסה אם הוא פתוח
        setShowRegisterDialog(true); // לפתוח את דיאלוג ההרשמה
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <img src={fox} alt="Logo" style={{ width: '250px', height: 'auto' }} />
            <h1 style={{ color: 'white' }}>ברוכים הבאים לאתר שלנו🦊!!!</h1>
            {/* <Button className="button-orange" onClick={() => setShowRegisterDialog(true)}>הרשמה</Button> */}
            {/* <Button className="button-orange" onClick={() => setShowSignInDialog(true)}>כניסה</Button>
            <br /><br />
            <Card visible={showSignInDialog} onHide={() => setShowSignInDialog(false)} header="כניסה" modal>
                <SignIn onClose={() => setShowSignInDialog(false)} />
            </Card> */}
            <Card style={{ width: '300px', margin: 'auto' }}>
                <SignIn onClose={() => setShowSignInDialog(false)} />
                <br />
                {/* הודעה למעבר להרשמה */}
                <p style={{ marginTop: '10px' }}>
                    <span>אין לך חשבון עדיין? </span>
                    <Button
                        label="הירשם"
                        className="p-button-text"
                        onClick={handleRegisterClick}
                    />
                </p>
            </Card>

            <Dialog visible={showRegisterDialog} onHide={() => setShowRegisterDialog(false)} header="הרשמה" modal>
                <Register onClose={() => setShowRegisterDialog(false)} />
            </Dialog>





        </div>
    );
};

export default AccesPage;
