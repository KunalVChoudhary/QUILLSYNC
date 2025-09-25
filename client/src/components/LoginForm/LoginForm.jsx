import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import {FloatingLabel, Form, Row, Col, Button} from 'react-bootstrap';

function LoginForm({purpose}){

    const [LoginData, setLoginData] = useState({
        email:'',
        username:'',
        password:''
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        setLoginData((prev)=> ({...prev, [e.target.name]:e.target.value}))
    }

    const handleSubmission = async (e) =>{
        e.preventDefault()
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/${(purpose === 'Sign Up')? 'register' : 'login'}`,{
                method : 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(LoginData),
                credentials: 'include'
            })

            if (response.ok){
                const data = await response.json()
                console.log(data)
                toast.success(data.message)
                setTimeout(()=> navigate('/home'),2000)
            } else if (response.status===400){
                const data = await response.json()
                console.log(data)
                toast.error(data.message)
                console.log(400);
            } else {
                console.log(response.status);
                const data = await response.json()
                toast.error(data.message)
                console.log(data)
            }

        } catch (error) {
            toast.error('Error! Try Again')
        }
    }

  return (
    <div className='row align-items-center '>

        <div className='col-md-6 d-none d-md-block'>
            <img className="h-100 w-100" src="./assets/app_logo.png" alt="logo" />
        </div>

        <div className='col-md-6 col-12'>
            <form onSubmit={handleSubmission} className="mx-md-4 my-5 d-flex flex-column justify-content-center">
                {/* Email */}
                <div className="d-flex row align-items-center m-0 mb-4">
                    <div className="col-12 p-0">
                        <div className="form-floating ps-2">
                            <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="name@example.com"
                            name="email"
                            value={LoginData.email}
                            required
                            onChange={handleChange}
                            />
                            <label htmlFor="email">Email address</label>
                        </div>
                    </div>
                </div>
                {/* Username (only if Sign Up) */}
                {purpose === 'Sign Up' && (
                    <div className="d-flex row align-items-center m-0 mb-4">
                        <div className="col-12 p-0">
                            <div className="form-floating ps-2">
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="username"
                                name="username"
                                value={LoginData.username}
                                required
                                onChange={handleChange}
                            />
                            <label htmlFor="username">Username</label>
                        </div>
                    </div>
                    </div>
                )}
                {/* Password */}
                <div className="d-flex row align-items-center m-0 mb-4">
                    <div className="col-12 p-0">
                        <div className="form-floating ps-2">
                            <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            name="password"
                            value={LoginData.password}
                            required
                            onChange={handleChange}
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                    </div>
                </div>
                {/* Submit Buttons */}
                <div className="d-flex justify-content-center mt-2 mb-4 ">
                    <button type="submit" className="btn btn-outline-primary border-2 text-white px-4 pt-2">
                    {purpose}
                    </button>
                </div>
                <div className="d-flex justify-content-center">
                    {purpose === 'Sign Up'
                    ? (<p>Create an account? <span className="text-primary text-decoration-underline" onClick={()=>{navigate('/login')}} role="button">Sign in</span></p>)
                    : (<p>Already have an Account? <span className="text-primary text-decoration-underline" onClick={()=>{navigate('/register')}} role="button">Sign up</span></p>)
                    }
                </div>
            </form>
        </div>

    </div>
  )
}


export default LoginForm