import * as zod from 'zod';

const usersSchema = zod.object({
    username: zod.string().min(6, "Invalid Length"),
    email: zod.email().min(10, "Invalid Length"),
    password: zod.string().min(6, "Invalid Length")
});

const logInUserSchema = zod.object({
    username: zod.string().min(6, "Invalid Length").optional().or(zod.literal("")),
    email: zod.string().email().min(10, "Invalid Length").optional().or(zod.literal("")),
    password: zod.string().min(6, "Invalid Length"),
});

const signUpUserSchema = zod.object({
    username: zod.string().min(6, "Invalid Length"),
    email: zod.email().min(10, "Invalid Length"),
    password: zod.string().min(6, "Invalid Length"),
    confirmPassword: zod.string().min(6, "Invalid Length"),
});

export { usersSchema, logInUserSchema, signUpUserSchema };