import { useState } from 'react'
import './App.css'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
//import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <>
      <Routes>
        <Route path='/register' element={
          <div>
            <ToastContainer position="top-right" />
            <RegisterPage purpose='Sign Up' />
          </div>
        } />

        <Route path='/login' element={
          <div>
            <ToastContainer position="top-right" />
            <RegisterPage purpose='Sign In' />
          </div>
        } />

      </Routes>
    </>
  )
}

export default App
