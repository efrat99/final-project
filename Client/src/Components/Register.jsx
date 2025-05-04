import axios from 'axios'
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { SelectButton } from 'primereact/selectbutton';
import { InputOtp } from 'primereact/inputotp';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, logOut, setUser } from '../redux/tokenSlice'

import { useNavigate } from 'react-router-dom'

export const Register = ({ onClose }) => {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const options = ['Teacher', 'Student'];
    const [value, setValue] = useState(options[0]);
    const [token, setTokens] = useState(0);
    const [selectedRole, setSelectedRole] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const customInput = ({ events, props }) => <input {...events} {...props} type="text" className="custom-otp-input" />;

    const defaultValues = {
        firstName: '',
        lastName: '',
        password: '',
        email: '',
        phone: '',
        userType: ''
    }
    const { control, formState: { errors }, handleSubmit, reset, setError } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        if (data.userType == "Teacher" && !selectedRole) {
            setSelectedRole(true)
        }
        else {

            if (data.userType == "Teacher" && token != 1234)
                alert("הכנס קוד תקין")
            else {

                try {
                    setErrorMessage('');
                    const res = await axios.post('http://localhost:6660/api/auth/', data)
                    if (res.status === 200) {
                        console.log(res.data);
                        dispatch(setToken(res.data.accessToken))
                        dispatch(setUser(res.data.userInfo))
                        console.log(res.data)
                        setFormData(data);
                        alert(data.firstName + "  נרשמת בהצלחה!🤞😊");
                        //יוצרת hush-func
                        setShowMessage(true);
                        setSelectedRole(false)
                        reset();
                        onClose();
                        navigate('/home')
                    }
                }
                catch (e) {
                    if (e.response && e.response.data && e.response.data.message) {
                        if (e.response.data.message === "This email is already in use. Please choose another one") {
                            setErrorMessage("המייל שהוזן כבר קיים במערכת. נסה מייל אחר.");
                        } else {
                            setErrorMessage("אירעה שגיאה בעת יצירת החשבון. נסה שוב מאוחר יותר.");
                        }
                        console.error("Error from server:", e.response.data.message);
                    } else {
                        console.error(e);
                        alert("An unknown error occurred: " + e.message);
                    }
                }
            }


        }

    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

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
            <div className="flex justify-content-center">
                <div className="card">


                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="firstName" control={control} rules={{ required: 'firstName is required.', pattern: { value: /^[A-Zא-ת]{2,}$/i, message: 'First name must be at least two chars long' } }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="firstName" className={classNames({ 'p-error': errors.name })}>firstName*</label>
                            </span>
                            {getFormErrorMessage('firstName')}
                        </div>

                        <br></br>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="lastName" control={control} rules={{ required: 'lastName is required.', pattern: { value: /^[A-Zא-ת]{2,}$/i, message: 'Last name must be at least two chars long' } }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="lastName" className={classNames({ 'p-error': errors.name })}>lastName*</label>
                            </span>
                            {getFormErrorMessage('lastName')}
                        </div>

                        <br></br>
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <Controller name="email" control={control}
                                    rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' } }}
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
                        <div className=
                            "card flex justify-content-center">
                            <span className="p-float-label">
                                <Controller name="userType" onChange={(e) => { setSelectedRole(e.value) }} control={control} render={({ field, fieldState }) => (
                                    <SelectButton value={value} onChange={(e) => {
                                        console.log("SelectButton onChange triggered");
                                    }} options={options} id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                            </span>
                        </div>

                        <br></br>

                        {selectedRole && (
                            <div className="card flex justify-content-center">
                                <style scoped>
                                    {`
                            .custom-otp-input {
                                width: 40px;
                                font-size: 36px;
                                border: 0 none;
                                appearance: none;
                                text-align: center;
                                transition: all 0.2s;
                                background: transparent;
                                border-bottom: 2px solid var(--surface-500);
                                background-color: rgb(255, 98, 0);
                            }

                            .custom-otp-input:focus {
                                outline: 0 none;
                                border-bottom-color: rgb(255, 98, 0);
                                background-color: rgb(255, 98, 0) !important;
                                
                            }
                        `}
                                </style>

                                <InputOtp value={token} onChange={(e) => setTokens(e.value)} inputTemplate={customInput} className="custom-otp-input" />
                            </div>
                        )}
                        <br></br>
                        <div className="field-checkbox">
                            <Controller name="accept" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                                <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)} checked={field.value} className={classNames({ 'p-invalid': fieldState.invalid })} />
                            )} />
                            <label htmlFor="accept" className={classNames({ 'p-error': errors.accept })}>אני מסכים לתנאי השימוש*</label>
                        </div>
                        <br></br>
                        {errorMessage && <small className="p-error">{errorMessage}</small>}
                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>

    );
}
export default Register;
