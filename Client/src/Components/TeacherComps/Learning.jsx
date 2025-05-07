
import React, { useEffect, useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FileUpload } from 'primereact/fileupload';
import { Dialog } from 'primereact/dialog';
import '../../App.css';
import * as XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid'; // ייבוא uuid ליצירת מזהים זמניים

const Learning = () => {
    const [learnings, setLearnings] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({ word: '', translatedWord: '' });
    const [showInfoDialog, setShowInfoDialog] = useState(false); // מצב למודל

    const location = useLocation();
    const { token } = useSelector((state) => state.token);
    const { level, courseId } = location.state || {}; // קבלת הרמה שנבחרה
    const fileUploadRef = useRef(null); // יצירת הפניה לרכיב FileUpload
    const navigate = useNavigate();

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            word: '',
            translatedWord: ''
        }
    });

    useEffect(() => {
        if (!token) return;
        axios.get('http://localhost:6660/learnings', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { level }, // הוספת level כ־query
        })
            .then(response => setLearnings(response.data))
            .catch(e => {
                if (e.response && e.response.status === 404) {
                    console.error('No data found for the given level:', level);
                } else {
                    console.error(e); // שגיאות אחרות
                }
            });
    }, [token, level]);

    const onSubmit = async (data) => {
        if (learnings.length > 10) {
            alert("You cannot add more than 10 words.");
            return;
        }
        try {
            const res = await axios.post(`http://localhost:6660/learnings/`, data, {
                headers: { Authorization: `bearer ${token}` }
            });
            if (res.status === 200) {
                setLearnings([...learnings, res.data]);
                reset();
            }
            AddLearningToLevel(res.data._id);
        } catch (e) {
            console.error(e);
        }
    };

    const AddLearningToLevel = async (learning) => {
        try {
            const LevelRes = await axios.get(`http://localhost:6660/levels/${level}`);
            const levelObj = {
                ...LevelRes.data,
                learning: [...LevelRes.data.learning, learning] // הוספת ערך חדש למערך
            };
            await axios.put(`http://localhost:6660/levels/`, levelObj);
            console.log("Learning added to level:", learning);
        } catch (error) {
            console.error("Error adding learning to level:", error);
        }
    };

    const deleteLearningFromLevel = async (learningId) => {
        if (!learningId) {
            console.error("Invalid learning ID:", learningId);
            return;
        }

        try {
            const LevelRes = await axios.get(`http://localhost:6660/levels/${level}`);
            const levelObj = {
                ...LevelRes.data,
                learning: LevelRes.data.learning.filter((l) => l !== learningId)
            };
            await axios.put(`http://localhost:6660/levels/`, levelObj);
        } catch (error) {
            console.error("Error deleting learning from level:", error);
        }
    };

    const handleEdit = (product) => {
        setEditId(product._id);
        setEditData({ word: product.word, translatedWord: product.translatedWord });
    };

    const handleInputChange = (e, field) => {
        setEditData((prevData) => ({ ...prevData, [field]: e.target.value }));
    };

    const handleUpdate = async () => {
        if (!editId || editId.startsWith('temp-')) { // בדיקה אם ה-ID זמני
            console.error("Cannot update unsaved word:", editId);
            return;
        }

        try {
            const updatedLearning = {
                _id: editId,
                word: editData.word,
                translatedWord: editData.translatedWord
            };

            const res = await axios.put('http://localhost:6660/learnings/', updatedLearning);
            if (res.status === 200) {
                setLearnings((prevLearnings) =>
                    prevLearnings.map((learning) =>
                        learning._id === editId ? { ...learning, ...updatedLearning } : learning
                    )
                );
                setEditId(null);
            }
        } catch (error) {
            console.error("Error updating word:", error);
        }
    };

    const handleDelete = async (_id) => {
        if (!_id || _id.startsWith('temp-')) { // בדיקה אם ה-ID זמני
            console.error("Cannot delete unsaved word:", _id);
            return;
        }

        try {
            console.log("Deleting word with ID:", _id); // לוג כדי לבדוק את ה-ID
            await deleteLearningFromLevel(_id); // מחיקת המילה מהרמה
            await axios.delete(`http://localhost:6660/learnings/${_id}`); // מחיקת המילה מהשרת
            setLearnings((prevLearnings) =>
                prevLearnings.filter((learning) => learning._id !== _id)
            ); // עדכון ה-state
        } catch (error) {
            console.error('Error deleting word:', error);
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

            const newLearnings = jsonData.map((row) => ({
                _id: `temp-${uuidv4()}`, // יצירת מזהה זמני
                word: row['מילה'], // שם העמודה הראשונה
                translatedWord: row['תרגום'] // שם העמודה השנייה
            }));

            setLearnings((prevLearnings) => [...prevLearnings, ...newLearnings]);

            // שמירת המילים ב-DB
            try {
                for (const learning of newLearnings) {
                    const res = await axios.post(`http://localhost:6660/learnings/`, learning, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.status === 200) {
                        console.log(`Saved learning: ${learning.word}`);
                        await AddLearningToLevel(res.data._id); // הוספת המילה לרמה
                        // עדכון ה-ID של המילה שנשמרה ב-DB
                        setLearnings((prevLearnings) =>
                            prevLearnings.map((l) =>
                                l._id === learning._id ? { ...l, _id: res.data._id } : l
                            )
                        );
                    }
                }
            } catch (error) {
                console.error("Error saving learnings to DB:", error);
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

    return (
        <div className="card flex gap-3" style={{ display: 'flex', alignItems: 'center', marginLeft: '5vw', marginRight: '5vw' }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', marginRight: '15vw' }}>
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-arrow-right-arrow-left"></i>
                        </span>
                        <Controller name="word" control={control} rules={{ required: true }} render={({ field }) => (
                            <InputText {...field} placeholder="מילה" className={classNames({ 'p-invalid': field.invalid })} />)} />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-arrow-right-arrow-left"></i>
                        </span>
                        <br />
                        <Controller name="translatedWord" control={control} rules={{ required: true }} render={({ field }) => (
                            <InputText {...field} placeholder="תרגום" className={classNames({ 'p-invalid': field.invalid })} />)} />
                    </div>
                    <br />
                    <Button type="submit" label="הוסף" className="mt-2" />

                    <div style={{ flex: 2 }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                        <Button
                            icon="pi pi-info-circle"
                            className="p-button-rounded p-button-info"
                            // style={{ position: 'absolute', top: '10px', right: '10px' }}
                            onClick={handleInfoButtonClick}
                        />

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
                            chooseLabel= " בחר קובץ "
                            className="p-button-primary"
                        />
                    </div>
                </div>
                </form>


                

                <Dialog
                    visible={showInfoDialog}
                    onHide={handleDialogClose}
                    header="הסבר על העלאת קובץ"
                    footer={<Button label="סגור" icon="pi pi-times" onClick={handleDialogClose} />}
                    style={{ width: '50vw' }}
                >
                    <p>יש להעלות קובץ בפורמט Excel (.xlsx או .xls) עם המבנה הבא:</p>
                    <ul>
                        <li><strong>מילה:</strong> המילה שברצונך להוסיף.</li>
                        <li><strong>תרגום:</strong> התרגום של המילה.</li>
                    </ul>
                    <p>לדוגמה:</p>
                    <table style={{ border: '1px solid #ddd', borderCollapse: 'collapse', width: '100%', marginTop: '10px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #ddd', padding: '5px' }}>מילה</th>
                                <th style={{ border: '1px solid #ddd', padding: '5px' }}>תרגום</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ border: '1px solid #ddd', padding: '5px' }}>שלום</td>
                                <td style={{ border: '1px solid #ddd', padding: '5px' }}>Hello</td>
                            </tr>
                            <tr>
                                <td style={{ border: '1px solid #ddd', padding: '5px' }}>תודה</td>
                                <td style={{ border: '1px solid #ddd', padding: '5px' }}>Thank you</td>
                            </tr>
                        </tbody>
                    </table>
                </Dialog>


                <div className="card">
                    <DataTable key={editId} value={learnings} responsiveLayout="scroll" rowClassName={(rowData) => (
                        rowData._id === editId ? 'editable-row' : ''
                    )}>
                        <Column header="מילה" body={(rowData) =>
                            editId === rowData._id ? (
                                <InputText value={editData.word}
                                    onChange={(e) => handleInputChange(e, "word")}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(); }}
                                />) :
                                rowData.word} />

                        <Column header="תרגום" body={(rowData) =>
                            editId === rowData._id ? (
                                <InputText value={editData.translatedWord}
                                    onChange={(e) => handleInputChange(e, "translatedWord")}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleUpdate(); }}
                                />) :
                                rowData.translatedWord} />

                        <Column body={(rowData) => (
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {editId === rowData._id
                                    ? (<>
                                        <Button label="שמור" className="p-button-success p-button-sm" onClick={handleUpdate} />
                                        <Button icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(rowData._id)} />
                                    </>)
                                    : (<>
                                        <Button label="עדכן" className="p-button-warning p-button-sm" onClick={() => handleEdit(rowData)} />
                                        <Button icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(rowData._id)} />
                                    </>)}
                            </div>
                        )} />
                    </DataTable>
                </div>
            </div>
            <Button label="סיום" className="mt-2" disabled={learnings.length < 1} onClick={() => navigate('/practice', { state: { learning: learnings, level: level, courseId: courseId } })} />
        </div>
    );
};

export default Learning;