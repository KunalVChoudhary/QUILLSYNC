import FeatureIllustration, { type FeatureIllustrationVariant } from './FeatureIllustration';
import styles from './FeatureStory.module.scss';

interface FeatureStoryProps {
    eyebrow: string;
    title: string;
    description: string;
    details: string[];
    illustration: FeatureIllustrationVariant;
    reversed?: boolean;
}

function FeatureStory({
    eyebrow,
    title,
    description,
    details,
    illustration,
    reversed = false,
}: FeatureStoryProps) {
    return (
        <article className={`${styles.story} ${reversed ? styles.reversed : ''}`}>
            <div className={styles.copy}>
                <p className={styles.eyebrow}>{eyebrow}</p>
                <h3>{title}</h3>
                <p className={styles.description}>{description}</p>
                <ul className={styles.details}>
                    {details.map((detail) => (
                        <li key={detail}>{detail}</li>
                    ))}
                </ul>
            </div>
            <FeatureIllustration variant={illustration} />
        </article>
    );
}

export default FeatureStory;
