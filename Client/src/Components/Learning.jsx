import React from 'react';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import 'primeicons/primeicons.css';
import { PrimeIcons } from 'primereact/api'
import { Button } from 'primereact/button';
import axios from 'axios'
import { classNames } from 'primereact/utils';


const Learning = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

    const defaultValues = {
        word: '',
        translatedWord: '',
    }
    const { control, formState: { errors }, handleSubmit, reset, setError } = useForm({ defaultValues });

    const onAdd = async (data) => {
        try {
            const res = await axios.post('http://localhost:6661/learnings/', data)
            if (res.status === 200) {
                console.log(res.data)
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
            <form onAdd={handleSubmit(onAdd)} className="p-fluid">
                <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-arrow-right-arrow-left"></i>
                    </span>
                    <InputText placeholder="Word" />
                    <span> <span >  </span>   </span>
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-arrow-right-arrow-left"></i>
                    </span>
                    {<Controller name="word" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                        <InputText id={field.name} {...field} placeholder="Translate" className={classNames({ 'p-invalid': fieldState.invalid })} />)} />}

                </div>
                <br/>
                <Button type="Add" label="Add" className="mt-2" />
            </form>
        </div>
        
    )
}

export default Learning;
