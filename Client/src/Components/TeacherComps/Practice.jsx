
import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';

const Practice = () => {
    const [practices, setPractices] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const fileUploadRef = useRef(null); // הפניה לרכיב FileUpload
    const [showInfoDialog, setShowInfoDialog] = useState(false); // מצב למודל

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
            addPracticeToLevel(res.data._id);
        } catch (e) {
            console.error(e);
        }
    };

    const addPracticeToLevel = async (practiceId) => {
        try {
            const LevelRes = await axios.get(`http://localhost:6660/levels/${level}`);
            const levelObj = {
                ...LevelRes.data,
                practice: [...LevelRes.data.practice, practiceId] // הוספת ה-ID של ה-practice למערך
            };

            // עדכון ה-level בשרת
            await axios.put(`http://localhost:6660/levels/`, levelObj);
            console.log("Practice added to level:", practiceId);
        } catch (error) {
            console.error('Error updating level:', error);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.files[0]; // קבלת הקובץ הראשון שנבחר
        if (!file) {
            console.error("No file selected");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const newPractices = jsonData.map((row) => ({
                _id: `temp-${uuidv4()}`, // יצירת מזהה זמני
                question: row['שאלה'], // שם העמודה הראשונה
                answers: [row['תשובה 1'], row['תשובה 2'], row['תשובה 3'], row['תשובה 4']], // תשובות
                correctAnswer: parseInt(row['תשובה נכונה'], 10) // תשובה נכונה
            }));

            setPractices((prevPractices) => [...prevPractices, ...newPractices]);

            // שמירת התרגולים ב-DB
            try {
                for (const practice of newPractices) {
                    const res = await axios.post(`http://localhost:6660/practices/`, practice);
                    if (res.status === 200) {
                        console.log(`Saved practice: ${practice.question}`);

                        setPractices((prevPractices) => prevPractices.map((p) =>
                            p._id === practice._id ? { ...p, _id: res.data._id } : p
                        )
                        );
                        await addPracticeToLevel(res.data._id);
                    }
                }
            } catch (error) {
                console.error("Error saving practices to DB:", error);
            }
        };

        reader.readAsArrayBuffer(file);
        fileUploadRef.current.clear();
    };

    const handleInfoButtonClick = () => {
        setShowInfoDialog(true); // הצגת המודל כשנלחץ על הכפתור
    };

    const handleDialogClose = () => {
        setShowInfoDialog(false); // סגירת המודל
    };

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
                {/* טופס להוספת שאלה חדשה */}
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
                    <Button type="submit" label="הוסף" className="mt-3" />
                </form>
                
                <div>
              

                    {/* רכיב העלאת קבצים */}
                    <FileUpload
                        ref={fileUploadRef}
                        mode="basic"
                        name="demo[]"
                        accept=".xlsx, .xls"
                        maxFileSize={1000000}
                        customUpload
                        uploadHandler={handleFileChange}
                        auto
                        chooseLabel="בחר קובץ"
                        className="p-button-primary"
                    />

                    <Button
                        icon="pi pi-info-circle"
                        className="p-button-rounded p-button-info"
                        onClick={handleInfoButtonClick}
                    />
                </div>

                <Dialog
                    visible={showInfoDialog}
                    onHide={handleDialogClose}
                    header="הסבר על העלאת קובץ"
                    footer={<Button label="סגור" icon="pi pi-times" onClick={handleDialogClose} />}
                    style={{ width: '50vw' }}
                >
                    <p>יש להעלות קובץ בפורמט Excel (.xlsx או .xls) עם המבנה הבא:</p>
                    <ul>
                        <li><strong>שאלה:</strong> טקסט השאלה.</li>
                        <li><strong>תשובה 1, תשובה 2, תשובה 3, תשובה 4:</strong> ארבע תשובות אפשריות.</li>
                        <li><strong>תשובה נכונה:</strong> מספר בין 1 ל-4 שמציין את התשובה הנכונה.</li>
                    </ul>
                    <p>לדוגמה:</p>
                    <table style={{ border: '1px solid #ddd', borderCollapse: 'collapse', width: '100%', marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '5px' }}>שאלה</th>
                                <th style={{ border: '1px solid #ddd', padding: '5px' }}>תשובה 1</th>
                                <th style={{ border: '1px solid #ddd', padding: '5px' }}>תשובה 2</th>
                                <th style={{ border: '1px solid #ddd', padding: '5px' }}>תשובה 3</th>
                                <th style={{ border: '1px solid #ddd', padding: '5px' }}>תשובה 4</th>
                                <th style={{ border: '1px solid #ddd', padding: '5px' }}>תשובה נכונה</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid #ddd', padding: '5px' }}>מהי בירת ישראל?</td>
                                <td style={{ border: '1px solid #ddd', padding: '5px' }}>ירושלים</td>
                                <td style={{ border: '1px solid #ddd', padding: '5px' }}>תל אביב</td>
                                <td style={{ border: '1px solid #ddd', padding: '5px' }}>חיפה</td>
                                <td style={{ border: '1px solid #ddd', padding: '5px' }}>אילת</td>
                                <td style={{ border: '1px solid #ddd', padding: '5px' }}>1</td>
                            </tr>
                        </tbody>
                    </table>
                </Dialog>

                {/* isplay existing questions */}
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
                {/* כפתור סיום */}
                <Button
                    label="סיום"
                    className="mt-3"
                    disabled={practices.length < 1}
                    onClick={() => {
                        navigate('/Level', {
                            state: {
                                practice: practices,
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