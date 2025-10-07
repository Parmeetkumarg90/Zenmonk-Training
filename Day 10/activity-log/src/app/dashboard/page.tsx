"use client";
import { logInUserInterface } from '@/interfaces/user/user';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/user/currentUser';
import { logInUserSchema } from '@/schema/user/user';
import { Button, Typography } from '@mui/material';
import { redirect } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect } from 'react';

const Dashboard = () => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const users = useAppSelector((state: RootState) => state.users);
    const activities = useAppSelector((state: RootState) => state.activities.find((each) => each.email === loggedInUser.email));
    const dispatch = useAppDispatch();

    useEffect(() => {
        const isUserLoggedIn = isUserPresent(loggedInUser);
        if (!isUserLoggedIn.success) {
            enqueueSnackbar("Login first");
            redirect('/');
        }
    });

    const handleLogout = () => {
        dispatch(logout());
        
    }

    const isUserPresent = (credentials: logInUserInterface) => {
        const isSchemaValid = logInUserSchema.safeParse(credentials);
        if (isSchemaValid.success) {
            const isUserValid = users.find(each => each.email === credentials.email && each.password === credentials.password);
            if (isUserValid) {
                return { success: true };
            }
        }
        return { success: false };
    }

    return (
        <>
            {
                activities?.log.map((eachActivity) => {
                    return <Typography key={eachActivity.time}>{eachActivity.activity}: {eachActivity.time}</Typography>
                })
            }
            <Button onClick={handleLogout}>Logout</Button>
        </>
    )
}

export default Dashboard;