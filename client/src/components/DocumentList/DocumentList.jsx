import { useEffect, useState } from 'react'
import styles from './DocumentList.module.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useGetUserDocs from '../../hooks/useGetUserDocs'
import useDeleteDoc from '../../hooks/useDeleteDoc'
import { useAuth } from '../../hooks/useAuth'

function DocumentList() {

    const {reloader} = useAuth()
    const {ownedDocuments, collaboratorDocuments, fetchError, loading, getUserDocs} = useGetUserDocs()
    const {deleteDocument} = useDeleteDoc()
    const [dropdownStateOwnedDocuments, setDropdownStateOwnedDocuments] = useState(false)
    const [dropdownStateCollaboratorDocuments, setDropdownStateCollaboratorDocuments] = useState(false)

    const navigate = useNavigate()

    const [searchParams, setSearchParams] = useSearchParams()

    const handleDocumentClick = (docId)=>{
        setSearchParams({docId})
    }

    useEffect(()=>{
        //fetch documents from the server
        getUserDocs()
    },[reloader])
    if (loading){
        return (
            <div className={`${styles['scroll-box']} flex-grow-1 overflow-y-scroll`}>
                <div className='d-flex justify-content-center align-items-center h-100 w-100'>
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        )
    } else if (fetchError){
        return (
            <div className={`${styles['scroll-box']} flex-grow-1 overflow-y-scroll text-white`}>
                <div className='d-flex flex-column gap-0 justify-content-center align-items-center h-100 w-100'>
                    <p className='m-0 p-1'>{fetchError}</p>
                    <p className='m-0 p-1'>Please Reload the page</p>
                </div>
            </div>
        )
    } else if (ownedDocuments.length == 0  && collaboratorDocuments.length == 0){
        return (
            <div className={`${styles['scroll-box']} flex-grow-1 overflow-y-scroll text-white`}>
                <div className='d-flex flex-column gap-0 justify-content-center align-items-center h-100 w-100'>
                    <p className='m-0 p-1'>Create a new Document</p>
                </div>
            </div>
        )
    }
    return (
        <div className={`${styles['scroll-box']} flex-grow-1 overflow-y-scroll text-white`}>

            {/* dono array pe map loop chalao */}
            <div className={`${styles['doc-container']} d-flex justify-content-between px-2 my-2`}>
                <div className='text-truncate h6'>
                    Owned Documents
                </div>
                <div onClick={()=> setDropdownStateOwnedDocuments(prev=>!prev)}>
                    {
                        (dropdownStateOwnedDocuments)
                        ? <img src="./assets/arrow-up-32.png" alt="up" />
                        : <img src="./assets/arrow-down-32.png" alt="down" />
                    }
                </div>
            </div>
            <div className={`${dropdownStateOwnedDocuments && 'd-none'}`}>
                {ownedDocuments.map((document,index)=>{
                    return (
                        <div key={index} className={` ${styles['doc-container']} d-flex justify-content-between px-2`} onClick={() => handleDocumentClick(document[0])}>
                            <div className='text-truncate h-100'>
                                {index+1}• {document[1]}
                            </div>
                            <div className={`${styles['more-container']} d-flex flex-column align-items-end h-100 w-auto`}>
                                <div className='h-100'><img className={`${styles['dot-img']}`} src="./assets/dot-32.png" alt="more" /></div>
                                <div className='d-none border border-2 border-white rounded px-2 py-1 bg-black w-100'>    
                                    <div className='p-1' onClick={()=>{navigate(`/user/doc/edit/${document[0]}`)}}>Edit</div>
                                    <hr className='m-0' />
                                    <div className='p-1' onClick={()=>deleteDocument(document[0])}>Delete</div>
                                </div>
                            </div>
                            {/* Delete the doc */}
                        </div>
                    )
                })}
            </div>

            {/* owned doc array loop */}

            <div className={`${styles['doc-container']} d-flex justify-content-between px-2 my-2`}>
                <div className='text-truncate h6'>
                    Collaborated Documents
                </div>
                <div className='h-100' onClick={()=> setDropdownStateCollaboratorDocuments(prev=> !prev)}>
                    {
                        (dropdownStateCollaboratorDocuments)
                        ? <img src="./assets/arrow-up-32.png" alt="up" />
                        : <img src="./assets/arrow-down-32.png" alt="down" />
                    }
                </div>
            </div>

            <div className={`${dropdownStateCollaboratorDocuments && 'd-none'}`}>
                {collaboratorDocuments.map((document,index)=>{
                    return (
                        <div key={index} className={` ${styles['doc-container']} d-flex justify-content-between px-2`} onClick={() => handleDocumentClick(document[0])}>
                            <div className='text-truncate h-100'>
                                {index+1}• {document[1]}
                            </div>
                            <div className={`${styles['more-container']} d-flex flex-column align-items-end h-100`}>
                                <div className='h-100'><img className={`${styles['dot-img']}`} src="./assets/dot-32.png" alt="more" /></div>
                                <div className='d-none border border-2 border-white rounded px-2 py-1 bg-black bg-gradient'>{document[2]}</div>
                            </div>
                        </div>
                    )
                })}
            </div>


        </div>
    )
}

export default DocumentList