import React, { useEffect, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { setToken, logOut } from '../../redux/tokenSlice'
import '../../App.css'

const Learning = () => {

    const [learnings, setLearnings] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({ word: '', translatedWord: '' });

    const location = useLocation();
    const { token } = useSelector((state) => state.token)
    const { language, level, courseId } = location.state || {}; // קבלת הרמה שנבחרה
    console.log(level)

    const navigate = useNavigate();

    const columns = [
        { field: 'word', header: 'מילה' },
        { field: 'translatedWord', header: 'תרגום' }
    ];

    // useEffect(() => {
    //     if (!token) return;
    //     axios.get(`http://localhost:6660/learnings`,
    //          { headers: { Authorization: `bearer ${token}` } }
    //     )
    //         .then(response => setProducts(response.data))
    //         .catch(error => console.error('Error fetching data:', error));
    // }, [token]);

    useEffect(() => {
        if (!token) return;
        // const { level } = location.state || {}; // קבלת הרמה מתוך location.state
        axios.get('http://localhost:6660/learnings',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { level },  // הוספת level כ־query
            }
        )
            .then(response => setLearnings(response.data))
            .catch(e => {
                if (e.response && e.response.status === 404) {
                    console.error('No data found for the given level:', level);
                }
                else {
                    console.error(e);  // שגיאות אחרות
                }
            });
    }, [token, location.state]);


    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            word: '',
            translatedWord: ''

        }
    });



    const onSubmit = async (data) => {
        if (learnings.length > 10) {
            alert("You cannot add more than 10 words.");
            return;
        }
        try {
            console.log(token)
            console.log({ data })

            const res = await axios.post(`http://localhost:6660/learnings/`, data,
                { headers: { Authorization: `bearer ${token}` } }
            );
            if (res.status === 200) {
                setLearnings([...learnings, res.data]);
                reset();
            }
            console.log("res.data._id" + res.data._id);
            AddLearningToLevel(res.data._id)
        } catch (e) {
            console.error(e);
        }
    };

    const AddLearningToLevel = async (learning) => {
        const LevelRes = await axios.get(`http://localhost:6660/levels/${level}`);
        console.log("learning" + learning);
        const levelObj = {
            ...LevelRes.data,
            learning: [...LevelRes.data.learning, learning] // הוספת ערך חדש למערך
        };
        console.log("levelObj " + levelObj.learning);
        await axios.put(`http://localhost:6660/levels/`, levelObj);
    }

    const handleEdit = (product) => {
        setEditId(product._id);
        setEditData({ word: product.word, translatedWord: product.translatedWord });
    };

    const handleInputChange = (e, field) => {
        setEditData((prevData) => ({ ...prevData, [field]: e.target.value }));
    };

    const handleUpdate = async () => {
        try {
            const updatedLearning = {
                _id: editId,
                word: editData.word,
                translatedWord: editData.translatedWord
            };

            const res = await axios.put('http://localhost:6660/learnings/', updatedLearning);
            if (res.status === 200) {
                setLearnings(learnings.map((p) => (p._id === editId ? { ...p, ...updatedLearning } : p)));
                setEditId(null);
            }
        } catch (error) {
            console.error("Error updating word:", error);
        }
    };

    const handleDelete = async (_id) => {
        try {
            await axios.delete(`http://localhost:6660/learnings/${_id}`);
            setLearnings(learnings.filter(product => product._id !== _id));
        } catch (error) {
            console.error('Error deleting word:', error);
        }
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
                    <Button type="submit" label="הוסף" className="mt-2" onClick={() => onSubmit(learnings)} />
                </form>
            </div>


            <div style={{ flex: 2 }}>
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