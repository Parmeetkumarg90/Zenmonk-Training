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

const updateUserSchema = zod.object({
    displayName: zod.string().trim().min(3, "Name should have atleast 3 characters").max(20, "Name should have atmost 20 characters").optional(),
    phoneNumber: zod.number().min(10, "Phone Number should have 10 digits").max(10, "Phone Number should have 10 digits without country code").optional(),
    photoURL: zod.file().min(1, "Atleast provide profile image").max(1, "Multiple files selected").optional(),
}).refine((data) => !data.displayName || !data.phoneNumber || !data.photoURL, {
    message: "Form can't be empty",
    path: ["displayName", "phoneNumber", "photoURL"]
});

export { usersSchema, logInUserSchema, signUpUserSchema, updateUserSchema };