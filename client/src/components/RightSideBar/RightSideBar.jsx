import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'; // Optional: import Quill theme CSS
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'
import './RightSideBar.scss'
import { useAuth } from "../../hooks/useAuth"
import QuillCursors from 'quill-cursors'
Quill.register('modules/cursors', QuillCursors)


function RightSideBar({docId}) {

    const editorRef = useRef(null);  // 1. Create a ref for the editor container
    const quillRef = useRef(null);
    const providerRef = useRef(null)

    const {user} = useAuth()

    // useEffect(() => {
    //     if (editorRef.current && !quillRef.current) {
    //             quillRef.current = new Quill(editorRef.current, {
    //                 theme: 'snow',
    //                 placeholder: 'Start typing...',
    //                 modules: {
    //                 toolbar: [
    //                     [{ header: [1, 2, false] }],
    //                     ['bold', 'italic', 'underline'],
    //                     ['image', 'code-block']
    //                 ],
    //                 history: {
    //                     // Local undo shouldn't undo changes
    //                     // from remote users
    //                     userOnly: true
    //                     },
    //                 },
    //             });
                        
    //             // A Yjs document holds the shared data
    //             const ydoc = new Y.Doc()
    //             // Define a shared text type on the document
    //             const ytext = ydoc.getText('quill')

    //             // Create an editor-binding which
    //             // "binds" the quill editor to a Y.Text type.
    //             const binding = new QuillBinding(ytext, quillRef.current)

    //             const provider = new WebsocketProvider(import.meta.env.VITE_WS_URL, docId, ydoc)
    //     }
    // }, [docId]);

    useEffect(() => {
        if (!docId) {
            return
        }

        if (editorRef.current && !quillRef.current) {
            const ydoc = new Y.Doc()
            const provider = new WebsocketProvider(import.meta.env.VITE_WS_URL, docId, ydoc)
            providerRef.current = provider
            // All of our network providers implement the awareness crdt
            const awareness = provider.awareness

            // You can think of your own awareness information as a key-value store.
            // We update our "user" field to propagate relevant user information.
            awareness.setLocalStateField('user', {
                // Define a print name that should be displayed
                name: user,
                // Define a color that should be associated to the user:
                color: '#ffb61e' // should be a hex color
            })

            const ytext = ydoc.getText('quill')

            quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: 'Start typing...',
            modules: {
                toolbar: true,
                history: { userOnly: true },
                cursors: true
            },
            })

            const binding = new QuillBinding(ytext, quillRef.current, awareness)
        }

        return () => {
            // component unmount / docId change
            if (editorRef.current) {
            editorRef.current.innerHTML = ''
            }
            const toolbar = document.querySelector('.ql-toolbar')
            if (toolbar && toolbar.parentNode) {
            toolbar.parentNode.removeChild(toolbar)
            }
            if (providerRef.current) {
            providerRef.current.destroy()
            providerRef.current = null
            }
            quillRef.current = null
        }
    }, [docId])

    return (
        <div className='right-sidebar h-100 col-9'>
            {
            docId 
            ? (
                <div className={`h-100 d-flex flex-column text-white`}>
                    <div className={`editor-container h-100 flex-grow-1`} ref={editorRef}>
                            {/* Quill editor will be initialized here */}
                    </div>
                </div>
            )
            : (
                <div className='h-100 d-flex justify-content-center align-items-center text-white'>
                    <img className='h-75' src='./assets/app_logo.png' alt="logo" />
                </div>
            )
            }

        </div>
    )
}

export default RightSideBar