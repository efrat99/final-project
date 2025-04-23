
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';

import Register from './Register';
import SignIn from './SignIn';
import 'primeicons/primeicons.css';
 // Import the image
const AccesPage = () => {
    const [showRegisterDialog, setShowRegisterDialog] = useState(false);
    const [showSignInDialog, setShowSignInDialog] = useState(false);


    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Home page</h2>
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
