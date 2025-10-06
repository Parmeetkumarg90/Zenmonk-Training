"use client"
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { recipeInterface, recipePageProps } from '@/interfaces/recipe';
import { redirect } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { getProduct } from '@/services/recipe';
import { recipeSchema } from '@/schema/recipe';
import { Card, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import style from './style.module.css';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Image from 'next/image';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText'

const RecipeId = ({ params }: recipePageProps) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const storedRecipes = useSelector((state: RootState) => state.recipes);
    const [recipeDetail, setRecipeDetail] = useState<recipeInterface>();

    useEffect(() => {
        findRecipe();
    }, []);

    const findRecipe = async () => {
        const { recipeId } = await params;
        if (storedRecipes.length >= Number(recipeId)) {
            const recipe = storedRecipes.find((eachRecipe) => eachRecipe.id === Number(recipeId));
            setRecipeDetail(recipe!);
            console.log(recipe)
        }
        else {
            const result = await getProduct(recipeId);
            const isValid = recipeSchema.safeParse(result);
            if (isValid.success) {
                setRecipeDetail(isValid.data);
            }
            else {
                enqueueSnackbar("Recipe you want to see is invalid");
                redirect('/');
            }
        }
        const timer = setInterval(() => {
            clearInterval(timer);
            setLoading(false);
        }, 800);
    }

    return (
        < Grid container className={`${style?.Grid}`} >
            {isLoading && <CircularProgress size="3rem" />}
            {!isLoading && recipeDetail &&
                <Card className={`${style.Card} ${style.typography}`}>
                    <Typography className={`${style.typography} ${style.flex}`}>{recipeDetail?.name}</Typography>
                    <Grid container className={`${style?.Grid}`}>
                        <Typography className={`${style.typography} ${style.flex}`}><RestaurantIcon /> {recipeDetail?.servings} servings</Typography>
                        <Typography className={`${style.typography} ${style.flex}`}><AccessAlarmIcon /> {recipeDetail?.prepTimeMinutes} minutes</Typography>
                    </Grid>
                    <Typography>
                        Tags: {recipeDetail.tags.map((tag, index) => <span key={index}>{recipeDetail.tags.length > index + 1 ? tag + ", " : tag}</span>)}
                    </Typography>
                    <Image src={recipeDetail?.image} width={300} height={300} alt={recipeDetail?.name} />
                    <Grid container className={`${style?.listGrid} ${style.marginY} ${style.marginX}`} >
                        <List className={`${style.eachGridList}`}>
                            <Typography variant='h4'>Indegrediants: </Typography>
                            {recipeDetail?.ingredients.map((indegredient, index) =>
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>
                                            {index + 1}
                                        </Typography>
                                    </ListItemIcon>
                                    <ListItemText primary={indegredient} />
                                </ListItem>
                            )}
                        </List>
                        <List className={`${style.eachGridList}`}>
                            <Typography variant='h4'>Instructions: </Typography>
                            {recipeDetail?.instructions.map((step, index) =>
                                <ListItem key={index}>
                                    <ListItemIcon>
                                        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>
                                            {index + 1}
                                        </Typography>
                                    </ListItemIcon>
                                    <ListItemText primary={step} />
                                </ListItem>
                            )}
                        </List>
                    </Grid>
                </Card>
            }
        </Grid >
    )
}

export default RecipeId;