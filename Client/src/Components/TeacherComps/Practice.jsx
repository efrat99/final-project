import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Practice = () => {
    const [practices, setPractices] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');


    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues: {
            question: '',
            answers: ['', '', '', ''],
            correctAnswer: ''
        }
    });

    const location = useLocation();
    const { learning, level, courseId } = location.state || {};  // קבלת נתוני הלמידה

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:6660/practices/', { params: { level } })
            .then(response => setPractices(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const onSubmit = async (data) => {
        if (practices.length > 10) {
            alert("You cannot add more than 10 questions.");
            return;
        }
        try {
            const res = await axios.post('http://localhost:6660/practices/', data);
            if (res.status === 200) {
                setPractices([...practices, res.data]);
                reset();
            }
            addPracticeToLevel(res.data._id)
        } catch (e) {
            console.error(e);
        }
    };

    const addPracticeToLevel = async (practice) => {
        const LevelRes = await axios.get(`http://localhost:6660/levels/${level}`);
        console.log("practice " + practice);
        const levelObj = {
            ...LevelRes.data,
            practice: [...LevelRes.data.practice, practice] // הוספת ערך חדש למערך
        };
        console.log("levelObj " + levelObj.practice);

        // שליחת השלב המעודכן לשרת
        await axios.put(`http://localhost:6660/levels/`, levelObj);
    }

    const deletePracriceFromLevel = async (practice) => {
        const LevelRes = await axios.get(`http://localhost:6660/levels/${level}`);
        console.log("practice " + practice);
        const levelObj = {
            ...LevelRes.data,
            practice: LevelRes.data.practice.filter((p) => p !== practice)
        };
        console.log("levelObj " + levelObj.practice);
        // שליחת השלב המעודכן לשרת
        await axios.put(`http://localhost:6660/levels/`, levelObj);
    }

    const handleEdit = (product) => {
        setEditId(product._id);
        setEditedData({ ...product });
    };

    const handleInputChange = (e, field, index = null) => {
        // const correctAnswer = parseInt(editedData.correctAnswer, 10);
        // if (isNaN(correctAnswer) || correctAnswer < 1 || correctAnswer > 4) {
        setEditedData((prevData) => {
            const updatedData = { ...prevData };

            if (index !== null) {
                updatedData.answers[index] = e.target.value;
            } else {
                updatedData[field] = e.target.value;
            }

            return updatedData;
        });
    };

    const handleSave = async () => {
        const correctAnswer = parseInt(editedData.correctAnswer, 10);
        if (isNaN(correctAnswer) || correctAnswer < 1 || correctAnswer > 4) {
            setErrorMessage("התשובה הנכונה חייבת להיות מספר בין 1 ל-4.");
            return;
        }
        setErrorMessage('');
        try {
            const updatedPractice = {
                _id: editId,
                question: editedData.question,
                answers: editedData.answers,
                correctAnswer: correctAnswer
            };

            const res = await axios.put('http://localhost:6660/practices/', updatedPractice);
            if (res.status === 200) {
                setPractices(practices.map((p) => (p._id === editId ? updatedPractice : p)));
                setEditId(null);
            }
        } catch (error) {
            console.error("Error updating question:", error);
        }
    };

    const handleDelete = async (_id) => {
        deletePracriceFromLevel(_id);
        try {
            await axios.delete(`http://localhost:6660/practices/${_id}`);
            setPractices(practices.filter(product => product._id !== _id));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    return (
        <div className="card flex flex-column md:flex-row gap-3">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                {/* Form to add a new question */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid" style={{ flex: 1 }}>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon"><i className="pi pi-question"></i></span>
                        <Controller name="question" control={control} rules={{ required: true }} render={({ field }) => (
                            <InputText {...field} placeholder="שאלה" className={classNames({ 'p-invalid': errors.question })} />
                        )} />
                    </div>

                    {[0, 1, 2, 3].map((index) => (
                        <div className="p-inputgroup mt-2" key={index}>
                            <span className="p-inputgroup-addon">{index + 1}</span>
                            <Controller name={`answers.${index}`} control={control} rules={{ required: true }} render={({ field }) => (
                                <InputText {...field} placeholder={`תשובה ${index + 1}`} className={classNames({ 'p-invalid': errors.answers?.[index] })} />
                            )} />
                        </div>
                    ))}


                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon"><i className="pi pi-check"></i></span>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <Controller
                                name="correctAnswer"
                                control={control}
                                rules={{
                                    required: true,
                                    validate: value => {
                                        const number = parseInt(value, 10);
                                        return !isNaN(number) && number >= 1 && number <= 4
                                            || 'התשובה הנכונה חייבת להיות מספר בין 1 ל-4.';
                                    }
                                }}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        placeholder="תשובה נכונה (1-4)"
                                        className={classNames({ 'p-invalid': errors.correctAnswer })}
                                    />
                                )}
                            />
                            {errors.correctAnswer && (
                                <small className="p-error" style={{ marginTop: '5px' }}>{errors.correctAnswer.message}</small>
                            )}
                        </div>
                    </div>
                    <Button type="submit" label="הוסף" className="mt-3" />
                </form>

                {/* Display existing questions */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'flex-start', width: '100%',
                    }}>
                        {practices.map((rowData) => (
                            <div key={rowData._id} style={{
                                display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px',
                                minWidth: '200px', flexGrow: 1, maxWidth: 'calc(33% - 20px)', flexBasis: 'auto', width: 'auto',
                            }}>
                                {/* Display question */}
                                {editId === rowData._id ? (
                                    <div>
                                        <strong>שאלה:</strong> <br />
                                        <InputText
                                            value={editedData.question}
                                            onChange={(e) => handleInputChange(e, "question")}
                                            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                                        {practices.find((p) => p._id === rowData._id)?.question}
                                    </div>
                                )}

                                {/* Display answers */}
                                {rowData.answers.map((answer, index) => (
                                    <div key={index}>
                                        {editId === rowData._id ? (
                                            <div>
                                                <strong>תשובה {index + 1}:</strong> <br />
                                                <InputText
                                                    value={editedData.answers[index]}
                                                    onChange={(e) => handleInputChange(e, "answers", index)}
                                                    onKeyDown={(e) => { if (e.key === "Enter") handleSave() }}
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                {/* {practices.find((p) => p._id === rowData._id)?.answers[index]}  */}
                                                {answer} {rowData.correctAnswer === index + 1 ? "✔️" : "❌"}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Display correct answer edit */}
                                {editId === rowData._id && (
                                    <div>
                                        <strong>תשובה נכונה:</strong> <br />
                                        <InputText
                                            value={editedData.correctAnswer}
                                            onChange={(e) => handleInputChange(e, "correctAnswer")}
                                            onKeyDown={(e) => { if (e.key === "Enter") handleSave() }}
                                            className={classNames({ 'p-invalid': errorMessage })} // הוספת מחלקת שגיאה
                                        />
                                        {errorMessage && <small className="p-error">{errorMessage}</small>} {/* הצגת הודעת השגיאה */}
                                    </div>
                                )}

                                {/* Edit and Delete buttons */}
                                <div style={{ textAlign: 'center' }}>
                                    {editId === rowData._id ? (
                                        <>
                                            <Button label="שמור" className="p-button-success p-button-sm" onClick={handleSave} />
                                            <Button label="בטל" className="p-button-secondary p-button-sm" onClick={() => {
                                                // const originalData = practices.find((p) => p._id === editId); // מציאת הנתונים המקוריים
                                                // setEditedData({...originalData}); 
                                                setEditId(null)
                                            }} />

                                        </>
                                    ) : (
                                        <>
                                            <Button label="עדכן" className="p-button-warning p-button-sm" onClick={() => handleEdit(rowData)} />
                                            <Button icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(rowData._id)} />
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    label="סיום"
                    className="mt-2"
                    // disabled={practices.length < 1}
                    onClick={() => {
                        navigate('/Level', {
                            state: {
                                practice: practices,
                                learning: learning,
                                level: level,
                                courseId: courseId
                            }
                        });
                    }}
                />
            </div>
        </div>
    );
};

export default Practice;
