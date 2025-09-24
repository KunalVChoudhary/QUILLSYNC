import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={`${styles.footer} bg-dark text-light py-4 mt-5`}>
      <div className="container">
        <div className="row">
          <div className="col-md-3 py-2">
            <h5>QuillSync</h5>
            <p>Real-time collaborative document editing with AI-powered summaries.</p>
          </div>
          <div className="col-md-3 py-2">
            <h5>Site Map</h5>
            <ul className={styles.footerLinks}>
              <li><a href="/">Home</a></li>
              <li><a href="#">Features</a></li>
              <li><a href="#">Docs</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="col-md-3 py-2">
            <h5>Contact</h5>
            <ul className={styles.footerLinks}>
              <li>Email: support@quillsync.com</li>
              <li>Phone: +91 9999999999</li>
              <li>Mon-Fri: 9am-6pm</li>
            </ul>
          </div>
          <div className="col-md-3 py-2">
            <h5>Follow Us</h5>
            <div className={styles.footerSocial}>
              <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
              <a href="#" aria-label="Twitter"><i className="bi bi-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
        </div>
        <hr className="bg-light" />
        <div className="row">
          <div className="col text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} QuillSync. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
