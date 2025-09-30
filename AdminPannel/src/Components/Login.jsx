import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

const Login = () => {
  let [email, setEmail] = useState("")
  let [password, setPassword] = useState("")

  let navigate = useNavigate()
  let handleLogIn = (() => {


    axios.post("http://localhost:8080/login", { email, password })
      .then((res) => {

        if (res.data.token) {
          localStorage.setItem("token", res.data.token)
          alert(res.data.message)
          if(res.data.userRole === "admin"){
            navigate("/admin")
          }
          else if(res.data.userRole === "superadmin"){
            navigate("/superadmin")
          }
          else{
            navigate("/home")
          }
        }
        else{
          alert("user not valid !")
        }
      }
      )
      .catch((err) => alert(err))
  })
  return (
    <div>
      <h1>Log in</h1>
      <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
      <button onClick={handleLogIn}>Log in</button>
      <Link to="/forgot"><button>Forgot</button></Link>
      <Link to="/signup"><button>Sign up</button></Link>
    </div>
  )
}

export default Login
