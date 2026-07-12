import { type RequestHandler } from "express";
import {
    authorizeDocumentAccess,
    authorizeDocumentOwner,
} from "../services/documentAuthorizationService.js";

export const documentAuthorizationCheck: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const docId = req.params.docId;

        if (typeof docId !== "string") {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        req.document = await authorizeDocumentAccess(
            req.user!.userId,
            docId
        );

        next();
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === "DocumentNotFound") {
                return res.status(404).json({ message: error.message });
            }

            if (error.name === "NotAuthorized") {
                return res.status(401).json({ message: error.message });
            }

            if (error.name === "CastError") {
                return res.status(400).json({
                    message: "Invalid ID format",
                });
            }
        }

        console.error(error);

        return res.status(500).json({
            message: "Server error",
        });
    }
};

export const documentOwnerAuthorizationCheck: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const docId = req.params.docId;

        if (typeof docId !== "string") {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        req.document = await authorizeDocumentOwner(
            req.user!.userId,
            docId
        );

        next();
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === "DocumentNotFound") {
                return res.status(404).json({ message: error.message });
            }

            if (error.name === "NotAuthorized") {
                return res.status(401).json({ message: error.message });
            }

            if (error.name === "CastError") {
                return res.status(400).json({
                    message: "Invalid ID format",
                });
            }
        }

        console.error(error);

        return res.status(500).json({
            message: "Server error",
        });
    }
};