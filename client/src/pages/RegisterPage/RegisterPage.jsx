import React from 'react'
import styles from './RegisterPage.module.scss'
import LoginForm from '../../components/LoginForm/LoginForm'

function RegisterPage({purpose}) {
  return (
    <>
      <div className={`${styles['login-form-container']} d-flex align-items-center`}>
        <LoginForm purpose={purpose} />
      </div>
    </>
  )
}

export default RegisterPage