import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ResetPass = () => {
  let [pass1,setNewPass1] = useState("")
  let [pass2,setNewPass2] = useState("")
  let userEmail = localStorage.getItem("userEmail")

  let navigate = useNavigate()
  let handleConfirmPass = (()=>{

    if(pass1 === pass2) {
       axios.post("http://localhost:8080/confirmpass",{userEmail , pass1})
      .then((res)=>{
        alert(res.data.message)
        if(res.data.message === "Password changed !"){
          navigate("/")
        }
      })
      .catch((err)=>{
        alert(err)
      })
    }
    else{
      alert("password dose not match !")
      setNewPass1(" ")
      setNewPass2(" ")
    }
   
  })
  return (
    <div>
      <h1>Enter New Password</h1>
      <input type="password" onChange={(e)=>setNewPass1(e.target.value)} value={pass1}/>
      <input type="password" onChange={(e)=>setNewPass2(e.target.value)} value={pass2}/>
      <button onClick={handleConfirmPass}>Confirm Password</button>
    </div>
  )
}

export default ResetPass
