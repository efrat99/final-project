import React from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
const Learning = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { course ,vocabulary} = location.state || {};
    return (<>
        <Button onClick={() => { navigate('/studentLearning', { state: { vocabulary: vocabulary } }) }}>אוצר מילים</Button>
        <Button >תרגול</Button>
         </>
    )
}
export default Learning;