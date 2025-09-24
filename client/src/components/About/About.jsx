import styles from './About.module.scss'

function About(){
    return(
        <>
            <div className="d-flex justify-content-center gap-2 pt-5 px-5 mt-5 row align-items-center w-100">
                <div className="h-100 py-5 col-5">
                    <img className="h-100 w-100" src="./assets/app_logo.png" alt="logo" />
                </div>
                <div className={`${styles['about-text-container']} h-100 px-5 py-5 text-white fs-4 col-md-6 d-flex flex-column border border-2 border-white rounded-5`}>
                    <p className="h1 text-center py-3 text-decoration-underline">About</p>
                    <p className="py-2">QuillSync is a real-time collaborative document editor designed to make teamwork effortless. It allows multiple users to work
                        on the same document simultaneously, with every change syncing instantly across all devices.
                    </p>
                    <p className="py-2">Built with Node.js, Express, MongoDB, and WebSockets, QuillSync ensures smooth performance, secure access, and conflict-free
                        editing. Users can create, edit, and share documents with collaborators in just a few clicks.
                    </p>
                    <p className="py-2">With upcoming AI-powered summarization, QuillSync will also help teams quickly generate smart summaries of their work, making
                        collaboration faster and more productive.
                    </p>
                    <div className="d-flex justify-content-center">
                        <a href="https://www.linkedin.com/in/kunal-vijayshree-choudhary/" target="_blank" class="btn btn-outline-light me-3">
                        <i class="bi bi-linkedin me-1"></i> LinkedIn
                        </a>

                        <a href="https://github.com/KunalVChoudhary" target="_blank" class="btn btn-outline-light">
                        <i class="bi bi-github me-1"></i> GitHub
                        </a>
                    </div>

                </div>
            </div>

        </>
    )
};

export default About;