import * as zod from 'zod';

const usersSchema = zod.object({
    username: zod.string().min(1, "Invalid Length"),
    email: zod.email().min(1, "Invalid Length"),
    password: zod.string().min(6, "Invalid Length")
});

const logInUserSchema = zod.object({
    username: zod.string().min(1, "Invalid Length").optional(),
    email: zod.email().min(1, "Invalid Length").optional(),
    password: zod.string().min(6, "Invalid Length")
});

const signUpUserSchema = zod.object({
    username: zod.string().min(1, "Invalid Length"),
    email: zod.email().min(1, "Invalid Length"),
    password: zod.string().min(6, "Invalid Length"),
    confirmPassword: zod.string().min(6, "Invalid Length"),
});

export { usersSchema, logInUserSchema, signUpUserSchema };