
import React, { useState } from "react";
import axios from 'axios';
//import { useLocation } from 'react-router-dom';

const Level = (props) => {
    const [products, setProducts] = useState([]); 
  //  const location = useLocation();
  //  const { practice, learning, level } = location.state || {}; // קבלת הנתונים שנשלחו
    const saveLevel = async () => {
       

        const data = {
            level:props. level,
            learning: props.learning._id,//??
            practice: props.practice._id//??
        }

        try {
            const res = await axios.post('http://localhost:6660/practices/', data);
            if (res.status === 200) {
                setProducts([...products, res.data]);
                // reset();
            }
        } catch (e) {
            console.error(e);
        }
    }
    return (
        <div>
            <h1>Save Level</h1>
            <button onClick={saveLevel}>Save Level</button>
        </div>
    )
}
export default Level;
