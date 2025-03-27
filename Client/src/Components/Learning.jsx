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
import Practice from './Practice';
import { useNavigate } from 'react-router-dom';

//import { ProductService } from '../service/ProductService';

const Learning = () => {

    // const [showMessage, setShowMessage] = useState(false);

    const [formData, setFormData] = useState({});

    const [products, setProducts] = useState([]);
  const navigate = useNavigate();
    const columns = [
        { field: 'word', header: 'word' },
        { field: 'translatedWord', header: 'translatedWord' }
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
                reset();
            }
        } catch (e) {
            //alert("Name and email are both required")
            console.error(e)
        }
        setFormData(data);
        // setShowMessage(true);

    };

    return (
          <div className="card flex gap-3" style={{ display: 'flex', alignItems: 'center', marginLeft: '5vw',  marginRight: '5vw' }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end',  marginRight: '15vw'  }}>
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-arrow-right-arrow-left"></i>
                        </span>
                        <Controller name="word" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} placeholder="word" className={classNames({ 'p-invalid': fieldState.invalid })} />)} />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-arrow-right-arrow-left"></i>
                        </span>
                        <Controller name="translatedWord" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} placeholder="translate" className={classNames({ 'p-invalid': fieldState.invalid })} />)} />
                    </div>
                    <br />
                    <Button type="submit" label="Add" className="mt-2" />
                </form>
            </div>
           

            <div style={{ flex: 2 }}>
                <div className="card">
                    <DataTable value={products} responsiveLayout="scroll">
                        {columns.map((col, i) => (
                            <Column key={col.field} field={col.field} header={col.header} />
                        ))}
                    </DataTable>
                </div>
            </div>
        <Button  label="Add Learning" className="mt-2" disabled={products.length !== 10} onClick={() =>navigate('/practice', { learning: { products } }) }/>
        </div>
    )
}

export default Learning;
