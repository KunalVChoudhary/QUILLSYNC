import './App.css'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import Dashboard from './pages/Dashboard/Dashboard'
import { useAuth } from './hooks/useAuth'
import { useEffect } from 'react'


function App() {

    const {user,authLoading} = useAuth()

    
    useEffect(()=>{
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

        const interval = setInterval(createParticle, spawnRate);
        return () => clearInterval(interval);
    },[])


    if (authLoading){
      return (
      <>
        <div className="position-fixed top-50 start-50 translate-middle d-flex justify-content-center align-items-center gap-2">
            <div className="spinner-grow text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <div className="spinner-grow text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
        </div>
      </>)
    }
        
    return (
        <>
          <Routes>
            <Route path='/register' element = { !user ? <RegisterPage purpose='Sign Up' /> : <Navigate to={'/'} /> } />

            <Route path='/login' element = { !user ? <RegisterPage purpose='Sign In' /> : <Navigate to={'/'} /> } />

            <Route path='/' element = { <HomePage /> } />

            <Route path='/dashboard' element = { user ? <Dashboard/> : <Navigate to={'/'} /> } />

            <Route path='/user/doc/edit/:docId' element = {<></>} />

          </Routes>
        </>
    )
}

export default App
