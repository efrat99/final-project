
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Practice = (props) => {
    const [products, setProducts] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [practices, setPractices] = useState(null);

    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        defaultValues: {
            question: '',
            answers: ['', '', '', ''],
            correctAnswer: ''
        }
    });




    const location = useLocation();
    const { learning,level,courseId } = location.state || {};  // קבלת נתוני הלמידה

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:6660/practices/', { params: { level } })
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const onSubmit = async (data) => {
        if (products.length >= 1) {
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
                correctAnswer: parseInt(editedData.correctAnswer, 3)
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
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                {/* Form to add a new question */}
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

                {/* Display existing questions */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'flex-start', width: '100%',
                    }}>
                        {products.map((rowData) => (
                            <div key={rowData._id} style={{
                                display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px',
                                minWidth: '200px', flexGrow: 1, maxWidth: 'calc(33% - 20px)', flexBasis: 'auto', width: 'auto',
                            }}>
                                {/* Display question */}
                                {editId === rowData._id ? (
                                    <div>
                                        <strong>Question:</strong> <br />
                                        <InputText value={editedData.question} onChange={(e) => handleInputChange(e, "question")} />
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>
                                        {rowData.question}
                                    </div>
                                )}

                                {/* Display answers */}
                                {rowData.answers.map((answer, index) => (
                                    <div key={index}>
                                        {editId === rowData._id ? (
                                            <div>
                                                <strong>Answer {index + 1}:</strong> <br />
                                                <InputText value={editedData.answers[index]} onChange={(e) => handleInputChange(e, "answers", index)} />
                                            </div>
                                        ) : (
                                            <div>
                                                {answer} {rowData.correctAnswer === index + 1 ? "✔️" : "❌"}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Display correct answer edit */}
                                {editId === rowData._id && (
                                    <div>
                                        <strong>Correct answer:</strong> <br />
                                        <InputText value={editedData.correctAnswer} onChange={(e) => handleInputChange(e, "correctAnswer")} />
                                    </div>
                                )}

                                {/* Edit and Delete buttons */}
                                <div style={{ textAlign: 'center' }}>
                                    {editId === rowData._id ? (
                                        <Button label="Save" className="p-button-success p-button-sm" onClick={handleSave} />
                                    ) : (
                                        <Button label="Edit" className="p-button-warning p-button-sm" onClick={() => handleEdit(rowData)} />
                                    )}
                                    <Button icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(rowData._id)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Display CascadeSelect to choose Level, only if there are at least 10 questions */}
              {/* {products.length >= 10 && (
                    <div className="card flex justify-content-center mt-2">
                        <CascadeSelect 
                            value={selectedNum} 
                            onChange={(e) => setSelectedNum(e.value)} 
                            options={numbers}
                            optionLabel="cname" 
                            optionGroupLabel="number" 
                            optionGroupChildren="number"
                            className="w-full md:w-14rem" 
                            breakpoint="767px" 
                            placeholder="Select a level" 
                            style={{ minWidth: '14rem' }} 
                        />
                    </div>
                )}*/}  

                {/* Display Add Level button, it will be enabled only if there are 10 questions */}
                <Button 
                    label="Add Level" 
                    className="mt-2" 
                    disabled={products.length < 1} 
                    onClick={() => {
                        navigate('/Level', { 
                            state: { 
                                practice: products, 
                                learning: learning,
                                level: level,
                                courseId:courseId
                            } 
                        });
                    }} 
                />
            </div>
        </div>
    );
};

export default Practice;
