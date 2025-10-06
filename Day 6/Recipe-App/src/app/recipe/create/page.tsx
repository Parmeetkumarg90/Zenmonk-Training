"use client"
import CreateRecipeForm from '@/components/form/create-recipe-form';
import { logInUserInterface } from '@/interfaces/user';
import { RootState } from '@/redux/store';
import { logInUserSchema } from '@/schema/user';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const CreateRecipe = () => {
    const users = useSelector((state: RootState) => state.users);
    const loggedInUser = useSelector((state: RootState) => state.currentUser);

    useEffect(() => {
        const isValidLogIn = isUserValid(loggedInUser);
        if (!isValidLogIn.success) {
            redirect('/login');
        }
    }, []);

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

    return (
        <CreateRecipeForm />
    );
}

export default CreateRecipe;
