import { useEffect, useRef, useState } from 'react'
import './App.css'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import { Route, Routes } from 'react-router-dom'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'; // Optional: import Quill theme CSS
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'
import HomePage from './pages/HomePage/HomePage'
import Dashboard from './pages/Dashboard/Dashboard'


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
            <Route path='/register' element = { <RegisterPage purpose='Sign Up' /> } />

            <Route path='/login' element = { <RegisterPage purpose='Sign In' /> } />

            <Route path='/' element = { <HomePage /> } />

            <Route path='/dashboard' element = { <Dashboard/> } />

            <Route path='/user/doc/edit/:docId' element = {<></>} />

          </Routes>
        </>
    )
}

export default App
