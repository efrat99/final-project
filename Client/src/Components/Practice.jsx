
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { CascadeSelect } from 'primereact/cascadeselect';
import { useLocation } from 'react-router-dom';
import Level from './Level';
const Practice = () => {
    const [products, setProducts] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedData, setEditedData] = useState({});
     const location = useLocation();   
    const { learning } = location.state || {}; // קבלת הנתונים שנשלחו

    const navigate = useNavigate();
        const [selectedNum, setSelectedNum] = useState(null);
        const numbers = [
            {
                cname: 'Level 1',
                number: [{ cname: '1' }]
            },
            {
                cname: 'Level 2',
                number: [{ cname: '2' }]
            },
            {
                cname: 'Level 3',
                number: [{ cname: '3' }]
            },
            {
                cname: 'Level 4',
                number: [{ cname: '4' }]
            }
        ];   
    useEffect(() => {
        axios.get('http://localhost:6660/practices/')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const defaultValues = {
        question: '',
        answers: ['', '', '', ''],
        correctAnswer: ''
    };

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        if (products.length >= 10) {
            alert("You cannot add more than 10 questions.");
            return;
        }
        try {
            const res = await axios.post('http://localhost:6660/practices/', data);
            if (res.status === 200) {
                setProducts([...products, res.data]);
                reset();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleEdit = (product) => {
        setEditId(product._id);
        setEditedData({ ...product });
    };

    const handleInputChange = (e, field, index = null) => {
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
        try {
            const updatedPractice = {
                _id: editId,
                question: editedData.question,
                answers: editedData.answers,
                correctAnswer: parseInt(editedData.correctAnswer, 10) // להמיר למספר
            };

            const res = await axios.put('http://localhost:6660/practices/', updatedPractice);
            if (res.status === 200) {
                setProducts(products.map((p) => (p._id === editId ? updatedPractice : p)));
                setEditId(null);
            }
        } catch (error) {
            console.error("Error updating question:", error);
        }
    };

    const handleDelete = async (_id) => {
        try {
            await axios.delete(`http://localhost:6660/practices/${_id}`);
            setProducts(products.filter(product => product._id !== _id));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    return (
        <div className="card flex flex-column md:flex-row gap-3">
            <div className="card" style={{ display: 'flex', gap: '20px' }}>

                {/* טופס להוספת שאלה */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid" style={{ flex: 1 }}>
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon"><i className="pi pi-question"></i></span>
                        <Controller name="question" control={control} rules={{ required: true }} render={({ field }) => (
                            <InputText {...field} placeholder="Question" className={classNames({ 'p-invalid': errors.question })} />
                        )} />
                    </div>

                    {[0, 1, 2, 3].map((index) => (
                        <div className="p-inputgroup mt-2" key={index}>
                            <span className="p-inputgroup-addon">{index + 1}</span>
                            <Controller name={`answers.${index}`} control={control} rules={{ required: true }} render={({ field }) => (
                                <InputText {...field} placeholder={`Answer ${index + 1}`} className={classNames({ 'p-invalid': errors.answers?.[index] })} />
                            )} />
                        </div>

                    ))}

                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon"><i className="pi pi-check"></i></span>
                        <Controller name="correctAnswer" control={control} rules={{ required: true }} render={({ field }) => (
                            <InputText {...field} placeholder="Correct Answer (1-4)" className={classNames({ 'p-invalid': errors.correctAnswer })} />
                        )} />
                    </div>

                    <Button type="submit" label="Add Question" className="mt-3" />
                </form>

                {/* טבלת השאלות */}
                <div style={{ flex: 1 }}>
                    <DataTable value={products} responsiveLayout="scroll">
                        <Column body={(rowData) => (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px' }}>
                                {/* הצגת השאלה */}
                                {editId === rowData._id ? (
                                    <>
                                        <strong>שאלה:</strong>
                                        <InputText value={editedData.question} onChange={(e) => handleInputChange(e, "question")} />
                                    </>
                                ) : (
                                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>{rowData.question}</div>
                                )}

                                {/* הצגת תשובות */}
                                {rowData.answers.map((answer, index) => (
                                    <div key={index}>
                                        {editId === rowData._id ? (
                                            <>
                                                <strong>תשובה {index + 1}:</strong>
                                                <InputText value={editedData.answers[index]} onChange={(e) => handleInputChange(e, "answers", index)} />
                                            </>
                                        ) : (
                                            <div>
                                                {answer} {rowData.correctAnswer === index + 1 ? "✔️" : "❌"}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* עריכת תשובה נכונה */}
                                {editId === rowData._id && (
                                    <div>
                                        <strong>תשובה נכונה:</strong>
                                        <InputText value={editedData.correctAnswer} onChange={(e) => handleInputChange(e, "correctAnswer")} />
                                    </div>
                                )}

                                {/* כפתור עדכון ושמירה */}
                                <div style={{ textAlign: 'center' }}>
                                    {editId === rowData._id ? (
                                        <Button label="Save" className="p-button-success p-button-sm" onClick={handleSave} />
                                    ) : (
                                        <Button label="Update" className="p-button-warning p-button-sm" onClick={() => handleEdit(rowData)} />
                                    )}
                                    <Button icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(rowData._id)} />
                                </div>
                            </div>
                        )} />
                    </DataTable>
                </div>
                <div> 
                    {products.length === 10 && (   <div className="card flex justify-content-center">
                        <CascadeSelect value={selectedNum} onChange={(e) => setSelectedNum(e.value)} options={numbers} 
                            optionLabel="cname" optionGroupLabel="number" optionGroupChildren="number"
                            className="w-full md:w-14rem" breakpoint="767px" placeholder="Select a level" style={{ minWidth: '14rem' }}  />
                    </div>)}
             { console.log('Learning:',)}
                    <Button label="Add Level" className="mt-2" disabled={products.length !== 10} onClick={() =>{navigate('/Level', {state:{ practice:  products ,learning:learning,level:selectedNum}}) }}/>
                
                   
        </div></div></div>
    );
};

export default Practice;
