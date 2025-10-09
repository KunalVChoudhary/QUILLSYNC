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
    const ydocRef = useRef(null);

    const {user} = useAuth();

    useEffect(() => {
        if (!docId) {
            console.log('[CLIENT] No docId provided');
            return;
        }

        if (editorRef.current && !quillRef.current) {
            console.log('═══════════════════════════════════════════════');
            console.log('[CLIENT-INIT] Starting client initialization');
            console.log('[CLIENT-INIT] DocId:', docId);
            console.log('[CLIENT-INIT] WS URL:', import.meta.env.VITE_WS_URL);
            console.log('[CLIENT-INIT] User:', user);
            console.log('═══════════════════════════════════════════════');

            // Create Y.Doc
            const ydoc = new Y.Doc();
            ydocRef.current = ydoc;
            console.log('[CLIENT-YDOC] Y.Doc created, guid:', ydoc.guid);

            // Log initial state
            const initialState = Y.encodeStateAsUpdate(ydoc);
            console.log('[CLIENT-YDOC] Initial state size:', initialState.length, 'bytes');

            // Create WebSocket Provider
            const wsUrl = `${import.meta.env.VITE_WS_URL}/${docId}`;
            console.log('[CLIENT-WS] Connecting to:', wsUrl);
            
            const provider = new WebsocketProvider(
                import.meta.env.VITE_WS_URL, 
                docId, 
                ydoc,
                {
                    // Add connection options for debugging
                    connect: true,
                    // params: { /* auth if needed */ }
                }
            );
            providerRef.current = provider;

            // Monitor WebSocket connection status
            provider.on('status', ({ status }) => {
                console.log('[CLIENT-WS-STATUS] Connection status:', status);
                // status can be: 'disconnected' | 'connecting' | 'connected'
            });

            provider.on('connection-close', (event) => {
                console.error('[CLIENT-WS-CLOSE] Connection closed:', event);
            });

            provider.on('connection-error', (event) => {
                console.error('[CLIENT-WS-ERROR] Connection error:', event);
            });

            // Get awareness
            const awareness = provider.awareness;
            console.log('[CLIENT-AWARENESS] Setting local state for user:', user);

            awareness.setLocalStateField('user', {
                name: user,
                color: '#ffb61e'
            });

            // Log awareness changes
            awareness.on('change', () => {
                console.log('[CLIENT-AWARENESS] Awareness changed. States:', Array.from(awareness.getStates().keys()));
            });

            // Create shared text type
            console.log('[CLIENT-YTEXT] Getting shared text type: "quill"');
            const ytext = ydoc.getText('quill');
            console.log('[CLIENT-YTEXT] Initial ytext length:', ytext.length);
            console.log('[CLIENT-YTEXT] Initial ytext content:', ytext.toString());

            // Monitor Y.Doc updates
            ydoc.on('update', (update, origin) => {
                console.log('[CLIENT-YDOC-UPDATE] Y.Doc updated');
                console.log('[CLIENT-YDOC-UPDATE] Update size:', update.length, 'bytes');
                console.log('[CLIENT-YDOC-UPDATE] Origin:', origin);
                console.log('[CLIENT-YDOC-UPDATE] New state size:', Y.encodeStateAsUpdate(ydoc).length, 'bytes');
                console.log('[CLIENT-YDOC-UPDATE] ytext length:', ytext.length);
                console.log('[CLIENT-YDOC-UPDATE] ytext content preview:', ytext.toString().substring(0, 100));
            });

            // Create Quill editor
            console.log('[CLIENT-QUILL] Creating Quill editor');
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
            console.log('[CLIENT-QUILL] Quill editor created');

            // Log Quill content changes
            quill.on('text-change', (delta, oldDelta, source) => {
                console.log('[CLIENT-QUILL-CHANGE] Text changed, source:', source);
                console.log('[CLIENT-QUILL-CHANGE] Quill length:', quill.getLength());
                console.log('[CLIENT-QUILL-CHANGE] Quill text preview:', quill.getText().substring(0, 100));
            });

            // Create binding
            console.log('[CLIENT-BINDING] Creating QuillBinding');
            const binding = new QuillBinding(ytext, quill, awareness);
            console.log('[CLIENT-BINDING] QuillBinding created');

            // Critical: Monitor when sync is complete
            provider.on('sync', (isSynced) => {
                console.log('═══════════════════════════════════════════════');
                console.log('[CLIENT-SYNC] Sync event fired!');
                console.log('[CLIENT-SYNC] isSynced:', isSynced);
                console.log('[CLIENT-SYNC] Y.Doc state size:', Y.encodeStateAsUpdate(ydoc).length, 'bytes');
                console.log('[CLIENT-SYNC] Shared types:', Object.keys(ydoc.share));
                console.log('[CLIENT-SYNC] ytext length:', ytext.length);
                console.log('[CLIENT-SYNC] ytext content:', ytext.toString());
                console.log('[CLIENT-SYNC] Quill length:', quill.getLength());
                console.log('[CLIENT-SYNC] Quill text:', quill.getText());
                
                if (isSynced) {
                    // Give it a moment for binding to update Quill
                    setTimeout(() => {
                        console.log('[CLIENT-SYNC-DELAYED] After 100ms:');
                        console.log('[CLIENT-SYNC-DELAYED] ytext length:', ytext.length);
                        console.log('[CLIENT-SYNC-DELAYED] Quill length:', quill.getLength());
                        console.log('[CLIENT-SYNC-DELAYED] Quill text:', quill.getText());
                    }, 100);
                }
                console.log('═══════════════════════════════════════════════');
            });

            // Log WebSocket messages (if needed for deeper debugging)
            const originalSend = provider.ws?.send;
            if (provider.ws && originalSend) {
                provider.ws.send = function(...args) {
                    console.log('[CLIENT-WS-SEND] Sending message, size:', args[0]?.length || 'unknown');
                    return originalSend.apply(this, args);
                };
            }

            console.log('[CLIENT-INIT] Initialization complete, waiting for sync...');
        }

        return () => {
            console.log('[CLIENT-CLEANUP] Cleaning up for docId:', docId);
            
            // Cleanup
            if (editorRef.current) {
                editorRef.current.innerHTML = '';
            }
            
            const toolbar = document.querySelector('.ql-toolbar');
            if (toolbar && toolbar.parentNode) {
                toolbar.parentNode.removeChild(toolbar);
            }
            
            if (providerRef.current) {
                console.log('[CLIENT-CLEANUP] Destroying provider');
                providerRef.current.destroy();
                providerRef.current = null;
            }
            
            quillRef.current = null;
            ydocRef.current = null;
            
            console.log('[CLIENT-CLEANUP] Cleanup complete');
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
