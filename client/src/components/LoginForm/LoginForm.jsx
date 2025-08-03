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
            
        }
    }

  return (
    <>
      <Form onSubmit={handleSubmission}>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
            Email:
          </Form.Label>
          <Col sm={10}>
            <FloatingLabel controlId="email" label="Email address" className="mb-3">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                name="email"
                value={LoginData.email}
                required
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Form.Group>

        {(purpose ==='Sign Up') ?
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
            Username:
          </Form.Label>
          <Col sm={10}>
            <FloatingLabel controlId="username" label="Username" className="mb-3">
              <Form.Control
                type="text"
                placeholder="username"
                name="username"
                value={LoginData.username}
                required
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Form.Group>
        :''}

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
            Password:
          </Form.Label>
          <Col sm={10}>
            <FloatingLabel controlId="password" label="Password">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={LoginData.password}
                required
                onChange={handleChange}
              />
            </FloatingLabel>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit">{purpose}</Button>
          </Col>
        </Form.Group>
      </Form>
    </>
  )
}


export default LoginForm