import { z } from "zod";

export const generateSummarySchema = z.object({
    docId: z.string().trim().min(1),
});