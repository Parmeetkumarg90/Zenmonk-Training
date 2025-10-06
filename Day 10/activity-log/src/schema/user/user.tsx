import * as zod from 'zod';

const usersSchema = zod.object({
    email: zod.email().min(10, "Invalid Length"),
    password: zod.string().min(6, "Invalid Length")
});

const logInUserSchema = zod.object({
    email: zod.string().email().min(10, "Invalid Length").optional().or(zod.literal("")),
    password: zod.string().min(6, "Invalid Length"),
});

const signUpUserSchema = zod.object({
    email: zod.email().min(10, "Invalid Length"),
    password: zod.string().min(6, "Invalid Length"),
    confirmPassword: zod.string().min(6, "Invalid Length"),
});

export { usersSchema, logInUserSchema, signUpUserSchema };