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
    <>
      <Form onSubmit={handleSubmission} className='mx-4 my-5 w-100'>
        <Form.Group className='d-flex row align-items-center m-0 mb-2'>
          <div className='col-3 fs-5 p-0'>
            Email : 
          </div>
          <div className='col-9 p-0'>
            <FloatingLabel controlId="email" label="Email address" className='ps-2'>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                name="email"
                value={LoginData.email}
                required
                onChange={handleChange} />
            </FloatingLabel>
          </div>
        </Form.Group>

        {(purpose ==='Sign Up') ?
        <Form.Group className='d-flex row align-items-center m-0 mb-2'>
          <div className='col-3 fs-5 p-0'>
              Username : 
          </div>
          <div className='col-9 p-0'>
            <FloatingLabel controlId="username" label="Username" className='ps-2'>
              <Form.Control
                type="text"
                placeholder="username"
                name="username"
                value={LoginData.username}
                required
                onChange={handleChange} />
            </FloatingLabel>
          </div>
        </Form.Group> : ''
        }

        <Form.Group className='d-flex row align-items-center m-0 mb-2'>
          <div className='col-3 fs-5 p-0'>
            Password : 
          </div>
          <div className='col-9 p-0'>
            <FloatingLabel controlId="password" label="Password" className='ps-2'>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={LoginData.password}
                required
                onChange={handleChange} />
            </FloatingLabel>
          </div>
        </Form.Group>
        
        <Form.Group className=" d-flex align-items-center justify-content-center">
          <div >
            <button type="submit" className='mt-2 px-3 btn btn-outline-primary text-white'>{purpose}</button>
          </div>
        </Form.Group>
      </Form>
    </>
  )
}


export default LoginForm