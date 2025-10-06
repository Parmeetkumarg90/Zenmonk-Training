import zod from 'zod';

const recipeSchema = zod.object({
    id: zod.number(),
    name: zod.string().trim().min(1, { message: "Name is required" }),
    image: zod.string().trim().min(1, { message: "Image URL is required" }),
    caloriesPerServing: zod.number(),
    cookTimeMinutes: zod.number(),
    prepTimeMinutes: zod.number(),
    rating: zod.number(),
    reviewCount: zod.number(),
    servings: zod.number(),
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