import { z } from 'zod'

const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .refine(
        (email) => z.email().safeParse(email).success,
        { message: "Invalid email address" }
    );

const titleSchema = z
    .string()
    .trim()
    .min(5,"Document Title must be at least 5 characters")
    .max(20, "Document Title cannot exceed 20 characters")

const collaboratorsSchema = z
    .array(emailSchema)

export const createDocumentSchema = z.object({
    title:titleSchema,
    collaborators:collaboratorsSchema
})

export const updateDocumentCollaboratorSchema = z.object({
    collaborators:collaboratorsSchema
})