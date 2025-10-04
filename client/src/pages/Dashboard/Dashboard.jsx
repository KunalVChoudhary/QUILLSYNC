import styles from './Dashboard.module.scss'
import LeftSideBar from '../../components/LeftSideBar/LeftSideBar'
import Navbar from '../../components/Navbar/Navbar'
import RightSideBar from '../../components/RightSideBar/RightSideBar'
import { useSearchParams } from 'react-router-dom'

function Dashboard() {

  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      <Navbar />
      <div className={` ${styles['container']} row`}>
          <LeftSideBar />
          <RightSideBar docId={searchParams.has('docId') ? searchParams.get('docId') : false} />
      </div>
    </>
  )
}

export default Dashboard