import axios from 'axios'

// const login = () => {

//     const firstNameRef = useRef("")
//     const lastNameRef = useRef("")
//     const emailRef = useRef("")
//     const phoneRef = useRef("")



//     //post
//     const createTeacher = async () => {
//         const newTeacher = {
//             name: nameRef.current.value,
//             userName: userNameRef.current.value,
//             email: emailRef.current.value,
//             phone: phoneRef.current.value
//         }
//         try {
//             const res = await axios.post('http://localhost:6661/teachers/', newUser)

//             if (res.status === 200) {
//                 console.log(res.data)
//                 //getUsers()

//             }
//         } catch (e) {
//             //getUsers();
//             //alert("Name and email are both required")
//             console.error(e)
//         }

//     }
// }



import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
// import { Dropdown } from 'primereact/dropdown';
// import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
//import { CountryService } from '../service/CountryService';
//import '.';

export const Login = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const defaultValues = {
        firstName: '',
        lastName: '',
        password: '',
        email: '',
        phone: ''
    }
    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const onSubmit = async (data) => {

        try {
            const res = await axios.post('http://localhost:6661/teachers/', data)
            if (res.status === 200) {
                console.log(res.data)
                //getUsers()

            }
        } catch (e) {
            //getUsers();
            //alert("Name and email are both required")
            console.error(e)
        }
        setFormData(data);
        setShowMessage(true);
        reset();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
    const passwordHeader = <h6>Pick a password</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Registration Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        <b>{formData.firstName}</b> - You have successfully registered.
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Register</h5>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="firstName" control={control} rules={{ required: 'firstName is required.',  pattern: { value: /^[A-Z]{2,}$/i, message: 'First name must be at least two chars long' } }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="firstName" className={classNames({ 'p-error': errors.name })}>firstName*</label>
                            </span>
                            {getFormErrorMessage('firstName')}
                        </div>

                        <br></br>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="lastName" control={control} rules={{ required: 'lastName is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="lastName" className={classNames({ 'p-error': errors.name })}>lastName*</label>
                            </span>
                            {getFormErrorMessage('lastName')}
                        </div>

                        {/* <div className="field">
                            <span className="p-float-label">
                                <Controller name="lastName" control={control} rules={{ required: 'lastName is required.' }} render={({ field}) => (
                                    <InputText id={field.name} value={field.value} onChange={(e) => field.onChange(e.value)} />//dateFormat="dd/mm/yy" mask="99/99/9999" showIcon 
                                )} />
                                <label htmlFor="lastName">LastName*</label>
                            </span>
                        </div> */}
                        <br></br>
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                {/* <i className="pi pi-envelope" /> */}
                                <Controller name="email" control={control}
                                    rules={{ required: 'Email is required.', unique: true, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' } }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                <label htmlFor="email" className={classNames({ 'p-error': errors.email })}>Email*</label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>
                        <br></br>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                                    <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
                                )} />
                                <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>
                        <br></br>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="phone" control={control} rules={{ pattern: { value: /^0[0-9]{8,9}$/, message: 'Invalid phone number. E.g. 0123456789' } }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} type="tel" className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="phone" className={classNames({ 'p-error': errors.phone })}>Phone</label>
                            </span>
                            {getFormErrorMessage('phone')}
                        </div>
                        <br></br>

                        <div className="field-checkbox">
                            <Controller name="accept" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                                <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)} checked={field.value} className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} />
                            <label htmlFor="accept" className={classNames({ 'p-error': errors.accept })}>I agree to the terms and conditions*</label>
                        </div>
                        <br></br>

                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Login;
