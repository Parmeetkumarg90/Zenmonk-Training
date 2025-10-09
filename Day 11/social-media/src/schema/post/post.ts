import * as zod from "zod";

const postCreateSchema = zod.object({
    text: zod.string().trim().min(1, "Text cannot be empty or spaces").max(500, "Textsize should be smaller than 500 characters"),
    images: zod.array(zod.file()).min(1, "Provide atleast 1 image").max(4, "Provide images between 1-4"),
});

const commentDbSchema = zod.object({
    postId: zod.string().trim(),
    text: zod.string().trim().min(1).max(500),
    parentId: zod.string().trim().nullable().optional(),
    time: zod.number(),
});

const postCreateDbSchema = zod.object({
    email: zod.email().trim().min(8),
    text: zod.string().trim().min(1, "Text cannot be empty or spaces").max(500, "Textsize should be smaller than 500 characters"),
    imageURLs: zod.array(zod.string()).min(1, "Provide atleast 1 image").max(4, "Provide images between 1-4"),
    likes: zod.array(zod.string()).default([]).optional(),
    uid: zod.string().trim().min(8),
    time: zod.number(),
    displayName: zod.string().trim().nullable(),
    photoURL: zod.string().trim().nullable(),
});

export { postCreateSchema, postCreateDbSchema, commentDbSchema };