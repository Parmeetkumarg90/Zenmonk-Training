"use client"
import React from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { signUpUserInterface } from '@/interfaces/user';
import { useForm, SubmitHandler } from 'react-hook-form';
import { redirect } from 'next/navigation';
import TextField from '@mui/material/TextField';
import style from './style.module.css';
import { logInUserSchema, signUpUserSchema } from '@/schema/authentication';
import { enqueueSnackbar } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/redux/store';
import { addCredentials } from '@/redux/user/currentUser';
import { addNewUser } from '@/redux/user/users';
import { logInUserInterface } from '@/interfaces/user';
import { zodResolver } from "@hookform/resolvers/zod"

const SignUpForm = () => {
    const { register, handleSubmit, reset } = useForm({
        resolver: zodResolver(signUpUserSchema),
    });

    const users = useSelector((state: RootState) => state.users);
    const loggedInUser = useSelector((state: RootState) => state.currentUser);
    const dispatch = useDispatch();

    useEffect(() => {
        const isValidLogIn = isUserValid(loggedInUser);
        if (isValidLogIn.success) {
            redirect('/dashboard');
        }
    }, []);

    const isUserValid = (user: logInUserInterface) => {
        const isValid = logInUserSchema.safeParse(user);
        // console.log("🚀 ~ isUserValid ~ isValid:", isValid);
        if (isValid.success) {
            const userDetail = users.find((eachUser) => eachUser.email === user.email && eachUser.username === user.username && eachUser.password === user.password);
            if (signUpUserSchema.safeParse(userDetail).success) {
                dispatch(addCredentials(userDetail!));
                return { success: true, email: userDetail?.email === user.email, username: userDetail?.username === user.username };
            }
        }
        return { success: false, email: null, username: null };
    }

    const onSubmit: SubmitHandler<signUpUserInterface> = (data) => {
        data.email = data?.email?.trim();
        data.password = data?.password?.trim();
        data.confirmPassword = data?.confirmPassword?.trim();
        data.username = data?.username?.trim();
        if (data.password === data.confirmPassword) {
            const isValidCredentials = isUserValid(data);
            if (isValidCredentials.success) {
                const reason = isValidCredentials.username ? "This username is already taken. Please choose another one" : "Account with same email already exists";
                enqueueSnackbar(reason);
            }
            else {
                reset();
                dispatch(addCredentials(data));
                dispatch(addNewUser(data));
                enqueueSnackbar("Signup Success");
                redirect('/dashboard');
            }
        }
        else {
            enqueueSnackbar("Password not matching");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <Card className={style.card}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className={style.text_center}>
                        Signup
                    </Typography>
                    <Card className={`${style.card} ${style.input_card}`}>
                        <TextField
                            // required
                            id="filled-basic-username"
                            {...register("username")}
                            label="Username"
                            variant="filled"
                            className={`${style.w_full}${style.pY}${style.mY}`}
                        />
                        <TextField
                            // required
                            id="filled-basic-email"
                            {...register("email")}
                            label="Email"
                            variant="filled"
                            type='email'
                            className={`${style.w_full}${style.pY}${style.mY}`}
                        />
                        <TextField
                            // required
                            id="filled-basic-password"
                            {...register("password", { required: true })}
                            label="Password"
                            variant="filled"
                            type='password'
                            className={`${style.w_full}${style.pY}${style.mY}`}
                        />
                        <TextField
                            // required
                            id="filled-basic-confirmPassword"
                            {...register("confirmPassword", { required: true })}
                            label="Confirm Password"
                            variant="filled"
                            type='password'
                            className={`${style.w_full}${style.pY}${style.mY}`}
                        />
                    </Card>
                </CardContent>
                <CardActions className={`${style.input_card}`}>
                    <Button size="small" className={`${style.border}`} type='submit'>Create</Button>
                    <Button size="small" className={`${style.border}`} onClick={() => { redirect('/') }}>Already have an account?</Button>
                </CardActions>
            </Card>
        </form >
    )
}

export default SignUpForm;