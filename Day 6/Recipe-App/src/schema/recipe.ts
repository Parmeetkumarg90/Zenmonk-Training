import zod from 'zod';

const recipeSchema = zod.object({
    id: zod.number(),
    name: zod.string().trim().min(1, { message: "Name is required" }),
    image: zod.string().url().trim().min(1, { message: "Image URL is required" }),
    caloriesPerServing: zod.number().min(0, { message: "Calories must be greater than 0" }),
    cookTimeMinutes: zod.number().min(0, { message: "Cooking time must be greater than 1" }),
    prepTimeMinutes: zod.number().min(1, { message: "Preparation time must be greater than 1" }),
    rating: zod.number().min(0, { message: "Rating must be greater than 1" }).max(5, { message: "Rating must be smaller than 5" }),
    reviewCount: zod.number().min(0, { message: "Review must be greater than 0" }),
    servings: zod.number().min(1, { message: "Food must be served to atleast one person" }),
    cuisine: zod.string().trim().min(1, { message: "Cuisine is required" }),
    difficulty: zod.string().trim().min(1, { message: "Difficulty is required" }),
    ingredients: zod.array(
        zod.string().trim().min(1, { message: "Ingredient cannot be empty" })).min(1, { message: "At least one ingredient is required" }
        ),
    instructions: zod.array(
        zod.string().trim().min(1, { message: "Instruction cannot be empty" })).min(1, { message: "At least one instruction is required" }),
    mealType: zod.array(
        zod.string().trim().min(1, { message: "Meal type cannot be empty" })).min(1, { message: "At least one meal type is required" }),
    tags: zod.array(
        zod.string().trim().min(1, { message: "Tag cannot be empty" })).min(1, { message: "At least one tag is required" }),
    userId: zod.number(),
});


const recipesSchema = zod.array(recipeSchema);

export { recipeSchema, recipesSchema };