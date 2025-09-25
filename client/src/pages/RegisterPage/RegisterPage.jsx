import React from 'react'
import styles from './RegisterPage.module.scss'
import LoginForm from '../../components/LoginForm/LoginForm'
import { ToastContainer } from 'react-toastify'

function RegisterPage({purpose}) {
  return (
    <>
      <div>
        <ToastContainer position="top-right" />
        <div className={`${styles['login-form-container']} d-flex align-items-center justify-content-center`}>
          <LoginForm purpose={purpose} />
        </div>
      </div>
    </>
  )
}

export default RegisterPage