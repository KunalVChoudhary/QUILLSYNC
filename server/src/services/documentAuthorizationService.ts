import Document from "../models/document.js";

export const authorizeDocumentAccess = async (
    userId: string,
    docId: string
) => {
    const document = await Document.findById(docId);

    if (!document) {
        const err = new Error("Document not found");
        err.name = "DocumentNotFound";
        throw err;
    }

    const isOwner = document.owner.toString() === userId;

    const isCollaborator = document.collaborators.some(
        id => id.toString() === userId
    );

    if (!isOwner && !isCollaborator) {
        const err = new Error("Not Authorized To Access");
        err.name = "NotAuthorized";
        throw err;
    }

    return document;
};

export const authorizeDocumentOwner = async (
    userId: string,
    docId: string
) => {
    const document = await Document.findById(docId);

    if (!document) {
        const err = new Error("Document not found");
        err.name = "DocumentNotFound";
        throw err;
    }

    if (document.owner.toString() !== userId) {
        const err = new Error("Not Authorized To Access");
        err.name = "NotAuthorized";
        throw err;
    }

    return document;
};