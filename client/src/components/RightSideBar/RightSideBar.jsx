import { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css';
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'
import './RightSideBar.scss'
import { useAuth } from "../../hooks/useAuth"
import QuillCursors from 'quill-cursors'
Quill.register('modules/cursors', QuillCursors)

function RightSideBar({docId}) {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const providerRef = useRef(null);

    const {user} = useAuth();

    useEffect(() => {
        if (!docId) {
            console.log('[CLIENT] No docId provided');
            return;
        }

        if (editorRef.current && !quillRef.current) {
            console.log('[CLIENT-INIT] Starting initialization for docId:', docId);

            // Create Y.Doc
            const ydoc = new Y.Doc();
            console.log('[CLIENT-YDOC] Y.Doc created, guid:', ydoc.guid);

            // Create WebSocket Provider with resync interval (backup fix)
            const provider = new WebsocketProvider(
                import.meta.env.VITE_WS_URL, 
                docId, 
                ydoc,
                {
                    resyncInterval: 5000  // ✅ Resync every 5 seconds as backup
                }
            );
            providerRef.current = provider;

            // Monitor connection status
            provider.on('status', ({ status }) => {
                console.log('[CLIENT-WS-STATUS] Connection status:', status);
            });

            // Set up awareness
            const awareness = provider.awareness;
            awareness.setLocalStateField('user', {
                name: user,
                color: '#ffb61e'
            });

            // Get shared text type
            const ytext = ydoc.getText('quill');
            console.log('[CLIENT-YTEXT] Initial ytext length:', ytext.length);

            // Create Quill editor
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

            // Create binding
            const binding = new QuillBinding(ytext, quill, awareness);
            
            // Monitor sync events
            provider.on('sync', (isSynced) => {
                console.log('[CLIENT-SYNC] Synced:', isSynced);
                if (isSynced) {
                    console.log('[CLIENT-SYNC] Document state:', {
                        ytextLength: ytext.length,
                        quillLength: quill.getLength(),
                        docStateSize: Y.encodeStateAsUpdate(ydoc).length
                    });
                }
            });

            // Monitor document updates
            ydoc.on('update', (update, origin) => {
                console.log('[CLIENT-YDOC-UPDATE] Update received:', {
                    updateSize: update.length,
                    ytextLength: ytext.length,
                    docStateSize: Y.encodeStateAsUpdate(ydoc).length,
                    hasOrigin: !!origin
                });
            });

            console.log('[CLIENT-INIT] Initialization complete for docId:', docId);
        }

        return () => {
            console.log('[CLIENT-CLEANUP] Cleaning up for docId:', docId);
            
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
    );
}

export default RightSideBar;
