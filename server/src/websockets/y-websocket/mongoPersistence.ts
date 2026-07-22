import * as Y from 'yjs';
import Document from '../../models/document.js';

export async function loadDocFromMongo(docId: string): Promise<Y.Doc> {
    try {
        const record = await Document.findById(docId).lean().exec();
        const ydoc = new Y.Doc();

        if (record?.content) {
            Y.applyUpdate(ydoc, record.content.value());
        }

        return ydoc;
    } catch (error) {
        console.error(
            `[LOAD] Error loading document ${docId}:`,
            error instanceof Error ? error.message : "Unknown error"
        );

        return new Y.Doc();
    }
}

export async function saveDocToMongo(docId: string, ydoc: Y.Doc): Promise<void> {
  try {
    const update = Y.encodeStateAsUpdate(ydoc);
    const buffer = Buffer.from(update);
    
    await Document.findByIdAndUpdate(
      docId,
      { content: buffer, lastEdited: new Date() }
    );    
  } catch (error) {
    console.error(`[SAVE] Error saving document ${docId}:`, 
        error instanceof Error ? error.message : "Unknown error"
    );
  }
}