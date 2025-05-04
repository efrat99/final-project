import axios from "axios";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useDispatch, useSelector } from 'react-redux';
import { setToken, logOut, setUser } from '../redux/tokenSlice'
import { useNavigate } from 'react-router-dom'
import '../login.css';


const Signin = ({ onClose }) => {
    const { handleSubmit, control, formState: { errors }, reset } = useForm();
    const [formData, setFormData] = useState({});
    const [showMessage, setShowMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();


    // const element = document.querySelector('[p-icon-field p-icon-field-right"]');
    // if (element) {
    //     element.className = 'p-icon-field p-icon-field-left'; // החלף את כל המחלקות בשם החדש
    // }

    // const passwordHeader = <h6>Pick a password</h6>;
    // const passwordFooter = <small>Make it strong!</small>;
    // const getFormErrorMessage = (name) => errors[name] ? <small className="p-error">{errors[name].message}</small> : null;
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const res = await axios.post("http://localhost:6660/api/auth/login", data);
            if (res.status === 200) {
                dispatch(setToken(res.data.accessToken))
                dispatch(setUser(res.data.userInfo))
                console.log(res.data.userInfo);
                setFormData(data);
                alert(res.data.userInfo.email + "  נכנסת סופסוף!!!❤😍");
                setShowMessage(true);
                reset();
                onClose();
                navigate('/home')

            }
        } catch (e) {
            if (e.response && e.response.status === 401) {
                // alert('שם משתמש או סיסמה שגויים');
                setErrorMessage("שם המשתמש או הסיסמה שגויים");
            }
            else {
                console.error(e);  // שגיאות אחרות
            }
        }
    };

    return (
        <div className="form-demo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px', }}>
            <div className="flex justify-content-center" style={{ width: '300px', margin: 'auto' }}>
                <div className="card" style={{ width: '200px', margin: 'auto', padding: '0', minWidth: '250px', maxWidth: '200px', minHeight: '100px', border: 'none' }}>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid" style={{ width: '100%', margin: '0' }}>
                        <div className="field" style={{ margin: '5%' }}>
                            <span className="p-float-label p-input-icon-right">
                                <Controller name="email" control={control}
                                    rules={{ required: "Email is required.", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Invalid email address." } }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ "p-invalid": fieldState.invalid })} />
                                    )} />
                                <label htmlFor="email" className={classNames({ "p-error": errors.email })}>כתובת אימייל*</label>
                            </span>
                            {/* {getFormErrorMessage("email")} */}
                        </div>
                        <div className="field" style={{ margin: '5%' }}>
                            <span className="p-float-label">
                                <Controller name="password" control={control} rules={{ required: "Password is required." }} render={({ field, fieldState }) => (
                                    <Password id={field.name} {...field} toggleMask feedback={false} className={classNames({ "p-invalid": fieldState.invalid })}
                                    // header={passwordHeader} footer={passwordFooter}
                                    />
                                )} />
                                <label htmlFor="password" className={classNames({ "p-error": errors.password })}>סיסמה*</label>
                            </span>
                            {/* {getFormErrorMessage("password")} */}
                        </div>
                        <br />
                        {/* {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>} הצגת הודעת שגיאה */}
                        {errorMessage && (
                            <div className="error-message">{errorMessage}</div>
                        )}
                        <Button type="submit" label="היכנס" className="mt-2" style={{ width: '100px' }} />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signin;
