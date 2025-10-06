"use client"
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { logInUserInterface } from '@/interfaces/user';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { redirect } from 'next/navigation';
import TextField from '@mui/material/TextField';
import style from './style.module.css';
import { logInUserSchema } from '@/schema/authentication';
import { enqueueSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { addCredentials } from '@/redux/user/currentUser';
import { zodResolver } from '@hookform/resolvers/zod';

const LoginForm = () => {
    const { register, handleSubmit, reset, control } = useForm<logInUserInterface>({
        resolver: zodResolver(logInUserSchema),
        defaultValues: {
            email: "",
            username: "",
            password: ""
        }
    });
    const loggedInUser = useSelector((state: RootState) => state.currentUser);
    const users = useSelector((state: RootState) => state.users);
    const [isLoginUsingUsername, setLoginUsingUsername] = useState<boolean>(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const isValidLogIn = isUserValid(loggedInUser);
        if (isValidLogIn.success) {
            redirect('/dashboard');
        }
    }, []);

    const isUserValid = (user: logInUserInterface) => {
        const isValid = logInUserSchema.safeParse(user);
        if (isValid.success) {
            const userDetail = users.find((eachUser) => (eachUser.email === user.email || eachUser.username === user.username) && eachUser.password === user.password);
            if (logInUserSchema.safeParse(userDetail).success) {
                dispatch(addCredentials(userDetail!));
                return {
                    success: true, email: userDetail?.email === user.email, username: userDetail?.username === user.username
                };
            }
        }
        return { success: false, email: null, username: null };
    }

    const onSubmit: SubmitHandler<logInUserInterface> = (data) => {
        data.email = data?.email?.trim();
        data.password = data?.password?.trim();
        data.username = data?.username?.trim();
        const isValidCredentials = isUserValid(data);
        if (isValidCredentials.success) {
            reset();
            dispatch(addCredentials(data));
            enqueueSnackbar("Login Success");
            redirect('/dashboard');
        }
        else {
            enqueueSnackbar("Credentials you have entered are incorrect");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className={style.card}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className={style.text_center}>
                        Login
                    </Typography>
                    <Card className={`${style.card} ${style.input_card}`}>
                        {
                            isLoginUsingUsername ? <Controller
                                name="username"
                                control={control}
                                render={({
                                    field, formState: { errors }, fieldState: {
                                        error,
                                    } }) => {
                                    return <TextField
                                        {...field}
                                        helperText={error ? error.message : ""}
                                        id={`filled-basic-username`}
                                        label="Username"
                                        variant="filled"
                                        error={!!error}
                                    />
                                }}
                            />
                                :
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({
                                        field, formState: { errors }, fieldState: {
                                            error,
                                        } }) => {
                                        return <TextField
                                            {...field}
                                            helperText={error ? error.message : ""}
                                            id={`filled-basic-email`}
                                            label="Email"
                                            variant="filled"
                                            error={!!error}
                                        />
                                    }}
                                />
                        }
                        <Controller
                            name="password"
                            control={control}
                            render={({
                                field, formState: { errors }, fieldState: {
                                    error,
                                } }) => {
                                return <TextField
                                    {...field}
                                    helperText={error ? error.message : ""}
                                    id={`filled-basic-password`}
                                    label="Password"
                                    variant="filled"
                                    error={!!error}
                                />
                            }}
                        />
                    </Card>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => { setLoginUsingUsername(!isLoginUsingUsername); reset(); }}>Login Using {isLoginUsingUsername ? "Email" : "Username"}</Button>
                    <Button size="small" type='submit'>Login</Button>
                    <Button size="small" onClick={() => { redirect('/register') }}>Create Account</Button>
                </CardActions>
            </Card>
        </form>
    )
}

export default LoginForm;