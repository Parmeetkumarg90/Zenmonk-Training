"use client"
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { logInUserInterface } from '@/interfaces/user';
import { logInUserSchema } from '@/schema/authentication';
import { redirect } from 'next/navigation';
import Container from '@mui/material/Container';
import style from './style.module.css';
import Typography from '@mui/material/Typography';
import { addCredentials, logout } from '@/redux/user/currentUser';
import Button from '@mui/material/Button';

const Dashboard = () => {
    const users = useSelector((state: RootState) => state.users);
    const loggedInUser = useSelector((state: RootState) => state.currentUser);
    const dispatch = useDispatch();

    const isUserValid = (user: logInUserInterface) => {
        const isValid = logInUserSchema.safeParse(user);
        if (isValid) {
            const userDetail = users.find((eachUser) => (eachUser.email === user.email || eachUser.username === user.username) && eachUser.password === user.password);
            if (logInUserSchema.safeParse(userDetail).success) {
                dispatch(addCredentials(userDetail!));
                return { success: true, email: userDetail?.email === user.email, username: userDetail?.username === user.username };
            }
        }
        return { success: false, email: null, username: null };
    }

    useEffect(() => {
        const isValidLogIn = isUserValid(loggedInUser);
        if (!isValidLogIn.success) {
            redirect('/');
        }
    }, []);

    return (
        <Container maxWidth="sm" className={`${style.container}`}>
            <Typography className={`${style.pY}`}>Welcome {loggedInUser.username}, and enjoy our services, stay on our app</Typography>
            <Button className={`${style.pY}`}
                onClick={() => {
                    dispatch(logout());
                    redirect('/');
                }}>Logout</Button>
        </Container>
    )
}

export default Dashboard;