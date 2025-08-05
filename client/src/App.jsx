import { useState } from 'react'
import './App.css'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
//import 'react-toastify/dist/ReactToastify.css';


function App() {
 function createParticle() {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      const size = Math.random() * 6 + 4; // 4px to 10px
      const duration = Math.random() * 4 + 3; // 3s to 7s

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.bottom = "0";
      particle.style.animationDuration = `${duration}s`;

      document.body.appendChild(particle);

      // Remove particle after animation ends
      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    }

    // Adjust spawn rate based on screen size
    const spawnRate = window.innerWidth < 500 ? 300 : 150;

    setInterval(createParticle, spawnRate);
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
