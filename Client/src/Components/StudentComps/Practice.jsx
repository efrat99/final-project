import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../StudentPractice.css';
import { useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';

const Practice = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { practice, course, level } = location.state || {};
    const [questions, setQuestions] = useState([]); // שמירת fetchedObjects
    const [selectedAnswers, setSelectedAnswers] = useState({}); // תשובות שנבחרו לכל שאלה
    const [submittedAnswers, setSubmittedAnswers] = useState({}); // תשובות שהוגשו
    const [showError, setShowError] = useState(false); // האם להציג שגיאה
    const [showFeedback, setShowFeedback] = useState(false); // האם להציג משוב
    const [score, setScore] = useState(null); // שמירת הציון
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // אינדקס השאלה הנוכחית
    const user = useSelector(state => state.token.user); // קבלת פרטי התלמיד מה-state של Redux

    // שליפת השאלות מהשרת
    const showQuestion = async () => {
        try {
            if (practice && practice.length > 0) {
                const responses = await Promise.all(
                    practice.map((id) => axios.get(`http://localhost:6660/practices/${id}`))
                );
                const fetchedObjects = responses
                    .filter((response) => response.status === 200)
                    .map((response) => response.data);
                setQuestions(fetchedObjects);
            }
        } catch (error) {
            console.error("Error fetching objects:", error);
        }
    };

    useEffect(() => {
        showQuestion();
    }, [practice]);

    // בחירת תשובה
    const handleAnswerClick = (questionId, answerIndex) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answerIndex,
        }));
        setShowError(false);
    };

    // הגשת תשובה לשאלה הנוכחית
    const handleSubmit = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const selectedAnswer = selectedAnswers[currentQuestion._id];

        if (selectedAnswer === undefined) {
            setShowError(true);
            return;
        }

        setShowError(false);
        setSubmittedAnswers((prev) => ({
            ...prev,
            [currentQuestion._id]: true,
        }));
        setShowFeedback(true); // הצגת משוב
    };

    // מעבר לשאלה הבאה
    const handleNextQuestion = () => {
        setShowFeedback(false); // הסתרת משוב
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    // הגשה סופית
    const handleFinalSubmit = async () => {
        let correctCount = 0;
        questions.forEach((question) => {
            const selectedAnswer = selectedAnswers[question._id];
            if (selectedAnswer === question.correctAnswer - 1) {
                correctCount++;
            }
        });
        console.log(questions.length)
        const totalScore = Math.round((correctCount / questions.length) * 100); // חישוב הציון באחוזים
        setScore(totalScore);
        console.log('totalScore', totalScore);

        console.log(totalScore, user, course._id, level);
        try {
            const response = await axios.post('http://localhost:6660/grades', {
                mark: totalScore,
                student: user,
                course: course._id,
                level: level,
            });
            
        } catch (error) {
            console.error('Error saving grade:', error);
            alert('שגיאה בשמירת הציון.');
        }
    };

    return (
        <div className="practice-container">
            {/* אם הציון קיים, להציג רק את הציון ואת הכפתור */}
            {score !== null ? (
                <div className="score-container">
                    <h2>הציון שלך: {score}%</h2>
                    <Button
                        onClick={() => navigate('/level', { state: { course: course } })}
                        className="back-button">התקדם לשלב הבא</Button>
                </div>
            ) : (
                // אחרת, להציג את השאלות
                questions.length > 0 && currentQuestionIndex < questions.length && (
                    <div className="question-card">
                        <h3>{questions[currentQuestionIndex].question}</h3> {/* הצגת השאלה */}
                        <div className="answers-container">
                            {questions[currentQuestionIndex].answers.map((answer, index) => (
                                <div
                                    key={index}
                                    className={`answer-box ${showError
                                        ? 'error'
                                        : showFeedback
                                            ? index === questions[currentQuestionIndex].correctAnswer - 1
                                                ? 'correct' // תשובה נכונה - ירוק
                                                : selectedAnswers[questions[currentQuestionIndex]._id] === index
                                                    ? 'incorrect' // תשובה שגויה - אדום
                                                    : ''
                                            : selectedAnswers[questions[currentQuestionIndex]._id] === index
                                                ? 'selected'
                                                : ''
                                        }`}
                                    onClick={() =>
                                        !showFeedback &&
                                        handleAnswerClick(questions[currentQuestionIndex]._id, index)
                                    }
                                >
                                    {answer}
                                </div>
                            ))}
                        </div>
                        <div className="button-container">
                            {!showFeedback ? (
                                <Button onClick={handleSubmit}>הגש</Button>
                            ) : currentQuestionIndex < questions.length - 1 ? (
                                <Button onClick={handleNextQuestion}>הבא</Button>
                            ) : (
                                <Button onClick={handleFinalSubmit} className="final-submit-button">סיום</Button>
                            )}
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default Practice;