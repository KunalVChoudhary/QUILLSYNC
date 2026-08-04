import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './LandingHeader.module.scss';

function LandingHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();
    const primaryAction = user
        ? { label: 'Open dashboard', to: '/dashboard' }
        : { label: 'Start collaborating', to: '/register' };

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link className={styles.brand} to="/" onClick={closeMenu} aria-label="QuillSync home">
                    <span className={styles.brandMark} aria-hidden="true">
                        <img src="/assets/app_icon.png" alt="" />
                    </span>
                    <span>QuillSync</span>
                </Link>

                <button
                    className={styles.menuButton}
                    type="button"
                    aria-expanded={isMenuOpen}
                    aria-controls="landing-navigation"
                    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    <span />
                    <span />
                </button>

                <nav
                    id="landing-navigation"
                    className={`${styles.navigation} ${isMenuOpen ? styles.navigationOpen : ''}`}
                    aria-label="Landing page navigation"
                >
                    <div className={styles.links}>
                        <a href="#top" onClick={closeMenu}>Overview</a>
                        <a href="#product-preview" onClick={closeMenu}>Product</a>
                        <a href="#features" onClick={closeMenu}>Features</a>
                    </div>
                    <div className={styles.actions}>
                        {!user && (
                            <Link className={styles.loginLink} to="/login" onClick={closeMenu}>
                                Log in
                            </Link>
                        )}
                        <Link className={styles.primaryAction} to={primaryAction.to} onClick={closeMenu}>
                            {primaryAction.label}
                            <span aria-hidden="true">↗</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default LandingHeader;
