import { Card } from 'primereact/card';
import React, { useState,useEffect } from 'react';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { useNavigate } from 'react-router-dom';
import first from '../../Images/2.png';
import { Dropdown } from 'primereact/dropdown';
const Course= () => {
    const navigate = useNavigate();
    const [selectedlanguage, setSelectedlanguage] = useState([]);
    const [Levels, setLevels] = useState([]);
    const language =[
        {"value": "ar", "label": "ערבית 🇸🇦"},
        {"value": "en", "label": "אנגלית 🇬🇧🇺🇸"},
        {"value": "es", "label": "ספרדית 🇪🇸"},
        {"value": "fr", "label": "צרפתית 🇫🇷"},
        {"value": "de", "label": "גרמנית 🇩🇪"},
        {"value": "ru", "label": "רוסית 🇷🇺"},
        {"value": "zh", "label": "סינית 🇨🇳"},
        {"value": "hi", "label": "הינדי 🇮🇳"},
        {"value": "pt", "label": "פורטוגזית 🇵🇹🇧🇷"},
        {"value": "ja", "label": "יפנית 🇯🇵"},
        {"value": "it", "label": "איטלקית 🇮🇹"},
        {"value": "nl", "label": "הולנדית 🇳🇱"},
        {"value": "ko", "label": "קוריאנית 🇰🇷"},
        {"value": "tr", "label": "טורקית 🇹🇷"},
        {"value": "he", "label": "עברית 🇮🇱"},
        {"value": "fa", "label": "פרסית 🇮🇷"},
        {"value": "pl", "label": "פולנית 🇵🇱"},
        {"value": "uk", "label": "אוקראינית 🇺🇦"},
        {"value": "sv", "label": "שוודית 🇸🇪"},
        {"value": "fi", "label": "פינית 🇫🇮"},
        {"value": "no", "label": "נורווגית 🇳🇴"},
        {"value": "da", "label": "דנית 🇩🇰"},
        {"value": "cs", "label": "צ'כית 🇨🇿"},
        {"value": "el", "label": "יוונית 🇬🇷"},
        {"value": "th", "label": "תאית 🇹🇭"},
        {"value": "id", "label": "אינדונזית 🇮🇩"},
        {"value": "vi", "label": "וייטנאמית 🇻🇳"},
        {"value": "hu", "label": "הונגרית 🇭🇺"},
        {"value": "ro", "label": "רומנית 🇷🇴"},
        {"value": "bg", "label": "בולגרית 🇧🇬"},
        {"value": "sr", "label": "סרבית 🇷🇸"},
        {"value": "sk", "label": "סלובקית 🇸🇰"},
        {"value": "sl", "label": "סלובנית 🇸🇮"},
        {"value": "hr", "label": "קרואטית 🇭🇷"},
        {"value": "lt", "label": "ליטאית 🇱🇹"},
        {"value": "lv", "label": "לטבית 🇱🇻"},
        {"value": "et", "label": "אסטונית 🇪🇪"},
        {"value": "ms", "label": "מלאית 🇲🇾"},
        {"value": "bn", "label": "בנגלית 🇧🇩"},
        {"value": "tl", "label": "טאגאלוג 🇵🇭"},
        {"value": "sw", "label": "סוואהילית 🇰🇪"},
        {"value": "mt", "label": "מלטזית 🇲🇹"},
        {"value": "is", "label": "איסלנדית 🇮🇸"},
        {"value": "ga", "label": "אירית 🇮🇪"},
        {"value": "cy", "label": "וולשית 🇬🇧"}
      ]
const saveCourse = async () => {
    const data={
        language:selectedlanguage,
        teacher:"67e987e2e5ad1a430d1af289",
        students:[],
        levels:[]
    }

}

    const handleLearningClick = (level) => {
        navigate('/learning', { state: { level: level} });
    };
    const header = (
        <img alt="Card" src={first} style={{ width: '300px', height: '200px' }} />
    );
    const footer = (level)=>(
        <Button label="הוסף" onClick={() => handleLearningClick(level)}/>
    );
    return (<>
        <h1>הוספת קורס</h1>
        
        {/* <div className="card flex justify-content-center">
            <MultiSelect value={selectedlanguage} onChange={(e) => setSelectedlanguage(e.value)} options={language} optionLabel="label" 
                placeholder="Select Cities" maxSelectedLabels={1} className="w-full md:w-20rem" />
        </div>
         */}
                <div className="card flex justify-content-center">
            <Dropdown value={selectedlanguage} onChange={(e) => setSelectedlanguage(e.value)} options={language} optionLabel="label" 
                placeholder="Select a language" className="w-full md:w-14rem" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <Card title="שלב 4" footer={footer('4')} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
        <Card title="שלב 3" footer={footer('3')} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
        <Card title="שלב 2" footer={footer('2')} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
        <Card title="1 שלב" footer={footer('1')} header={header} style={{ width: '300px', height: '350px', fontSize: '0.9rem' }} className="md:w-15rem"></Card>
        </div>
        <Button label="הוסף קורס" onClick={saveCourse}  />
        </>
    );
}
export default Course;



