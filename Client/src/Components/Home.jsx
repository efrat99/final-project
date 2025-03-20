
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom'; 
import Login from './login';
import SignIn from './SignIn';

const Home = () => {
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [ShowSignInDialog, setShowSignInDialog] = useState(false);
    const navigate = useNavigate(); 

    const handleLoginClick = () => {
        setShowLoginDialog(true);
        console.log('Login button clicked');
    };

    const hideLoginDialog = () => {
        setShowLoginDialog(false);
    };

    const handleSignInClick = () => {
        setShowSignInDialog(true);
        console.log('Sign in button clicked');
    };

    const hideSignInDialog = () => {
        setShowSignInDialog(false);
    };

  
    const handleLearningClick = () => {
        console.log('Learning button clicked');
        navigate('/learning'); 
    };

    const handlePracticeClick = () => {
        console.log('Practice button clicked');
        navigate('/practice'); 
    };

    return (
        <div>
            <Button onClick={handleLoginClick}>Login</Button>
            <Button onClick={handleSignInClick}>Sign In</Button>
            <br/> <br/>
            <Button onClick={handleLearningClick}>Move to Learning Page</Button>
            <br/> <br/>
            <Button onClick={handlePracticeClick}>Move to Practice Page</Button>
            
            <Dialog visible={ShowSignInDialog} onHide={hideSignInDialog} header="Sign In" modal>
                <SignIn onClose={hideSignInDialog}/>
            </Dialog>

            <Dialog visible={showLoginDialog} onHide={hideLoginDialog} header="Login" modal>
                <Login onClose={hideLoginDialog}/>
            </Dialog>
        </div>
    );
};

export default Home;