export interface Document {
    _id: string;
    title: string;
    content: BufferJSON | null;
    owner: string;
    collaborators: string[];
    lastEdited: string;
    history: DocumentHistory[];
    createdAt: string;
    updatedAt: string;
}

interface DocumentHistory {
    content: BufferJSON | null;
    editedAt: string;
}

interface BufferJSON {
    type: "Buffer";
    data: number[];
}