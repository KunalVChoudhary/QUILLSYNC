import { useEffect, useState } from 'react'
import styles from './DocumentList.module.scss'
import { useNavigate } from 'react-router-dom'

function DocumentList() {

    const [ownedDocumentsArray, setOwnedDocumentsArray] = useState([['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef']])
    const [collaboratorDocumentsArray, setCollaboratorDocumentsArray] = useState([['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef'],['asfdvrv','cawerfhbchbwkrevbeui wneocinono','fwef']])

    const [dropdownStateOwnedDocuments, setDropdownStateOwnedDocuments] = useState(false)
    const [dropdownStateCollaboratorDocuments, setDropdownStateCollaboratorDocuments] = useState(false)

    const navigate = useNavigate()

    const handleDocumentClick = (docId)=>{
        return
    }

    useEffect(()=>{
        //fetch documents from the server
    },[])
    
    return (
        <div className={`${styles['scroll-box']} overflow-y-scroll text-white`}>

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
                {ownedDocumentsArray.map((document,index)=>{
                    return (
                        <div key={index} className={` ${styles['doc-container']} d-flex justify-content-between px-2`} onClick={handleDocumentClick}>
                            <div className='text-truncate h-100'>
                                {index+1}• {document[1]}
                            </div>
                            <div className={`${styles['more-container']} d-flex flex-column align-items-end h-100`}>
                                <div className='h-100'><img className={`${styles['dot-img']}`} src="./assets/dot-32.png" alt="more" /></div>
                                <div className='d-none border border-2 border-white rounded px-2 py-1 bg-black bg-gradient' onClick={()=>{navigate(`/user/doc/edit/${document[0]}`)}}>Edit</div>
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
                {collaboratorDocumentsArray.map((document,index)=>{
                    return (
                        <div key={index} className={` ${styles['doc-container']} d-flex justify-content-between px-2`} onClick={handleDocumentClick}>
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