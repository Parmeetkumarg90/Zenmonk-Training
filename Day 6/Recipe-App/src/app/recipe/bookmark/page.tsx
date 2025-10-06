"use client";
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { logInUserInterface } from '@/interfaces/user';
import { logInUserSchema } from '@/schema/user';
import { recipeInterface } from '@/interfaces/recipe';
import RecipeList from '@/components/list/recipe';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import style from './style.module.css';

const BookMarkRecipes = () => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recipes = useSelector((state: RootState) => state.recipes);
    const [totalRecipes, setTotalRecipes] = useState<number>(Math.floor(recipes.length / 10));
    const [bookmarkRecipes, setBookmarkRecipes] = useState<recipeInterface[]>([]);
    const users = useSelector((state: RootState) => state.users);
    const loggedInUser = useSelector((state: RootState) => state.currentUser);
    const bookMarkRecipe = useSelector((state: RootState) => state.bookmarkRecipe.find(each => each.userEmail === loggedInUser.email));

    useEffect(() => {
        const isValidLogIn = isUserValid(loggedInUser);
        if (!isValidLogIn.success) {
            redirect('/login');
        }
        else {
            findRecipes(0);
        }
    }, []);

    useEffect(() => {
        const calculateSkip = (currentPage - 1) * 10;
        setLoading(true);
        if (calculateSkip < bookmarkRecipes.length) {
            const currentPageRecipes = [];
            for (let index = calculateSkip; index < calculateSkip + 10; index++) {
                currentPageRecipes.push(bookmarkRecipes[index]);
            }
            setBookmarkRecipes(currentPageRecipes);
            const timer = setInterval(() => {
                clearInterval(timer);
                setLoading(false);
            }, 500);
        }
        else {
            findRecipes(calculateSkip);
        }
    }, [currentPage]);

    const isUserValid = (user: logInUserInterface) => {
        const isValid = logInUserSchema.safeParse(user);
        if (isValid.success) {
            const userDetail = users.find((eachUser) => (eachUser.email === user.email || eachUser.username === user.username) && eachUser.password === user.password);
            if (logInUserSchema.safeParse(userDetail).success) {
                return {
                    success: true, email: userDetail?.email === user.email, username: userDetail?.username === user.username
                };
            }
        }
        return { success: false, email: null, username: null };
    }

    const findRecipes = (skip: number) => {
        const recipesDetails = [];
        if (bookMarkRecipe) {
            let count = 0;
            for (let index = skip; index < bookMarkRecipe?.recipeIds.length && count < 10; index++) {
                const recipe = recipes.find((item) => item.id === bookMarkRecipe.recipeIds[index]);
                if (recipe) {
                    recipesDetails.push(recipe);
                    count++;
                }
            }
        }
        setBookmarkRecipes(recipesDetails);

        const timer = setTimeout(() => {
            clearTimeout(timer);
            setLoading(false);
        }, 800);
    };

    const handlePageChange = (e: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    }

    return (
        <Stack>
            <RecipeList data={bookmarkRecipes} loading={isLoading} isBookmarkRecipes={true} />
            <Pagination count={totalRecipes} page={currentPage} onChange={handlePageChange}
                color="primary" variant="outlined" shape="rounded"
                className={`${style.pagination} `}
                renderItem={(item) => (
                    <PaginationItem
                        {...item}
                        sx={{ color: 'white', '&.Mui-selected': { color: 'white', }, }}
                    />
                )}
            />
        </Stack>
    )
}

export default BookMarkRecipes;