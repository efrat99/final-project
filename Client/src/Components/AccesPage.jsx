
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import img from '../Images/3.jpeg';


import Register from './Register';
import SignIn from './SignIn';
import 'primeicons/primeicons.css';
 // Import the image
const AccesPage = () => {
    const [showRegisterDialog, setShowRegisterDialog] = useState(false);
    const [showSignInDialog, setShowSignInDialog] = useState(false);


    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <img src={img} alt="Logo" style={{ width: '200px', height: 'auto' }} />
            <h1>ברוכים הבאים לאתר שלנו</h1>
            <Button onClick={() => setShowRegisterDialog(true)}>הרשמה</Button>
            <Button onClick={() => setShowSignInDialog(true)}>כניסה</Button>
            <br /><br />
            <Dialog visible={showSignInDialog} onHide={() => setShowSignInDialog(false)} header="כניסה" modal>
                <SignIn onClose={() => setShowSignInDialog(false)} />
            </Dialog>

            <Dialog visible={showRegisterDialog} onHide={() => setShowRegisterDialog(false)} header="הרשמה" modal>
                <Register onClose={() => setShowRegisterDialog(false)} />
            </Dialog>
            

            
        </div>
    );
};

export default AccesPage;
