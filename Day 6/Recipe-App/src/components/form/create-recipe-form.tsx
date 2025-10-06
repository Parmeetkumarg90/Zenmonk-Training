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

const CreateRecipeForm = () => {
    const recipes = useSelector((state: RootState) => state.recipes);

    const { handleSubmit, reset, register, control, formState: { errors } } = useForm({
        resolver: zodResolver(recipeSchema),
        defaultValues: {
            id: recipes.length + 1,
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
            userId: Math.floor(Math.random() * 100)
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
                        <Card className={`${style.mX} ${style.hidden}`}>
                            <Controller
                                name="id"
                                control={control}
                                render={({
                                    field, formState: { errors }, fieldState: {
                                        error,
                                    } }) => {
                                    return <TextField
                                        {...field}
                                        helperText={error ? error.message : ""}
                                        error={!!error}
                                        id="filled-basic-id"
                                        label="Id"
                                        variant="filled"
                                        type="number"
                                    />
                                }}
                            />
                        </Card>
                        <Card className={`${style.mX}`}>
                            <Controller
                                name="name"
                                control={control}
                                render={({
                                    field, formState: { errors }, fieldState: {
                                        error,
                                    } }) => {
                                    return <TextField
                                        helperText={error ? error.message : ""}
                                        id="filled-basic-name"
                                        label="Name"
                                        variant="filled"
                                        error={!!error}
                                        {...field}
                                    />
                                }}
                            />
                        </Card>
                        <Card className={`${style.mX}`}>
                            <Controller
                                name="image"
                                control={control}
                                render={({
                                    field, formState: { errors }, fieldState: {
                                        error,
                                    } }) => {
                                    return <TextField
                                        helperText={error ? error.message : ""}
                                        error={!!error}
                                        id="filled-basic-image"
                                        label="Image Link"
                                        variant="filled"
                                        {...field}
                                    />
                                }}
                            />
                        </Card>
                        <Card className={`${style.mX}`}>
                            <Controller
                                name="caloriesPerServing"
                                control={control}
                                render={({
                                    field, formState: { errors }, fieldState: {
                                        error,
                                    } }) => {
                                    return <TextField
                                        helperText={error ? error.message : ""}
                                        error={!!error}
                                        id="filled-basic-caloriesPerServing"
                                        label="Calories(Per Serving)"
                                        type="number"
                                        variant="filled"
                                        {...field}
                                    />
                                }}
                            />
                        </Card>
                        <Card className={`${style.mX}`}>
                            <Controller
                                name="cookTimeMinutes"
                                control={control}
                                render={({
                                    field, formState: { errors }, fieldState: {
                                        error,
                                    } }) => {
                                    return <TextField
                                        helperText={error ? error.message : ""}
                                        error={!!error}
                                        id="filled-basic-cookTimeMinutes"
                                        label="Cook Time(Minutes)"
                                        type="number"
                                        variant="filled"
                                        {...field}
                                    />
                                }}
                            />
                        </Card>
                        <Card className={`${style.mX}`}>
                            <Controller
                                name="cuisine"
                                control={control}
                                render={({
                                    field, formState: { errors }, fieldState: {
                                        error,
                                    } }) => {
                                    return <TextField
                                        helperText={error ? error.message : ""}
                                        id="filled-basic-cuisine"
                                        label="Cuisine"
                                        variant="filled"
                                        error={!!error}
                                        {...field}
                                    />
                                }}
                            />
                        </Card>
                        <Card className={`${style.mX}`}>
                            <Controller
                                name="difficulty"
                                control={control}
                                render={({
                                    field, formState: { errors }, fieldState: {
                                        error,
                                    } }) => {
                                    return <TextField
                                        helperText={error ? error.message : ""}
                                        id="filled-basic-difficulty"
                                        label="Difficulty"
                                        variant="filled"
                                        error={!!error}
                                        {...field}
                                    />
                                }}
                            />
                        </Card>
                        <Card className={`${style.mX}`}>
                            <Controller
                                name="prepTimeMinutes"
                                control={control}
                                render={({
                                    field, formState: { errors }, fieldState: {
                                        error,
                                    } }) => {
                                    return <TextField
                                        helperText={error ? error.message : ""}
                                        id="filled-basic-prepTimeMinutes"
                                        label="Preparation Time(Minutes)"
                                        variant="filled"
                                        type="number"
                                        error={!!error}
                                        {...field}
                                    />
                                }}
                            />
                        </Card>
                        <Card className={`${style.mX}`}>
                            <Controller
                                name="rating"
                                control={control}
                                render={({
                                    field, formState: { errors }, fieldState: {
                                        error,
                                    } }) => {
                                    return <TextField
                                        helperText={error ? error.message : ""}
                                        id="filled-basic-rating"
                                        label="Rating"
                                        variant="filled"
                                        type="number"
                                        error={!!error}
                                        {...field}
                                    />
                                }}
                            />
                        </Card>
                        <Card className={`${style.mX}`}>
                            <Controller
                                name="reviewCount"
                                control={control}
                                render={({
                                    field, formState: { errors }, fieldState: {
                                        error,
                                    } }) => {
                                    return <TextField
                                        helperText={error ? error.message : ""}
                                        id="filled-basic-reviewCount"
                                        label="Review Count"
                                        variant="filled"
                                        type="number"
                                        error={!!error}
                                        {...field}
                                    />
                                }}
                            />
                        </Card>
                        <Card className={`${style.mX}`}>
                            <Controller
                                name="servings"
                                control={control}
                                render={({
                                    field, formState: { errors }, fieldState: {
                                        error,
                                    } }) => {
                                    return <TextField
                                        helperText={error ? error.message : ""}
                                        id="filled-basic-servings"
                                        label="Servings"
                                        variant="filled"
                                        type="number"
                                        error={!!error}
                                        {...field}
                                    />
                                }}
                            />
                        </Card>
                    </CardContent>
                    <Card className={`${style.mX} ${style.w_full}`}>
                        <Controller
                            name="mealType"
                            control={control}
                            render={({
                                field, formState: { errors }, fieldState: { error },
                            }) => (
                                <Autocomplete
                                    multiple
                                    id="filled-basic-mealType"
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
                                            {...params}
                                            label="Meal Type"
                                            variant="filled"
                                            error={!!error}
                                            helperText={error?.message || ""}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Card>
                    <Card className={`${style.mX} ${style.w_full}`}>
                        <Controller
                            name="ingredients"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <Autocomplete
                                    multiple
                                    id="filled-basic-ingredients"
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
                                            helperText={error ? error.message : ""}
                                            {...params}
                                            label="Ingredients"
                                            variant="filled"
                                            error={!!error}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Card>
                    <Card className={`${style.mX} ${style.w_full}`}>
                        <Controller
                            name="instructions"
                            control={control}
                            render={({
                                field, formState: { errors }, fieldState: {
                                    error,
                                } }) => {
                                return <Autocomplete
                                    multiple
                                    id="filled-basic-instructions"
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
                                            helperText={error ? error.message : ""}
                                            {...params}
                                            label="Instructions"
                                            variant="filled"
                                            error={!!error}
                                        />
                                    )}
                                />
                            }}
                        />
                    </Card>
                    <Card className={`${style.mX} ${style.w_full}`}>
                        <Controller
                            name="tags"
                            control={control}
                            render={({
                                field, formState: { errors }, fieldState: {
                                    error,
                                } }) => {
                                return <Autocomplete
                                    multiple
                                    id="filled-basic-tags"
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
                                            helperText={error ? error.message : ""}
                                            {...params}
                                            label="Tags"
                                            variant="filled"
                                            error={!!error}
                                        />
                                    )}
                                />
                            }}
                        />
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