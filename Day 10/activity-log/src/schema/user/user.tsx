import * as zod from 'zod';

const usersSchema = zod.object({
    email: zod.string().email().min(10, "Invalid Length"),
    password: zod.string().min(6, "Invalid Length")
});

const logInUserSchema = zod.object({
    email: zod.string().email().min(10, "Invalid Length"),
    password: zod.string().min(6, "Invalid Length"),
});

const signUpUserSchema = zod.object({
    email: zod.string().email().min(10, "Invalid Length"),
    password: zod.string().min(6, "Invalid Length"),
    confirmPassword: zod.string().min(6, "Invalid Length"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export { usersSchema, logInUserSchema, signUpUserSchema };