"use client"
import { recipeInterface } from "@/interfaces/recipe";
import { RootState } from "@/redux/store"
import { recipeSchema } from "@/schema/recipe";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import style from "./style.module.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import { addRecipes } from "@/redux/slices/recipe";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { enqueueSnackbar } from "notistack";

type AllowedKeys =
    | "caloriesPerServing"
    | "cookTimeMinutes"
    | "cuisine"
    | "difficulty"
    | "id"
    | "image"
    | "ingredients"
    | "instructions"
    | "mealType"
    | "name"
    | "prepTimeMinutes"
    | "rating"
    | "reviewCount"
    | "servings"
    | "tags"
    | "userId"
    | `ingredients.${number}`
    | `instructions.${number}`
    | `mealType.${number}`
    | `tags.${number}`;

const stringInputs: AllowedKeys[] = ["name", "image", "cuisine", "difficulty"];
const numberInputs: AllowedKeys[] = ["caloriesPerServing", "cookTimeMinutes", "prepTimeMinutes", "rating", "reviewCount", "servings"];
const arrayInputs: AllowedKeys[] = ["mealType", "ingredients", "instructions", "tags"];

const CreateRecipeForm = () => {
    const recipes = useSelector((state: RootState) => state.recipes);

    const { handleSubmit, reset, register, control, formState: { errors } } = useForm({
        resolver: zodResolver(recipeSchema),
        defaultValues: {
            id: Math.floor(Math.random() * 100),
            name: "",
            image: "",
            caloriesPerServing: 0,
            cookTimeMinutes: 0,
            prepTimeMinutes: 0,
            rating: 0,
            reviewCount: 0,
            servings: 0,
            cuisine: "",
            difficulty: "",
            ingredients: [],
            instructions: [],
            mealType: [],
            tags: [],
            userId: Math.floor(Math.random() * 1000)
        },
    });

    const dispatch = useDispatch();

    const onSubmit: SubmitHandler<recipeInterface> = (data) => {
        dispatch(addRecipes([data]));
        reset();
        enqueueSnackbar("Recipe Added Successfully");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <Card className={style.card}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className={style.text_center}>
                        Make your own recipes
                    </Typography>
                    <CardContent className={` ${style.grid} `}>
                        {stringInputs.map(each => {
                            return <Card className={`${style.mX}`} key={each}>
                                <Controller
                                    name={each}
                                    control={control}
                                    render={({
                                        field, formState: { errors }, fieldState: {
                                            error,
                                        } }) => {
                                        return <TextField
                                            {...field}
                                            className={`${style.w_full} ${style.overflow_hidden}`}
                                            helperText={error ? error.message : ""}
                                            id={`filled-basic-${each}`}
                                            label={(each).toUpperCase()}
                                            variant="filled"
                                            error={!!error}
                                        />
                                    }}
                                />
                            </Card>
                        })}
                        {numberInputs.map(each => {
                            return <Card className={`${style.mX}`} key={each}>
                                <Controller
                                    name={each}
                                    control={control}
                                    render={({
                                        field, formState: { errors }, fieldState: {
                                            error,
                                        } }) => {
                                        return <TextField
                                            {...field}
                                            helperText={error ? error.message : ""}
                                            className={`${style.w_full} ${style.overflow_hidden}`}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            error={!!error}
                                            id={`filled-basic-${each}`}
                                            label={(each).toUpperCase()}
                                            type="number"
                                            variant="filled"
                                        />
                                    }}
                                />
                            </Card>
                        })}
                    </CardContent>
                    <Card className={`${style.mX} ${style.w_full}`}>
                        {arrayInputs.map(each => {
                            return <Card className={`${style.w_full}`} key={each}>
                                <Controller
                                    name={each}
                                    control={control}
                                    render={({
                                        field, formState: { errors }, fieldState: {
                                            error,
                                        } }) => {
                                        return <Autocomplete
                                            multiple
                                            id={`filled-basic-${each}`}
                                            value={Array.isArray(field.value) ? field.value : []}
                                            onChange={(_, newValue) => field.onChange(newValue)}
                                            options={[]}
                                            freeSolo
                                            renderValue={(value) => {
                                                const safeValue = Array.isArray(value) ? value : [];
                                                return safeValue.map((option, index) => (
                                                    <Chip variant="outlined" label={option} key={index} />
                                                ));
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    className={`${style.w_full} ${style.overflow_hidden}`}
                                                    {...params}
                                                    helperText={error ? error.message : ""}
                                                    label={(each).toUpperCase()}
                                                    variant="filled"
                                                    error={!!error}
                                                />
                                            )}
                                        />
                                    }}
                                />
                            </Card>
                        })}
                    </Card>
                </CardContent>
                <CardActions>
                    <Button size="small" type="submit">Add Recipe</Button>
                </CardActions>
            </Card>
        </form >
    );
}

export default CreateRecipeForm;