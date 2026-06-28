import { type RequestHandler } from "express";
import { type ZodType } from "zod";

export const requestBodyInputValidate =
    (schema: ZodType): RequestHandler =>
    (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues,
            });
        }

        req.body = result.data;

        next();
    };
