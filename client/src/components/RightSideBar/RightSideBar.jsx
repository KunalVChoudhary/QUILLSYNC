import { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'
import './RightSideBar.scss'
import { useAuth } from "../../hooks/useAuth"
import QuillCursors from 'quill-cursors'
Quill.register('modules/cursors', QuillCursors)

function getRandomColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
        '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B195', '#C06C84',
        '#6C5B7B', '#355C7D', '#F67280', '#C06C84', '#F38181',
        '#AA96DA', '#FCBAD3', '#FFFFD2', '#A8D8EA', '#FFCFDF'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function RightSideBar({docId}) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const providerRef = useRef(null);
    
    // ✅ Simple loading state
    const [isLoading, setIsLoading] = useState(true);

    const {user} = useAuth();

    useEffect(() => {
        if (!docId) return;

        setIsLoading(true);

        if (editorRef.current && !quillRef.current) {
            const ydoc = new Y.Doc();
            
            const provider = new WebsocketProvider(
                import.meta.env.VITE_WS_URL, 
                docId, 
                ydoc,
                {
                    resyncInterval: 3000
                }
            );
            providerRef.current = provider;

            const awareness = provider.awareness;
            awareness.setLocalStateField('user', {
                name: user,
                color: getRandomColor()
            });

            const ytext = ydoc.getText('quill');

            const quill = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: 'Start typing...',
                modules: {
                    toolbar: true,
                    history: { userOnly: true },
                    cursors: true
                },
            });
            quillRef.current = quill;

            const binding = new QuillBinding(ytext, quill, awareness);

            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }

        return () => {
            if (editorRef.current) {
                editorRef.current.innerHTML = '';
            }
            
            const toolbar = document.querySelector('.ql-toolbar');
            if (toolbar && toolbar.parentNode) {
                toolbar.parentNode.removeChild(toolbar);
            }
            
            if (providerRef.current) {
                providerRef.current.destroy();
                providerRef.current = null;
            }
            
            quillRef.current = null;
        };
    }, [docId, user]);

    return (
        <div className='right-sidebar h-100 col-9'>
            {
                docId 
                ? (
                    <div className={`h-100 d-flex flex-column text-white position-relative`}>

                        {isLoading && (
                            <div className='position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center' style={{backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10}}>
                                <div className='d-flex justify-content-center align-items-center gap-2'>
                                    <div className="spinner-grow text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <div className="spinner-grow text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <div className="spinner-grow text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className='editor-container h-100 flex-grow-1' ref={editorRef} >
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
    );
}

export default RightSideBar;
