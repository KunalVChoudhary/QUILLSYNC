import styles from './HowItWorks.module.scss';

type StepVisual = 'document' | 'collaborators' | 'editing';

interface WorkflowStep {
    number: string;
    title: string;
    description: string;
    visual: StepVisual;
}

const workflowSteps: WorkflowStep[] = [
    {
        number: '01',
        title: 'Start a document',
        description: 'Create a shared draft and give the work a clear place to begin.',
        visual: 'document',
    },
    {
        number: '02',
        title: 'Bring in collaborators',
        description: 'Add the people who should shape the document alongside you.',
        visual: 'collaborators',
    },
    {
        number: '03',
        title: 'Keep the draft moving',
        description: 'Write together in real time while the document stays synchronized.',
        visual: 'editing',
    },
];

function StepVisual({ visual }: { visual: StepVisual }) {
    if (visual === 'document') {
        return (
            <span className={`${styles.stepVisual} ${styles.documentVisual}`} aria-hidden="true">
                <span className={styles.pageFold} />
                <span />
                <span />
                <span />
            </span>
        );
    }

    if (visual === 'collaborators') {
        return (
            <span className={`${styles.stepVisual} ${styles.collaboratorVisual}`} aria-hidden="true">
                <span>Y</span>
                <span>1</span>
                <span>2</span>
            </span>
        );
    }

    return (
        <span className={`${styles.stepVisual} ${styles.editingVisual}`} aria-hidden="true">
            <span />
            <span />
            <span />
        </span>
    );
}

function HowItWorks() {
    return (
        <section id="how-it-works" className={styles.section} aria-labelledby="how-it-works-heading">
            <div className={styles.inner}>
                <div className={styles.intro}>
                    <p className={styles.eyebrow}>A simple shared workflow</p>
                    <h2 id="how-it-works-heading">From first thought to shared draft.</h2>
                    <p>QuillSync keeps the path from starting a document to working in it with your team refreshingly direct.</p>
                </div>

                <ol className={styles.steps}>
                    {workflowSteps.map((step) => (
                        <li key={step.number} className={styles.step}>
                            <div className={styles.stepHeader}>
                                <span className={styles.number}>{step.number}</span>
                                <StepVisual visual={step.visual} />
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
}

export default HowItWorks;
