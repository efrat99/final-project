import React from 'react';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import 'primeicons/primeicons.css';
import { PrimeIcons } from 'primereact/api'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios'
import { classNames } from 'primereact/utils';
//import { ProductService } from '../service/ProductService';

const Learning = () => {
    // const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

    const [products, setProducts] = useState([]);
    const columns = [
        {field: 'word', header: 'word'},
        {field: 'translatedWord', header: 'translatedWord'}
    ];
    
    useEffect(() => {
        axios.get('http://localhost:6660/learnings/')
        .then(response => setProducts(response.data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);


    const defaultValues = {
        word: '',
        translatedWord: '',
    }
    const { control, formState: { errors }, handleSubmit, reset, setError } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        if (products.length >= 10) {
            alert("You cannot add more than 20 words.");
            return;
        }
        try {
            const res = await axios.post('http://localhost:6660/learnings/', data)
            if (res.status === 200) {
                console.log(res.data)
                setProducts([...products, res.data]); 
            }
        } catch (e) {
            //alert("Name and email are both required")
            console.error(e)
        }
        setFormData(data);
        // setShowMessage(true);
        reset();
    };

    return (
        <div className="card flex flex-column md:flex-row gap-3">
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-arrow-right-arrow-left"></i>
                    </span>
                    {/* <InputText placeholder="Word" /> */}
                    {<Controller name="word" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                        <InputText id={field.name} {...field} placeholder="word" className={classNames({ 'p-invalid': fieldState.invalid })} />)} />}
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-arrow-right-arrow-left"></i>
                    </span>
                    {<Controller name="translatedWord" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                        <InputText id={field.name} {...field} placeholder="translate" className={classNames({ 'p-invalid': fieldState.invalid })} />)} />}
                    {/* <InputText placeholder="Translate" /> */}
                </div>
                <br />
                <Button type="submit" label="Add" className="mt-2" />
            </form>


            <div className="card">
            <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
                {columns.map((col, i) => (
                    <Column key={col.field} field={col.field} header={col.header} />
                ))}
            </DataTable>
        </div>
        </div>


    )
}

export default Learning;
