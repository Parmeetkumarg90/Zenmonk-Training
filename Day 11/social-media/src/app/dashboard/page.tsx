"use client";
import { logInUserInterface } from '@/interfaces/user/user';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';
import { logout } from '@/redux/user/currentUser';
import { logInUserSchema } from '@/schema/user/user';
import { Button, ListItem, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import style from "./style.module.css";
import Card from "@mui/material/Card";
import Stack from '@mui/material/Stack';
import Cookies from 'js-cookie';
import { addActivity } from '@/redux/activity-log/activity';
import { firbaseDb } from '@/config/firebase';
import { ref, get, set, push } from "firebase/database";
import { activityActionInterface } from '@/interfaces/activity-log/activity';

const Dashboard = () => {
    // const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    // const users = useAppSelector((state: RootState) => state.users);
    // const activities = useAppSelector((state: RootState) => state.activities.find((each) => each.email === loggedInUser.email));
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
            return { success: true };
        }
        return { success: false };
    }

    return (
        <Card className={`${style.card} ${style.grid}`}>
            <div className={`${style.text_left} ${style.bottom_border}`}>
                <Typography>
                    Your Activity Log
                </Typography>
            </div>
            <Stack spacing={2} className={`${style.stack} ${style.mY5} ${style.pY5}`}>
                hi dashboard
            </Stack>
            <Button onClick={handleLogout} className={`${style.button} ${style.color_w_background_b} `}>Logout</Button>
        </Card>
    )
}

export default Dashboard;