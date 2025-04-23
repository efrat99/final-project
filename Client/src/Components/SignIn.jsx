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


const Signin = ({ onClose }) => {
    const { handleSubmit, control, formState: { errors }, reset } = useForm();
    const [formData, setFormData] = useState({});
    const [showMessage, setShowMessage] = useState(false);
    const dispatch = useDispatch();

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
                console.log(res.data);
                setFormData(data);
                alert(res.data.userInfo.email + "  נכנסת סופסוף!!!❤😍");
                setShowMessage(true);
                reset();
                onClose();

                // if (res.data.userInfo.role === 'teacher')
                //     navigate('/teacherDashboard')
                // else if (res.data.userInfo.role === 'student')
                //     navigate('/studentDashboard')
                navigate('/home')

            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="form-demo">
            <div className="flex justify-content-center">
                <div className="card">
                    {/* <h5 className="text-center">Register</h5> */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <br />
                        <div className="field">
                            <span className="p-float-label p-input-icon-right">
                                <Controller name="email" control={control}
                                    rules={{ required: "Email is required.", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Invalid email address." } }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ "p-invalid": fieldState.invalid })} />
                                    )} />
                                <label htmlFor="email" className={classNames({ "p-error": errors.email })}>Email*</label>
                            </span>
                            {/* {getFormErrorMessage("email")} */}
                        </div>
                        <br />
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="password" control={control} rules={{ required: "Password is required." }} render={({ field, fieldState }) => (
                                    <Password id={field.name} {...field} toggleMask feedback={false} className={classNames({ "p-invalid": fieldState.invalid })} 
                                    // header={passwordHeader} footer={passwordFooter}
                                     />
                                )} />
                                <label htmlFor="password" className={classNames({ "p-error": errors.password })}>Password*</label>
                            </span>
                            {/* {getFormErrorMessage("password")} */}
                        </div>
                        <br />
                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signin;
