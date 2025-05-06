import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../FlipCard.css'; // Import the CSS file for the flip card effect'
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StudentLearning = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { level, practice, vocabulary, course, validGrades } = location.state || {};
    const [objects, setObjects] = useState([]);
    const [flippedStates, setFlippedStates] = useState([]);
    const [voices, setVoices] = useState([]);
    const [isPracticeDisabled, setIsPracticeDisabled] = useState(false); 
    const user = useSelector(state => state.token.user); 


    const languageMap = {
        "ערבית": "ar-SA",
        "אנגלית": "en-US",
        "ספרדית": "es-ES",
        "צרפתית": "fr-FR",
        "גרמנית": "de-DE",
        "רוסית": "ru-RU",
        "סינית": "zh-CN",
        "הינדית": "hi-IN",
        "פורטוגזית": "pt-PT",
        "יפנית": "ja-JP",
        "איטלקית": "it-IT",
        "הולנדית": "nl-NL",
        "קוריאנית": "ko-KR",
        "טורקית": "tr-TR",
        "עברית": "he-IL",
        "פרסית": "fa-IR",
        "פולנית": "pl-PL",
        "אוקראינית": "uk-UA",
        "שוודית": "sv-SE",
        "פינית": "fi-FI",
        "נורווגית": "no-NO",
        "דנית": "da-DK",
        "צ'כית": "cs-CZ",
        "יוונית": "el-GR",
        "תאית": "th-TH",
        "אינדונזית": "id-ID",
        "וייטנאמית": "vi-VN",
        "הונגרית": "hu-HU",
        "רומנית": "ro-RO",
        "בולגרית": "bg-BG",
        "סרבית": "sr-RS",
        "סלובקית": "sk-SK",
        "סלובנית": "sl-SI",
        "קרואטית": "hr-HR",
        "ליטאית": "lt-LT",
        "לטבית": "lv-LV",
        "אסטונית": "et-EE",
        "מלאית": "ms-MY",
        "בנגלית": "bn-BD",
        "טגלוג": "tl-PH",
        "סווהילית": "sw-KE",
        "מלטזית": "mt-MT",
        "איסלנדית": "is-IS",
        "אירית": "ga-IE",
        "וולשית": "cy-GB"
    };

    useEffect(() => {
        const fetchData = async () => {
            if (vocabulary && vocabulary.length > 0) {
                try {
                    // Fetch all data for the vocabulary IDs
                    const responses = await Promise.all(
                        vocabulary.map((id) => axios.get(`http://localhost:6660/learnings/${id}`))
                    );

                    // Extract the data from successful responses
                    const fetchedObjects = responses
                        .filter((response) => response.status === 200)
                        .map((response) => response.data);

                    setObjects(fetchedObjects); // Update state with fetched objects
                    setFlippedStates(new Array(fetchedObjects.length).fill(false)); // Initialize flipped states                     
                } catch (error) {
                    console.error("Error fetching objects:", error);
                }
            }
        };

        const checkPracticeStatus = async () => {

            const isCompleted = validGrades.some((grade) => grade.level._id === level);
            if(isCompleted) {
                setIsPracticeDisabled(true);
            }

            // console.log("Student:", user._id);
            // console.log("Level:", level);
            // try {
            //     const response = await axios.get(`http://localhost:6660/grades`, {
            //         params: {
            //             student: user._id, // Filter by the current student
            //             level: level, // Filter by the current course
            //         },
            //     });
            //     if (response.data) {
            //         setIsPracticeDisabled(true);
            //         console.log(response.data._id + " - יש ציונים קיימים");
            //     }

            // } catch (error) {
            //     console.error("Error fetching grades:", error);
            // }
        };


        const loadVoices = () => {
            const availableVoices = speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        fetchData();
        checkPracticeStatus();
    }, [vocabulary, course, user]);



    const toggleFlip = (index) => {
        setFlippedStates((prev) =>
            prev.map((flipped, i) => (i === index ? !flipped : flipped))
        );
    };

    const speak = (text, langCode) => {
        const voiceLang = languageMap[langCode] || "en-US";
        const utter = new SpeechSynthesisUtterance(text);
        // utter.lang = voiceLang;
        const matchedVoice = voices.find(voice => voice.lang === voiceLang);
        if (matchedVoice) {
            utter.voice = matchedVoice;
        } else {
            utter.lang = voiceLang;
        }
        speechSynthesis.cancel();// Cancel any ongoing speech
        speechSynthesis.speak(utter);
    };

    return (
        <div className="cards-container">
            {objects.map((item, index) => (
                <div
                    key={item._id || index}
                    className={`flip-card ${flippedStates[index] ? 'flipped' : ''}`}
                    onClick={() => toggleFlip(index)}
                >
                    {/* Front Side */}
                    <Card className="flip-card-front">
                        <button className="audio-button" onClick={(e) => {
                            e.stopPropagation(); // מונע מהכפתור להפוך את הכרטיס
                            speak(item.word, course.language); // שיחה עם המילה

                        }}
                        ><i className="pi pi-volume-up"
                            style={{ fontSize: '30px', transition: 'color 0.3s' }}
                            onMouseEnter={(e) => e.target.style.color = 'red'}
                            onMouseLeave={(e) => e.target.style.color = ''}
                            onClick={(e) => e.target.style.color = 'rgb(255, 98, 0)'}>
                            </i>
                        </button>
                        <h3 style={{ fontSize: "30px" }}>{item.word}</h3>
                    </Card>

                    {/* Back Side */}
                    <Card className="flip-card-back">
                        <h3 style={{ fontSize: "30px" }}>{item.translatedWord}</h3>
                    </Card>
                </div>
            ))}

            <div className="practice-button-container">
                <Button
                    icon="pi pi-file-edit"
                    disabled={isPracticeDisabled}
                    onClick={() => navigate('/studentPractice', { state: { practice, vocabulary, course, level } })}
                    className="practice-button"
                />
                <span className="practice-text">מעבר למבחן</span> {/* טקסט מתחת לכפתור */}
            </div>
        </div>
    );
};

export default StudentLearning;