import styles from './FeatureIllustration.module.scss';

export type FeatureIllustrationVariant = 'presence' | 'sharing' | 'sync' | 'summary' | 'history';

interface FeatureIllustrationProps {
    variant: FeatureIllustrationVariant;
}

const variantClassNames: Record<FeatureIllustrationVariant, string> = {
    presence: styles.presence,
    sharing: styles.sharing,
    sync: styles.sync,
    summary: styles.summary,
    history: styles.history,
};

function PresenceIllustration() {
    return (
        <>
            <div className={styles.illustrationTopBar}>
                <span className={styles.fileMark}>✦</span>
                <span>Project brief</span>
                <div className={styles.avatarStack}>
                    <span className={styles.avatarBlue}>Y</span>
                    <span className={styles.avatarMint}>1</span>
                    <span className={styles.avatarPink}>2</span>
                </div>
            </div>
            <div className={styles.documentPreview}>
                <span className={styles.smallLabel}>WORKING DRAFT</span>
                <span className={styles.documentHeading}>Ideas for the next release</span>
                <span className={`${styles.textLine} ${styles.longLine}`} />
                <span className={`${styles.textLine} ${styles.mediumLine} ${styles.highlightMint}`} />
                <span className={`${styles.textLine} ${styles.shortLine}`} />
                <span className={`${styles.liveCursor} ${styles.mintCursor}`}>
                    <span>Collaborator 1</span>
                </span>
                <span className={`${styles.liveCursor} ${styles.pinkCursor}`}>
                    <span>Collaborator 2</span>
                </span>
            </div>
        </>
    );
}

function SharingIllustration() {
    return (
        <>
            <div className={styles.shareSheet}>
                <div className={styles.shareHeading}>
                    <span>Share document</span>
                    <span className={styles.closeMark}>×</span>
                </div>
                <div className={styles.shareInput}>
                    <span>Invite by email</span>
                    <span>+</span>
                </div>
                <div className={styles.sharedPeople}>
                    <div>
                        <span className={styles.avatarBlue}>Y</span>
                        <span>You <small>Owner</small></span>
                    </div>
                    <div>
                        <span className={styles.avatarMint}>1</span>
                        <span>Collaborator 1 <small>Can edit</small></span>
                    </div>
                    <div>
                        <span className={styles.avatarPink}>2</span>
                        <span>Collaborator 2 <small>Can edit</small></span>
                    </div>
                </div>
            </div>
            <div className={styles.shareBackdrop} />
        </>
    );
}

function SyncIllustration() {
    return (
        <>
            <div className={styles.syncPath} aria-hidden="true">
                <span />
                <span />
                <span />
            </div>
            <div className={styles.syncDocument}>
                <span className={styles.syncDocumentMark}>✦</span>
                <span>Shared draft</span>
                <small>Up to date</small>
            </div>
            <div className={`${styles.syncNode} ${styles.syncNodeLeft}`}>
                <span className={styles.avatarMint}>1</span>
                <small>Editing</small>
            </div>
            <div className={`${styles.syncNode} ${styles.syncNodeRight}`}>
                <span className={styles.avatarPink}>2</span>
                <small>Synced</small>
            </div>
            <div className={`${styles.syncNode} ${styles.syncNodeBottom}`}>
                <span className={styles.avatarBlue}>Y</span>
                <small>Your draft</small>
            </div>
        </>
    );
}

function SummaryIllustration() {
    return (
        <>
            <div className={styles.sourceDocument}>
                <span className={styles.smallLabel}>PROJECT NOTES</span>
                <span className={styles.documentHeading}>Launch plan</span>
                <span className={`${styles.textLine} ${styles.longLine}`} />
                <span className={`${styles.textLine} ${styles.mediumLine}`} />
                <span className={`${styles.textLine} ${styles.longLine}`} />
            </div>
            <div className={styles.summarySheet}>
                <div className={styles.summarySheetHeading}>
                    <span>✦</span>
                    AI summary
                </div>
                <p>The team is aligning on a focused release plan with shared owners and clear next steps.</p>
                <div className={styles.summaryPoint}>
                    <span />
                    Priorities captured
                </div>
                <div className={styles.summaryPoint}>
                    <span />
                    Next steps visible
                </div>
            </div>
        </>
    );
}

function HistoryIllustration() {
    return (
        <>
            <div className={styles.historySheet}>
                <div className={styles.historyHeading}>
                    <span>Document history</span>
                    <span className={styles.historyClock}>◷</span>
                </div>
                <div className={styles.historyItem}>
                    <span className={styles.historyDot} />
                    <div>
                        <strong>Current draft</strong>
                        <small>Latest shared state</small>
                    </div>
                </div>
                <div className={styles.historyItem}>
                    <span className={`${styles.historyDot} ${styles.historyDotMuted}`} />
                    <div>
                        <strong>Earlier draft</strong>
                        <small>Writing context retained</small>
                    </div>
                </div>
                <div className={styles.historyItem}>
                    <span className={`${styles.historyDot} ${styles.historyDotMuted}`} />
                    <div>
                        <strong>First outline</strong>
                        <small>Where the work began</small>
                    </div>
                </div>
            </div>
            <div className={styles.historyDocument}>
                <span className={styles.smallLabel}>CURRENT DOCUMENT</span>
                <span className={styles.documentHeading}>Launch plan</span>
                <span className={`${styles.textLine} ${styles.longLine}`} />
                <span className={`${styles.textLine} ${styles.shortLine}`} />
            </div>
        </>
    );
}

function FeatureIllustration({ variant }: FeatureIllustrationProps) {
    let content: React.ReactNode;

    switch (variant) {
        case 'presence':
            content = <PresenceIllustration />;
            break;
        case 'sharing':
            content = <SharingIllustration />;
            break;
        case 'sync':
            content = <SyncIllustration />;
            break;
        case 'summary':
            content = <SummaryIllustration />;
            break;
        case 'history':
            content = <HistoryIllustration />;
            break;
    }

    return (
        <div className={`${styles.illustration} ${variantClassNames[variant]}`} aria-hidden="true">
            {content}
        </div>
    );
}

export default FeatureIllustration;
