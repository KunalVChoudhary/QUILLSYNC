import {} from 'react'
import styles from './Dashboard.module.scss'

import React from 'react'
import LeftSideBar from '../../components/LeftSideBar/LeftSideBar'
import Navbar from '../../components/Navbar/Navbar'
import RightSideBar from '../../components/RightSideBar/RightSideBar'

function Dashboard() {

  const searchParms = useSearchParams()
  if (!searchParms.docId){}

  return (
    <>
      <Navbar />
      <div className={` ${styles['container']} row`}>
          <LeftSideBar />
          <RightSideBar docId={searchParms.docId} />
      </div>
    </>
  )
}

export default Dashboard