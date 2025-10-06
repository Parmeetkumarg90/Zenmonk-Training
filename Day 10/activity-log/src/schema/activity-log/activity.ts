import * as zod from 'zod';

const activitySchema = zod.object({
    activity: zod.string(),
    time: zod.string()
});

const usersActivitySchema = zod.object({
    email: zod.email().min(10, "Invalid Length"),
    log: zod.array(activitySchema),
});

const activityActionSchema = zod.object({
    email: zod.email().min(10, "Invalid Length"),
    activity: zod.string(),
    time: zod.number().int().positive(),
});

export { usersActivitySchema, activitySchema, activityActionSchema };