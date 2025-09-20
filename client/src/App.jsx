import { useEffect, useRef, useState } from 'react'
import './App.css'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import { Route, Routes } from 'react-router-dom'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'; // Optional: import Quill theme CSS
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'
import HomePage from './pages/HomePage/HomePage'


function App() {
    function createParticle() {
        const particle = document.createElement("div");
        particle.classList.add("particle");

        const size = Math.random() * 6 + 4; // 4px to 10px
        const duration = Math.random() * 4 + 3; // 3s to 7s

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.bottom = "0";
        particle.style.animationDuration = `${duration}s`;

        document.body.appendChild(particle);

        // Remove particle after animation ends
        setTimeout(() => {
        particle.remove();
        }, duration * 1000);



    }

    // Adjust spawn rate based on screen size
    const spawnRate = window.innerWidth < 500 ? 300 : 150;

    setInterval(createParticle, spawnRate);

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
  'wss://demos.yjs.dev/ws', 'quill-demo-room', ydoc
)

```
yahe pe ydoc.getText('quill') 'quill' just ek name hai joh iss particular document ko represent karta hai iska quill editor/variable se koi lena dena nhi hai naam toh kuch bhi ho sakta hai
2 log same document ko edit kar paye uske liye const provider = new WebsocketProvider('wss://demos.yjs.dev/ws', 'quill-demo-room', ydoc) me dono users of same ydoccreate karna padega aur same room number bhi join karna hoga


```
        }
    }, []);
    return (
        <>
          <Routes>
            <Route path='/register' element = { <RegisterPage purpose='Sign Up' /> } />

            <Route path='/login' element = { <RegisterPage purpose='Sign In' /> } />

            <Route path='/' element = { <HomePage /> } />

            <Route path='/user' element={
              <div className="editor-container" ref={editorRef} style={{height: '100vh'}}>
                {/* Quill editor will be initialized here */}
              </div>
            } />

          </Routes>
        </>
    )
}

export default App
