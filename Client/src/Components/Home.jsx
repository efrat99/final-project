import React, { useState } from 'react';
import Login from './login';
import SignIn from './SignIn';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const Home = () => {
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const[ShowSignInDialog,setShowSignInDialog] = useState(false);
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

    return (
        <div>
            {/* <h1>Home</h1> */}
            <Button onClick={handleLoginClick}>login</Button>
            <Button onClick={handleSignInClick}>sign in</Button>
            
            <Dialog visible={ShowSignInDialog} onHide={hideSignInDialog} header="SignIn" modal>
                <SignIn onClose={hideSignInDialog}/>
            </Dialog>


            <Dialog visible={showLoginDialog} onHide={hideLoginDialog} header="Login" modal>
                <Login onClose={hideLoginDialog}/>
            </Dialog>
        </div>
    );
};

export default Home;