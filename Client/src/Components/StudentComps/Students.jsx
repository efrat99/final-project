import { useEffect, useRef, useState } from "react"
import axios from 'axios'
import Student from './Student'
const Students = () => {
    const createUser = async () => {
        const nameRef = useRef("")
        const userNameRef = useRef("")
        const emailRef = useRef("")
        const addressRef = useRef("")
        const phoneRef = useRef("")
        const newUser = {
            name: nameRef.current.value,
            userName: userNameRef.current.value,
            email: emailRef.current.value,
            phone: phoneRef.current.value
        }
        try {
            const res = await axios.post('http://localhost:6660/teachers/', newUser)

            if (res.status === 200) {
                console.log(res.data)
           //     getUsers()

            }
        } catch (e) {
      //      getUsers();
        //    alert("Name and email are both required")
            console.error(e)
        }

    }

   
   
    return (
        <div>
          {/* const teacher =createTeacher(); */}
          home page!
           <Student teacher={teacher}/>
        </div>
    )
}