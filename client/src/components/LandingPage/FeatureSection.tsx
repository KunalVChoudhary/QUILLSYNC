import FeatureStory from './FeatureStory';
import styles from './FeatureSection.module.scss';

const featureStories = [
    {
        eyebrow: 'Live collaboration',
        title: 'Write in the same place, at the same time.',
        description: 'Changes appear as your collaborators make them, with live cursors that make it clear where the work is happening.',
        details: [
            'See who is active in the document',
            'Follow changes without passing files back and forth',
        ],
        illustration: 'presence' as const,
    },
    {
        eyebrow: 'Thoughtful sharing',
        title: 'Invite the right people to the work.',
        description: 'Create a document, add collaborators, and give your team a shared place to shape the draft together.',
        details: [
            'Add collaborators while creating a document',
            'Keep owned and shared documents organized in one dashboard',
        ],
        illustration: 'sharing' as const,
        reversed: true,
    },
    {
        eyebrow: 'Real-time synchronization',
        title: 'Keep every edit moving with the team.',
        description: 'QuillSync synchronizes active documents in real time, so everyone is working from the same current draft.',
        details: [
            'Edits flow between active collaborators as they happen',
            'Continue from the latest shared document state',
        ],
        illustration: 'sync' as const,
    },
    {
        eyebrow: 'AI summaries',
        title: 'Get to the point when the draft gets long.',
        description: 'Use AI summarization to turn a working document into a concise recap of its key ideas and decisions.',
        details: [
            'Create a short, focused summary from document content',
            'Help collaborators catch up on the shared context',
        ],
        illustration: 'summary' as const,
        reversed: true,
    },
    {
        eyebrow: 'Document history',
        title: 'Keep the thread of an evolving document.',
        description: 'Document history is kept alongside the draft so the work retains the context built over time.',
        details: [
            'Preserve the progression of a shared document',
            'Keep writing context connected to the current draft',
        ],
        illustration: 'history' as const,
    },
];

function FeatureSection() {
    return (
        <section id="features" className={styles.features} aria-labelledby="features-heading">
            <div className={styles.intro}>
                <p className={styles.eyebrow}>Built around the working draft</p>
                <h2 id="features-heading">Less switching context. More working in it.</h2>
                <p>
                    A focused workspace for the moments when a document needs more than a cursor and a comment thread.
                </p>
            </div>

            <div className={styles.stories}>
                {featureStories.map((story) => (
                    <FeatureStory key={story.illustration} {...story} />
                ))}
            </div>
        </section>
    );
}

export default FeatureSection;
