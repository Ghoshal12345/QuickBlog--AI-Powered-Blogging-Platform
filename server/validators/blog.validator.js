import mongoose from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z
    .string()
    .refine((value) => mongoose.Types.ObjectId.isValid(value), {
        message: 'Invalid ObjectId'
    });

const blogFieldSchema = z.object({
    title: z
        .string()
        .trim()
        .min(5, { message: 'Title is required and must be at least 5 characters long' })
        .max(150, { message: 'Title cannot exceed 150 characters' }),
    subTitle: z
        .string()
        .trim()
        .max(150, { message: 'Subtitle cannot exceed 150 characters' })
        .optional()
        .or(z.literal('')),
    description: z
        .string()
        .trim()
        .min(1, { message: 'Content is required' })
        .max(100000, { message: 'Content cannot exceed 100000 characters' }),
    category: z
        .string()
        .trim()
        .min(1, { message: 'Category is required' })
        .max(50, { message: 'Category cannot exceed 50 characters' }),
    isPublished: z
        .union([z.boolean(), z.enum(['true', 'false'])])
        .transform((value) => value === true || value === 'true')
});

const addBlogSchema = z.object({
    body: blogFieldSchema
})

const editBlogSchema = z.object({
    params: z.object({
        id: objectIdSchema
    }),
    body: blogFieldSchema
});

const blogIdParamSchema = z.object({
    params: z.object({
        id: objectIdSchema
    })
});

const generateContentSchema = z.object({
    body: z.object({
        prompt: z
            .string()
            .trim()
            .min(1, { message: 'Prompt is required' })
            .max(1000, { message: 'Prompt cannot exceed 1000 characters' })
    })
});

const togglePublishSchema = z.object({
    body: z.object({
        id: objectIdSchema,
    })
});

export {
    addBlogSchema,
    editBlogSchema,
    blogIdParamSchema,
    generateContentSchema,
    togglePublishSchema
};