import React from 'react';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import 'primeicons/primeicons.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios'
import { classNames } from 'primereact/utils';


const Practice = () => {
    const [formData, setFormData] = useState({});
    const [answers, setAnswers] = useState([]);
    const [products, setProducts] = useState([]);
    const columns = [
        { field: 'word', header: 'word' },
        { field: 'translatedWord', header: 'translatedWord' }
    ];

    useEffect(() => {
        axios.get('http://localhost:6660/practices/')
            .then(response => {
                console.log(response.data);
                setProducts(response.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);



    const defaultValues = {
        question: '',
        answers: ['', '', '', ''],
        correctAnswer: ''
    };
    const renderAnswersTable = (answers, correctAnswer) => {
        if (!answers || !Array.isArray(answers) || answers.length === 0) {
            return null;
        }

        return (
            <DataTable value={answers.map((text, index) => ({ text, index: index + 1 }))} responsiveLayout="scroll">
                <Column field="text" header="Answer" />
                <Column header="Correct?" body={(data) => (data.index === correctAnswer ? "✔️" : "❌")} />
            </DataTable>
        );
    };

    const { control, formState: { errors }, handleSubmit, reset, setError } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        if (products.length >= 10) {
            alert("You cannot add more than 10 questions.");
            return;
        }
        try {
            const res = await axios.post('http://localhost:6660/practices/', data)
            if (res.status === 200) {
                setProducts([...products, res.data]);
                reset();
            }
        } catch (e) {
            console.error(e)
        }
        setFormData(data);
        // setShowMessage(true);

    };


    const handleDelete = async (_id) => {
        console.log("Sending request to delete _id:", _id); // בדיקה
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


                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <DataTable value={products} responsiveLayout="scroll">
                            <Column body={(rowData) => (
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                    <div>
                                        <div style={{ marginTop: 'auto', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '18px' }}>{rowData.question}</div>
                                        {renderAnswersTable(rowData.answers, rowData.correctAnswer)}
                                    </div>
                                    <div style={{ marginBottom: '10px' }}></div>
                                    <div style={{ marginTop: 'auto', textAlign: 'center', marginBottom: '10px' }}>
                                        {/* <Button label="Update" className="p-button-warning p-button-sm" onClick={() => handleUpdate(rowData._id)}>
                                        Update
                                        </Button> */}
                                        <Button icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(rowData._id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )} />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Practice;
