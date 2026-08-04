import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import HeroProductPreview from './HeroProductPreview';
import styles from './HeroSection.module.scss';

const collaborationHighlights = [
    'Real-time editing',
    'Live collaborator presence',
    'Always synchronized',
];

function HeroSection() {
    const { user } = useAuth();
    const primaryAction = user
        ? { label: 'Open your dashboard', to: '/dashboard' }
        : { label: 'Start collaborating free', to: '/register' };

    return (
        <section id="top" className={styles.hero} aria-labelledby="hero-heading">
            <div className={styles.content}>
                <div className={styles.copy}>
                    <p className={styles.eyebrow}>A calmer way to write together</p>
                    <h1 id="hero-heading">Every draft moves forward, together.</h1>
                    <p className={styles.description}>
                        QuillSync gives your team one shared space to write, edit, and stay aligned as ideas take shape.
                    </p>

                    <div className={styles.ctaGroup}>
                        <Link className={styles.primaryAction} to={primaryAction.to}>
                            {primaryAction.label}
                            <span aria-hidden="true">↗</span>
                        </Link>
                        <a className={styles.secondaryAction} href="#product-preview">
                            See the workspace
                            <span aria-hidden="true">↓</span>
                        </a>
                    </div>

                    <ul className={styles.highlights} aria-label="QuillSync highlights">
                        {collaborationHighlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                        ))}
                    </ul>
                </div>

                <HeroProductPreview />
            </div>
        </section>
    );
}

export default HeroSection;
