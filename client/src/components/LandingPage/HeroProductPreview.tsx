import styles from './HeroProductPreview.module.scss';

function HeroProductPreview() {
    return (
        <section id="product-preview" className={styles.preview} aria-label="QuillSync collaborative editor preview">
            <div className={styles.previewBar}>
                <div className={styles.windowControls} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </div>
                <div className={styles.documentName}>
                    <span className={styles.documentIcon} aria-hidden="true">✦</span>
                    Project brief
                </div>
                <span className={styles.syncStatus}>
                    <span aria-hidden="true" />
                    Synced
                </span>
            </div>

            <div className={styles.workspace}>
                <article className={styles.editor} aria-label="Document editor preview">
                    <div className={styles.editorToolbar} aria-hidden="true">
                        <span className={styles.toolbarStrong}>B</span>
                        <span className={styles.toolbarItalic}>I</span>
                        <span>☰</span>
                        <span>↗</span>
                    </div>
                    <div className={styles.documentBody}>
                        <p className={styles.documentLabel}>Team document</p>
                        <h2>Launch plan</h2>
                        <p className={styles.introCopy}>
                            A shared outline for shaping the next release together.
                        </p>
                        <div className={styles.rule} />
                        <p className={styles.bodyCopy}>
                            We’ll bring the project story, goals, and launch notes into one place so everyone can contribute in context.
                            <span className={`${styles.cursor} ${styles.cursorMint}`} aria-hidden="true">
                                <span>Collaborator 1</span>
                            </span>
                        </p>
                        <p className={styles.bodyCopy}>
                            Keep decisions visible, add the next step, and let the draft stay current for the whole team.
                            <span className={`${styles.cursor} ${styles.cursorPink}`} aria-hidden="true">
                                <span>Collaborator 2</span>
                            </span>
                        </p>
                    </div>
                </article>

                <aside className={styles.activityPanel} aria-label="Collaboration activity preview">
                    <div className={styles.presenceHeader}>
                        <p>In this document</p>
                        <span>3</span>
                    </div>
                    <div className={styles.people}>
                        <div className={styles.person}>
                            <span className={`${styles.avatar} ${styles.avatarInk}`}>Y</span>
                            <span>You</span>
                        </div>
                        <div className={styles.person}>
                            <span className={`${styles.avatar} ${styles.avatarMint}`}>1</span>
                            <span>Collaborator 1</span>
                        </div>
                        <div className={styles.person}>
                            <span className={`${styles.avatar} ${styles.avatarPink}`}>2</span>
                            <span>Collaborator 2</span>
                        </div>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryTitle}>
                            <span aria-hidden="true">✦</span>
                            AI summary
                        </div>
                        <p>Capture the key decisions from the draft when you need a quick recap.</p>
                    </div>
                </aside>
            </div>
        </section>
    );
}

export default HeroProductPreview;
