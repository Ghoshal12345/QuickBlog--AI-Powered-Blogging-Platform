import mongoose from 'mongoose';
import { z } from "zod";

const objectIdSchema = z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: 'Invalid ObjectId'
    });


const addCommentSchema = z.object({
    body: z.object({
        content: z
            .string()
            .trim()
            .min(1, 'Comment cannot be empty')
            .max(2000, 'Comment cannot exceed 2000 characters'),
        blogId: objectIdSchema
    })
});
const editCommentSchema = z.object({
    params: z.object({
        id: objectIdSchema
    }),
    body: z.object({
        content: z
            .string()
            .trim()
            .min(1, 'Comment cannot be empty')
            .max(2000, 'Comment cannot exceed 2000 characters')
    })
});
const deleteCommentSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});

const approveCommentSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});

export {
    addCommentSchema,
    editCommentSchema,
    deleteCommentSchema,
    approveCommentSchema
}