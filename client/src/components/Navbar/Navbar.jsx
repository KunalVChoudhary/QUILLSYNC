import {useState} from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Navbar.module.scss'
import { useAuth } from '../../hooks/useAuth'
import useUserLogout from '../../hooks/useUserLogout'

function Navbar(){

    const navigate = useNavigate()
    const {user} = useAuth()
    console.log(user);
    const userimage = false
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(segment => segment);

    const {logout} = useUserLogout()


    return(
        <>
            <div className={`${styles["common-navbar"]} fixed-top d-flex  w-100 justify-content-between text-white`}>

                <div className={`${styles["container-1"]} d-flex h-100 w-30 px-3`}>
                    <div className={`${styles["app-logo-container"]} d-flex align-items-center`} onClick={()=>{navigate('/')}}>
                        <img className={`h-100 d-block px-2 py-1`} src="./assets/app_icon.png" alt="Logo"/>
                        <p className={`${styles["app-name"]} px-1 fs-1 m-0`} >QuillSync</p>
                    </div>                    
                </div>

                <div className={`${styles['container-2']} d-flex justify-content-between w-70 gap-2 h-100 px-3`}>
                    <div className={`d-flex h-100 align-items-center px-3 fs-4 ${(pathSegments[0] === undefined) && styles['navItemSelected']}`} onClick={()=>{navigate('/')}}> Home </div>
                    <div className={`d-flex h-100 align-items-center px-3 fs-4 ${(pathSegments[0]==='dashboard') && styles['navItemSelected']}`} onClick={()=>{navigate('/dashboard')}}> Dashboard </div>
                    {
                        user?
                        (
                            <div className={`${styles['profile-container']} d-flex flex-column h-100 align-items-center fs-4`}>
                                <div className={`d-flex align-items-center gap-2 h-100 px-3`}>
                                    <img className={` d-block h-75`} src={userimage? "profileImage" : "./assets/avatar_icon.png"} alt="avtar" />
                                    <div>{user.length<=5? user : user.slice(0,5).concat('')}</div>
                                </div>
                                <div className={`${styles['dropdown-list']} flex-column h-auto w-100 border border-1 rounded fs-5`}>
                                    <div className={`d-flex justify-content-end align-items-center pe-3 ps-4 py-2 ${(pathSegments[0]==='profile') && styles['navItemSelected']}`} onClick={()=>{navigate('/profile')}}>Profile</div>
                                    <hr className='m-0'/>
                                    <div className={`d-flex justify-content-end align-items-center pe-3 ps-4 py-2`} onClick={logout}>Log Out</div>
                                </div>
                            </div>
                        )
                        :
                        (
                            <div className={`d-flex h-100 align-items-center px-3 fs-4`} onClick={()=>{navigate('/register')}}>
                                Sign Up
                            </div>
                        )
                    }
                </div>

            </div>
        </>
    )
};

export default Navbar;