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

import {useNavigate} from 'react-router-dom'

export const Register = ({ onClose }) => {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const options = ['Teacher', 'Student'];
    const [value, setValue] = useState(options[0]);
    const [token, setTokens] = useState(0);
    const [selectedRole, setSelectedRole] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // const handleRoleChange = (e) => {
    //     console.log("Selected role:", e.value);
    //     setSelectedRole(e.value);
    //     setValue('userType', e.value);
    // };
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
                        
                        // dispatch(setToken(res.data.accessToken))
                        // dispatch(setUser(res.data.userInfo))
                        // // const user = useSelector(state => state.token.user)
                        // console.log(user);
                        // console.log(res.data);
                        // setFormData(data);
                        // alert(res.data.userInfo.email + "  נכנסת סופסוף!!!❤😍");
                        // setShowMessage(true);
                        // reset();
                        // onClose();
                        // navigate('/home')
                    }
                }
                catch (e) {
                    console.error(e)
                }
            }
           

        }

    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    // const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
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
            {/* <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Registration Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        <b>{formData.firstName}</b> - You have successfully registered.
                    </p>
                </div>
            </Dialog> */}
            {/* <Dialog> */}
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
                                {/* <i className="pi pi-envelope" /> */}
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
                                    // <SelectButton value={value} onChange={(e) => {setValue(e.value); handleRoleChange(e)}} options={options} id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}/>
                                    <SelectButton value={value} onChange={(e) => {
                                        console.log("SelectButton onChange triggered");
                                    }} options={options} id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    /* <SelectButton 
                                    value={value} 
                                    onChange={(e) => {
                                        console.log("SelectButton onChange triggered", e); // הדפסת האירוע
                                        setValue(e.value);  // עדכון ערך הסטייט
                                        handleRoleChange(e); // הפעלת פונקציית שינוי תפקיד
                                    }} 
                                    options={options} 
                                    /> */
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
                            }

                            .custom-otp-input:focus {
                                outline: 0 none;
                                border-bottom-color: var(--primary-color);
                            }
                        `}
                                </style>

                                <InputOtp value={token} onChange={(e) => setTokens(e.value)} inputTemplate={customInput} />
                            </div>
                        )}
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
            {/* </Dialog> */}
        </div>

    );
}
export default Register;
