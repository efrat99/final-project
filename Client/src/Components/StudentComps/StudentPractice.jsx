import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { RadioButton } from "primereact/radiobutton";
import axios from 'axios';

const StudentPractice=()=>{
   
    const navigate = useNavigate();
    const location = useLocation();
    const { practice} = location.state || {};
    const categories = [
        { name: 'Accounting', key: 'A' },
        { name: 'Marketing', key: 'M' },
        { name: 'Production', key: 'P' },
        { name: 'Research', key: 'R' }
    ];
    const [selectedCategory, setSelectedCategory] = useState(categories[1]);
   const showQuestion = async (question) => {
        try {
            if (practice && practice.length > 0) {
                // Fetch all data for the vocabulary IDs
                const responses = await Promise.all(
                    practice.map((id) => axios.get(`http://localhost:6660/practices/${id}`))
                );
                
                console.log(responses)
                // Extract the data from successful responses
                const fetchedObjects = responses
                    .filter((response) => response.status === 200)
                    .map((response) => response.data);
                console.log(fetchedObjects)
            }
        } catch (error) {
            console.error("Error fetching objects:", error);
        }
    }
    useEffect(() => {
        showQuestion(practice);
    }, [practice]);

    
    return(
        <div className="card flex justify-content-center">
        <div className="flex flex-column gap-3">
            {categories.map((category) => {
                return (
                    <div key={category.key} className="flex align-items-center">
                        <RadioButton inputId={category.key} name="category" value={category} onChange={(e) => setSelectedCategory(e.value)} checked={selectedCategory.key === category.key} />
                        <label htmlFor={category.key} className="ml-2">{category.name}</label>
                    </div>
                );
            })}
        </div>
    </div>
);
    
}
export default StudentPractice;