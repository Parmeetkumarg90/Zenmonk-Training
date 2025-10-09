import * as zod from "zod";

const postCreateSchema = zod.object({
    text: zod.string().trim().min(1, "Text cannot be empty or spaces").max(500, "Textsize should be smaller than 500 characters"),
    images: zod.array(zod.file()).min(1, "Provide atleast 1 image").max(4, "Provide images between 1-4"),
});

const postCreateDbSchema = zod.object({
    text: zod.string().trim().min(1, "Text cannot be empty or spaces").max(500, "Textsize should be smaller than 500 characters"),
    images: zod.array(zod.file()).min(1, "Provide atleast 1 image").max(4, "Provide images between 1-4"),
});

export { postCreateSchema, postCreateDbSchema };