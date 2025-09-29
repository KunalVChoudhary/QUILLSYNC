import {} from 'react'
import DocumentList from '../DocumentList/DocumentList'
import CreateNewDocument from '../CreateNewDocument/CreateNewDocument'

function LeftSideBar() {



  return (
    <div className='col-3 d-flex flex-column h-100'>
        <CreateNewDocument/>
        <DocumentList />
    </div>
  )
}

export default LeftSideBar