import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import Signup from './Components/Signup'
import Home from './Components/Home'
import Forgot from './Components/Forgot'
import ResetPass from './Components/ResetPass'
import Admin from './Components/Admin'
import SuperAdmin from './Components/SuperAdmin'
import ProtectedRoute from './ProtectedRoute'


const App = () => {
  return (

    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/forgot' element={<Forgot />}></Route>
          <Route path='/resetPass' element={<ResetPass />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/home' element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>



          }></Route>
          <Route path='/admin' element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>


          }></Route>
          <Route path='/superadmin' element={
            <ProtectedRoute>
              <SuperAdmin />
            </ProtectedRoute>


          }></Route>
        </Routes>
      </BrowserRouter>

    </>

  )
}

export default App
