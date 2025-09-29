import { useState } from 'react'
import styles from './CreateNewDocument.module.scss'

function CreateNewDocument() {

    const [createDoc, setCreateDoc] = useState(false)
    const [title, setTitle] = useState('')
    const [collaborators, setCollaborators] = useState([])
    const [newCollaborator, setNewCollaborator] = useState('')

    const handleOnChangeTitle = (e)=>{
        setTitle(e.target.value.trim())
    }

    const handleOnChangeNewCollaborator = (e)=>{
        setNewCollaborator(e.target.value)
    }

    const handleOnKeyDownNewCollaborator = (e)=>{
        if (e.key == 'Enter'){
            e.preventDefault();
            if (!e.target.checkValidity()) return
            handleAddCollaborator(newCollaborator)
        }
    }

    const handleAddCollaborator = (value)=>{
        value = value.trim()
        if (!value) return;
        if (!collaborators.includes(value)) {
            setCollaborators(prev => [...prev, value]);
        }
        setNewCollaborator('')
    }

    const handleRemoveCollaborator = (val)=>{
        setCollaborators((prev)=>prev.filter((element)=> element!=val))
    }

    const handleSubmission = async (e)=>{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/documents`,{
            method:'POST',
            headers:{
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify({title,collaborators}),
            credentials: 'include'
        })
    }

    //issue: not getting scrollbar for form for very very small screen  (not improtant now)

    return (
        <>
            <div className='d-flex justify-content-between text-white px-2 mt-2 border border-white mb-2'>
                <div className='h5 m-0'> Documents </div>
                <div className='pe-3' data-bs-toggle="tooltip" data-bs-placement="bottom" title="New Document">
                    <i onClick={()=>setCreateDoc(true)} className="bi bi-file-earmark-richtext"></i>
                </div>
            </div>
            {
                createDoc
                ?(
                    <>
                    <div className={`${styles['overlayBackground']} row justify-content-center align-items-center
    border: 2px solid aliceb`}>
                        <div className={`${styles['create-form-container']} bg-black p-3 col-md-6 col-10`}>
                            <div className='d-flex justify-content-between text-white ms-md-4 align-items-start'>
                                <div className='text-truncate h5'>Create Document</div>
                                <div>
                                    <img onClick={()=>{setCreateDoc(false)}} src="./assets/cancel-26.png" alt="cancel" />
                                </div>
                            </div>
                            <form onSubmit={handleSubmission} className="mx-md-4 my-5 d-flex flex-column justify-content-center text-white">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input onChange={handleOnChangeTitle} value={title} required type="text" className="form-control" id="title" placeholder="Doc Title" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="owner" className="form-label">Owner</label>
                                    <input id='owner' className="form-control" type="text" value="self" aria-label="Disabled input example" disabled readOnly />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="collaborator" className="form-label">Collaborator</label>
                                    <input onChange={handleOnChangeNewCollaborator} value={newCollaborator} onKeyDown={handleOnKeyDownNewCollaborator} type="email" className="form-control" id="collaborator" placeholder="xyz@gmail.com" />
                                </div>
                                <div className='mb-3 d-flex flex-wrap gap-2'>
                                    {collaborators.map((element,index)=>{
                                        return (
                                            <div key={index} className='d-flex gap-1 text-black rounded-2 px-2 bg-secondary'>
                                                <p className='m-0 p-0 d-inline'>{element}</p>
                                                <img className='m-0 p-0 d-inline' onClick={()=> handleRemoveCollaborator(element)} src="./assets/cancel-26.png" alt="cross" />
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="d-flex justify-content-center mt-2 mb-2 ">
                                    <button type="submit" className="btn btn-outline-primary border-2 text-white px-4 pt-2">
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    </>
                )
                :('')
            }
        </>
    )
}

export default CreateNewDocument