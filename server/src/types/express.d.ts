import type { AuthPayload } from '../services/authService.ts';
import type { HydratedDocument } from 'mongoose';
import type { DocumentType } from '../models/document.ts';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
      document?:HydratedDocument<DocumentType>;
    }
  }
}

export {};