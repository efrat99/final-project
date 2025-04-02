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

const Learning = () => {
    const [products, setProducts] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editData, setEditData] = useState({ word: '', translatedWord: '' });

    const location = useLocation();
    const { level } = location.state || {}; // קבלת הרמה שנבחרה


    const navigate = useNavigate();
    const columns = [
        { field: 'word', header: 'Word' },
        { field: 'translatedWord', header: 'Translated Word' }
    ];

    useEffect(() => {
        axios.get('http://localhost:6660/learnings/',{ params: { level: level } })
            .then(response => setProducts(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            word: '',
            translatedWord: ''
        }
    });

    const onSubmit = async (data) => {
        if (products.length >= 3) {
            alert("You cannot add more than 10 words.");
            return;
        }
        try {
            const res = await axios.post('http://localhost:6660/learnings/', data);
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
                setProducts(products.map((p) => (p._id === editId ? { ...p, ...updatedLearning } : p)));
                setEditId(null);
            }
        } catch (error) {
            console.error("Error updating word:", error);
        }
    };

    const handleDelete = async (_id) => {
        try {
            await axios.delete(`http://localhost:6660/learnings/${_id}`);
            setProducts(products.filter(product => product._id !== _id));
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
                            <InputText {...field} placeholder="Word" className={classNames({ 'p-invalid': field.invalid })} />)} />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-arrow-right-arrow-left"></i>
                        </span>
                        <Controller name="translatedWord" control={control} rules={{ required: true }} render={({ field }) => (
                            <InputText {...field} placeholder="Translate" className={classNames({ 'p-invalid': field.invalid })} />)} />
                    </div>
                    <br />
                    <Button type="submit" label="Add" className="mt-2" />
                </form>
            </div>

            <div style={{ flex: 2 }}>
                <div className="card">
                    <DataTable value={products} responsiveLayout="scroll">
                        {columns.map((col) => (
                            <Column key={col.field} field={col.field} header={col.header} />
                        ))}
                        <Column body={(rowData) => (
                            <div style={{ display: 'flex', gap: '5px' }}>
                                {editId === rowData._id ? (
                                    <>
                                        <InputText value={editData.word} onChange={(e) => handleInputChange(e, "word")} />
                                        <InputText value={editData.translatedWord} onChange={(e) => handleInputChange(e, "translatedWord")} />
                                        <Button label="Save" className="p-button-success p-button-sm" onClick={handleUpdate} />
                                        <Button icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(rowData._id)} />
                                    </>
                                ) : (
                                    <>
                                        <Button label="Update" className="p-button-warning p-button-sm" onClick={() => handleEdit(rowData)} />
                                        <Button icon="pi pi-trash" className="p-button-danger p-button-sm" onClick={() => handleDelete(rowData._id)} />
                                    </>
                                )}
                            </div>
                        )} />

                    </DataTable>
                </div>
            </div>

            <Button label="Add Learning" className="mt-2" disabled={products.length !== 3} onClick={() => navigate('/practice', { state: { learning: products ,level:level} })} />
        </div>
    );
};

export default Learning;