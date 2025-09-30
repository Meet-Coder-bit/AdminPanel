import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Forgot = () => {
  let navigate = useNavigate()
  let [forgotEmail, setForgotEmail] = useState("")
  let [otpInput, setOtpInput] = useState(false)

  let [userOtp, setUserOtp] = useState(0)

  let handleForgotOtp = (() => {
    axios.post("http://localhost:8080/forgot", { forgotEmail })
      .then((res) => {
        alert(res.data.message)
        setOtpInput(res.data.flag)
      })
      .catch((err) => alert(err))
  })

  let handleResetPass = (()=>{
      axios.post("http://localhost:8080/resetpass",{userOtp , forgotEmail})
        .then((res)=>{
          alert(res.data.message)
          if(res.data.message === "Otp is correct !"){
            navigate("/resetPass")
            localStorage.setItem("userEmail",res.data.forgotEmail)
          }
        })
        .catch((err)=>{
          alert(err)
        })
  })
  return (
    <div>
      <h1>Forgot</h1>
      <input type="email" onChange={(e) => setForgotEmail(e.target.value)} value={forgotEmail} />
      <button onClick={handleForgotOtp}>Get OTP</button>

      {
        otpInput ?
          <>
            <input type='number' onChange={(e) => setUserOtp(e.target.value)} value={userOtp} />
            <button onClick={handleResetPass}>Reset Password</button>
          </>

          : null
      }

    </div>
  )
}

export default Forgot
