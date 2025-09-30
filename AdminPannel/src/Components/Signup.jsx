import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Signup = () => {
  let navigate = useNavigate()
  let [email,setemail] = useState("")
  let [password,setPassword] = useState("")
  let [username,setUserName] = useState("")

  let handleSignup = (()=>{
    axios.post("http://localhost:8080/signup",{username , email,password})
    .then((res)=> {
      if(res.data.message){
        alert(res.data.message)
        navigate("/")
      }
    })
    .catch((err)=> alert(err))
  })
  return (
    <div>
        <h1>Sign up</h1>
        <input type="text" onChange={(e)=>setUserName(e.target.value)} value={username}/>
        <input type="email" onChange={(e)=>setemail(e.target.value)} value={email}/>
        <input type="password" onChange={(e)=>setPassword(e.target.value)} value={password}/>
        <button onClick={handleSignup}>Sign up</button>

        
    </div>
  )
}

export default Signup
