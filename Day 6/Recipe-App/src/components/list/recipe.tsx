"use client"
import { recipeInterface } from "@/interfaces/recipe";
import Grid from '@mui/material/Grid';
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Link from "next/link";
import Image from "next/image";
import style from './style.module.css'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBookMark, removeBookMark } from "@/redux/slices/bookmark-recipe";
import { RootState } from "@/redux/store";
import { enqueueSnackbar } from "notistack";
import { logInUserSchema } from "@/schema/user";

const RecipeList = ({ data, loading, isBookmarkRecipes }: { data: recipeInterface[], loading: boolean, isBookmarkRecipes?: boolean }) => {
    const [recipes, setRecipes] = useState<recipeInterface[]>([]);
    const [isLoading, setLoading] = useState<boolean>(loading);
    const dispatch = useDispatch();
    const allRecipes = useSelector((state: RootState) => state.recipes);
    const loggedInUser = useSelector((state: RootState) => state.currentUser);
    const bookMarkIds = useSelector((state: RootState) => state.bookmarkRecipe.find((item) => item.userEmail === loggedInUser.email)?.recipeIds);

    useEffect(() => {
        let allRecipes: recipeInterface[] = [];
        if (isBookmarkRecipes) {
            allRecipes = data.map((item) => {
                return { ...item, isBookMark: true };
            });
        }
        else {
            allRecipes = data.map((item) => {
                const isfound = bookMarkIds?.includes(item.id);
                return { ...item, isBookMark: isfound };
            });
        }
        setLoading(loading);
        setRecipes(allRecipes);
    }, [loading]);

    const changeBookMark = (recipe: recipeInterface) => {
        if (logInUserSchema.safeParse(loggedInUser).success) {
            const recipeDetail = {
                recipeId: recipe.id,
                userEmail: loggedInUser.email!,
            };
            if (!recipe.isBookMark) {
                dispatch(addBookMark(recipeDetail));
                enqueueSnackbar("Recipe added in bookmark");
            }
            else {
                dispatch(removeBookMark(recipeDetail));
                enqueueSnackbar("Recipe removed from bookmark");
            }
            inverseBookMark(recipe.id);
            if (isBookmarkRecipes) {
                removeNonBookMarked(recipe.id);
            }
        }
        else {
            enqueueSnackbar("Please login first");
        }
    }

    const inverseBookMark = (id: number) => {
        const allRecipes = recipes.map((eachRecipe) => {
            if (eachRecipe.id === id) {
                return {
                    ...eachRecipe,
                    isBookMark: !eachRecipe.isBookMark,
                }
            }
            return eachRecipe;
        });
        setRecipes(allRecipes);
    }

    const removeNonBookMarked = (id: number) => {
        const allRecipes = recipes.filter((eachRecipe) => eachRecipe.id !== id);
        setRecipes(allRecipes);
    }

    return (
        < Grid container spacing={2} justifyContent={"center"} sx={{ margin: "10px" }} >
            {isLoading && <CircularProgress size="3rem" />}
            {!isLoading &&
                <>
                    {
                        recipes.length ? recipes?.map((item) => {
                            return (
                                < Card className={`${style.Card}`} key={item.id}>
                                    <Typography variant='h5' gutterBottom sx={{ textAlign: "center" }}>
                                        {item.name}
                                    </Typography>
                                    <Typography>
                                        Meal Type: {item.mealType}
                                    </Typography>
                                    <Image src={item.image} alt={item.name + " image"} width={300} height={300} />
                                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Review: {item.rating}</Typography>
                                    <Typography variant="body2">
                                        Preparation Time: {item.prepTimeMinutes}
                                    </Typography>
                                    <Link href={`/recipe/${item.id}`} className={`${style.paddingY} `}>
                                        <Button size="small" variant='outlined'>Show Details</Button>
                                    </Link>
                                    <Button size="small" variant='outlined' onClick={() => { changeBookMark(item); }}>
                                        {item.isBookMark ? "Remove Bookmark" : "Add Bookmark"}
                                    </Button>
                                </Card >
                            )
                        }) :
                            <Typography sx={{ color: 'white', mb: 1.5 }}>{isBookmarkRecipes ? "You have add any recipe to Bookmark" : "No more cecipes"}</Typography>
                    }
                </>
            }
        </Grid >
    );
}

export default RecipeList;