
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';

import Register from './Register';
import SignIn from './SignIn';
import 'primeicons/primeicons.css';
 // Import the image
const Home = () => {
    const [showRegisterDialog, setShowRegisterDialog] = useState(false);
    const [showSignInDialog, setShowSignInDialog] = useState(false);
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Welcome to Learning App</h2>
            <Button onClick={() => setShowRegisterDialog(true)}>הרשמה</Button>
            <Button onClick={() => setShowSignInDialog(true)}>כניסה</Button>
            <br /><br />
            <Dialog visible={showSignInDialog} onHide={() => setShowSignInDialog(false)} header="Sign In" modal>
                <SignIn onClose={() => setShowSignInDialog(false)} />
            </Dialog>

            <Dialog visible={showRegisterDialog} onHide={() => setShowRegisterDialog(false)} header="הרשמה" modal>
                <Register onClose={() => setShowRegisterDialog(false)} />
            </Dialog>
            
            <Button onClick={() =>  navigate('/Course')}>הוספת קורס</Button>
            
        </div>
    );
};

export default Home;
