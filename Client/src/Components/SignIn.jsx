// import axios from "axios";
// import { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import classNames from "classnames";
// import { InputText } from "primereact/inputtext";
// import { Password } from "primereact/password";
// import { Button } from "primereact/button";


// const Signin = ({ onClose }) => {

//     const onSubmit = async (data) => {

//         try {
//             const res = await axios.post('http://localhost:6660/api/auth/', data)
//             if (res.status === 200) {
//                 console.log(res.data)
//                 //getUsers()
//                 setFormData(data);

//                 alert(data.firstName + "  Registration Successful!");
//                 setShowMessage(true);
//                 reset();
//                 onClose();

//             }
//         } catch (e) {
//             //getUsers();
//             //alert("Name and email are both required")
//             console.error(e)
//         }

//     };
//     return (
//         <div className="form-demo">
//             <div className="flex justify-content-center">
//                 <div className="card">
//                     <h5 className="text-center">Register</h5>
//                     <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
//                         <br></br>
//                         <div className="field">
//                             <span className="p-float-label p-input-icon-right">
//                                 {/* <i className="pi pi-envelope" /> */}
//                                 <Controller name="email" control={control}
//                                     rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' } }}
//                                     render={({ field, fieldState }) => (
//                                         <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
//                                     )} />
//                                 <label htmlFor="email" className={classNames({ 'p-error': errors.email })}>Email*</label>
//                             </span>
//                             {getFormErrorMessage('email')}
//                         </div>
//                         <br></br>

//                         <div className="field">
//                             <span className="p-float-label">
//                                 <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
//                                     <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
//                                 )} />
//                                 <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
//                             </span>
//                             {getFormErrorMessage('password')}
//                         </div>
//                         <br></br>
//                         <Button type="submit" label="Submit" className="mt-2" />
//                     </form>
//                 </div>
//             </div>
//             {/* </Dialog> */}
//         </div>
//     );
// }
// export default Signin;

import axios from "axios";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import classNames from "classnames";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

const Signin = ({ onClose }) => {
    const { handleSubmit, control, formState: { errors }, reset } = useForm();
    const [formData, setFormData] = useState({});
    const [showMessage, setShowMessage] = useState(false);

    const passwordHeader = <h6>Pick a password</h6>;
    const passwordFooter = <small>Make it strong!</small>;
    const getFormErrorMessage = (name) => errors[name] ? <small className="p-error">{errors[name].message}</small> : null;

    const onSubmit = async (data) => {
        try {
            const res = await axios.post("http://localhost:6660/api/auth/", data);
            if (res.status === 200) {
                console.log(res.data);
                setFormData(data);
                alert(data.firstName + "  Registration Successful!");
                setShowMessage(true);
                reset();
                onClose();
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="form-demo">
            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Register</h5>
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
                            {getFormErrorMessage("email")}
                        </div>
                        <br />
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="password" control={control} rules={{ required: "Password is required." }} render={({ field, fieldState }) => (
                                    <Password id={field.name} {...field} toggleMask className={classNames({ "p-invalid": fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
                                )} />
                                <label htmlFor="password" className={classNames({ "p-error": errors.password })}>Password*</label>
                            </span>
                            {getFormErrorMessage("password")}
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
