"use client";
import { logInUserInterface } from '@/interfaces/user/user';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/user/currentUser';
import { logInUserSchema } from '@/schema/user/user';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import style from "./style.module.css";
import Card from "@mui/material/Card";
import Stack from '@mui/material/Stack';
import Cookies from 'js-cookie';

const Dashboard = () => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const users = useAppSelector((state: RootState) => state.users);
    const activities = useAppSelector((state: RootState) => state.activities.find((each) => each.email === loggedInUser.email));
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        Cookies.remove("credentials");
        enqueueSnackbar("Logout Success");
        router.push("/");
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
        <Card className={`${style.card} ${style.grid}`}>
            <Typography className={`${style.typography}`}>
                Your Activity Log
            </Typography>
            <Stack spacing={2} className={`${style.stack} ${style.mY5}`}>
                {
                    activities?.log.map((eachActivity, index) => {
                        const timeStamp = new Date(eachActivity.time).toLocaleString();
                        return <Typography key={eachActivity.time}>{index + 1}. {eachActivity.activity}: {timeStamp}</Typography>
                    })
                }
            </Stack>
            <Button onClick={handleLogout} className={`${style.button}`}>Logout</Button>
        </Card>
    )
}

export default Dashboard;