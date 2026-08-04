import LandingHeader from '../../components/LandingHeader/LandingHeader';
import FeatureSection from '../../components/LandingPage/FeatureSection';
import HeroSection from '../../components/LandingPage/HeroSection';
import HowItWorks from '../../components/LandingPage/HowItWorks';
import styles from './HomePage.module.scss';

function HomePage() {
    return (
        <main className={styles.landingPage}>
            <LandingHeader />
            <HeroSection />
            <FeatureSection />
            <HowItWorks />
        </main>
    );
}

export default HomePage;
