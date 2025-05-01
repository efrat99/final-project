

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './StudentPractice.css';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
const StudentPractice = () => {
    const location = useLocation();
    const { practice, course, level } = location.state || {};
    const [questions, setQuestions] = useState([]); // שמירת fetchedObjects
    const [selectedAnswers, setSelectedAnswers] = useState({}); // תשובות שנבחרו לכל שאלה
    const [submittedAnswers, setSubmittedAnswers] = useState({}); // תשובות שהוגשו
    const user = useSelector(state => state.token.user._id)
    const [score, setScore] = useState(null); // שמירת הציון
    const [isSubmitted, setIsSubmitted] = useState(false); // מעקב אחרי מצב הכפתור
    const showQuestion = async () => {
        try {
            if (practice && practice.length > 0) {
                // Fetch all data for the practice IDs
                const responses = await Promise.all(
                    practice.map((id) => axios.get(`http://localhost:6660/practices/${id}`))
                );

                // Extract the data from successful responses
                const fetchedObjects = responses
                    .filter((response) => response.status === 200)
                    .map((response) => response.data);

                console.log(fetchedObjects);
                setQuestions(fetchedObjects); // שמירת השאלות ב-state
            }
        } catch (error) {
            console.error("Error fetching objects:", error);
        }
    };

    useEffect(() => {
        showQuestion();
    }, [practice]);

    const handleAnswerClick = (questionId, answerIndex) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answerIndex,
        }));
    };

    const handleSubmit = (questionId) => {
        setSubmittedAnswers((prev) => ({
            ...prev,
            [questionId]: true,
        }));
    };
    const handleFinalSubmit = async () => {
        let correctCount = 0;
        questions.forEach((question) => {
            const selectedAnswer = selectedAnswers[question._id];
            if (selectedAnswer === question.correctAnswer) {
                correctCount++;
            }
        });

        const totalScore = Math.round((correctCount / questions.length) * 100); // חישוב הציון באחוזים
        setScore(totalScore);

        try {
            // שליחת הציון לשרת
            const response = await axios.post('http://localhost:6660/grades', {
                mark: totalScore,
                student: user, // החלף ב-ID של התלמיד המחובר
                course: course._id, // החלף ב-ID של הקורס
                level: level, // החלף ב-ID של הרמה
            });
            console.log(response.status);
            if (response.status === 200) {
                console.log('Grade saved successfully:', response.data);
                alert('הציון נשמר בהצלחה!');

            }
        } catch (error) {
            console.error('Error saving grade:', error);
            alert('שגיאה בשמירת הציון.');
        }
        setIsSubmitted(true);
    };
    return (
        <div className="practice-container">
            {questions.map((question) => (
                <div key={question._id} className="question-card">
                    <h3>{question.question}</h3> {/* הצגת השאלה */}
                    <div className="answers-container">
                        {question.answers.map((answer, index) => (
                            <div
                                key={index}
                                className={`answer-box ${selectedAnswers[question._id] === index
                                    ? submittedAnswers[question._id]
                                        ? index === question.correctAnswer
                                            ? 'correct'
                                            : 'incorrect'
                                        : 'selected'
                                    : ''
                                    }`}
                                onClick={() => handleAnswerClick(question._id, index)}
                            >
                                {answer}
                            </div>
                        ))}
                    </div>
                    {!submittedAnswers[question._id] && (
                        <Button onClick={() => handleSubmit(question._id)}>Submit</Button>
                    )}

                </div>
            ))}
            <Button onClick={handleFinalSubmit} className="final-submit-button"  disabled={isSubmitted}>הגש</Button>
            {score !== null && <h2>הציון שלך: {score}%</h2>}
        </div>
    );
};

export default StudentPractice;