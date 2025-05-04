import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../FlipCard.css'; // Import the CSS file for the flip card effect'
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const StudentLearning = () => {
    const location = useLocation();
    // const navigate = useNavigate();
    const { vocabulary, course } = location.state || {};
    const [objects, setObjects] = useState([]);
    const [flippedStates, setFlippedStates] = useState([]);
    const [voices, setVoices] = useState([]);


    const languageMap = {
        ar: "ar-SA",
        en: "en-US",
        es: "es-ES",
        fr: "fr-FR",
        de: "de-DE",
        ru: "ru-RU",
        zh: "zh-CN",
        hi: "hi-IN",
        pt: "pt-PT",
        ja: "ja-JP",
        it: "it-IT",
        nl: "nl-NL",
        ko: "ko-KR",
        tr: "tr-TR",
        he: "he-IL",
        fa: "fa-IR",
        pl: "pl-PL",
        uk: "uk-UA",
        sv: "sv-SE",
        fi: "fi-FI",
        no: "no-NO",
        da: "da-DK",
        cs: "cs-CZ",
        el: "el-GR",
        th: "th-TH",
        id: "id-ID",
        vi: "vi-VN",
        hu: "hu-HU",
        ro: "ro-RO",
        bg: "bg-BG",
        sr: "sr-RS",
        sk: "sk-SK",
        sl: "sl-SI",
        hr: "hr-HR",
        lt: "lt-LT",
        lv: "lv-LV",
        et: "et-EE",
        ms: "ms-MY",
        bn: "bn-BD",
        tl: "tl-PH",
        sw: "sw-KE",
        mt: "mt-MT",
        is: "is-IS",
        ga: "ga-IE",
        cy: "cy-GB"
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
        const loadVoices = () => {
            const availableVoices = speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
            }
        };

        loadVoices();
        window.speechSynthesis.onvoiceschanged = loadVoices;
        fetchData();
    }, [vocabulary]);

    useEffect(() => {

    }, []);


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
            {/* <div>
                <Button label='מעבר לתרגול' onClick={() => navigate('/studentPractice', { state: { vocabulary, course } })} />
            </div> */}
        </div>
    );
};

export default StudentLearning;