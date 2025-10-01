import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'; // Optional: import Quill theme CSS
import 'quill/dist/quill.bubble.css'; // if using bubble
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'
import './RightSideBar.scss'
import { useSearchParams } from 'react-router-dom';

function RightSideBar({docId}) {

    if (!docId){
        return <></>
    }
    
    const editorRef = useRef(null);  // 1. Create a ref for the editor container
    const quillRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
                quillRef.current = new Quill(editorRef.current, {
                    theme: 'snow',
                    placeholder: 'Start typing...',
                    modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ['bold', 'italic', 'underline'],
                        ['image', 'code-block']
                    ],
                    history: {
                        // Local undo shouldn't undo changes
                        // from remote users
                        userOnly: true
                        },
                    },
                });
                        
                // A Yjs document holds the shared data
                const ydoc = new Y.Doc()
                // Define a shared text type on the document
                const ytext = ydoc.getText('quill')

                // Create an editor-binding which
                // "binds" the quill editor to a Y.Text type.
                const binding = new QuillBinding(ytext, quillRef.current)

                const provider = new WebsocketProvider(
        import.meta.VITE_WS_URL, docId, ydoc
        )
        }
    }, []);


    return (
        <div className={`right-sidebar h-100 col-9 d-flex flex-column text-white`}>
            <div className={`editor-container h-100 flex-grow-1`} ref={editorRef}>
                    {/* Quill editor will be initialized here */}
            </div>
        </div>
    )
}

export default RightSideBar