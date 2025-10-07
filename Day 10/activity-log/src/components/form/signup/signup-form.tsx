"use client";
import { useEffect } from 'react';
import Card from '@mui/material/Card';
import style from './style.module.css';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { logInUserInterface, signUpUserInterface } from '@/interfaces/user/user';
import { enqueueSnackbar } from 'notistack';
import { redirect } from 'next/navigation';
import { logInUserSchema, signUpUserSchema } from '@/schema/user/user';
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';
import { addCredentials } from '@/redux/user/currentUser';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { addNewUser } from '@/redux/user/users';
import { addActivity } from '@/redux/activity-log/activity';
import { auth, provider } from '@/config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

function LoginForm() {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const users = useAppSelector((state: RootState) => state.users);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const isValidLogIn = isUserValid(loggedInUser);
        if (isValidLogIn.success) {
            redirect('/dashboard');
        }
    }, []);

    const { handleSubmit, reset, control } = useForm({
        resolver: zodResolver(signUpUserSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const isUserValid = (user: logInUserInterface) => {
        const isValid = logInUserSchema.safeParse(user);
        if (isValid.success) {
            const userDetail = users.find((eachUser) => eachUser.email === user.email && eachUser.password === user.password);
            if (logInUserSchema.safeParse(userDetail).success) {
                dispatch(addCredentials(userDetail!));
                return { success: true, email: userDetail?.email === user.email };
            }
        }
        return { success: false, email: null, username: null };
    }

    const isUserPresent = (user: logInUserInterface) => {
        const isValid = logInUserSchema.safeParse(user);
        if (isValid.success) {
            const userDetail = users.find((eachUser) => eachUser.email === user.email);
            if (signUpUserSchema.safeParse(userDetail).success) {
                return { success: true, email: userDetail?.email === user.email };
            }
        }
        return { success: false, email: null };
    }

    const onSubmit: SubmitHandler<signUpUserInterface> = async (data) => {
        data.email = data.email.trim();
        data.password = data.password.trim();
        const isValidCredentials = isUserPresent(data);
        if (isValidCredentials.success) {
            enqueueSnackbar("Email already present. Please Choose another one.");
        }
        else {
            const isStored = await storeUserInDB(data);
            // console.log("🚀 ~ onSubmit ~ isStored:", isStored);
            if (isStored) {
                reset();
                const activityObj = {
                    email: data.email,
                    activity: "Register Account",
                    time: Date.now(),
                };
                dispatch(addNewUser(data));
                dispatch(addCredentials(data));
                dispatch(addActivity(activityObj));
                enqueueSnackbar("Account Register Success");
                redirect('/dashboard');
            }
            else {
                enqueueSnackbar("Error occured during creating of account");
            }
        }
    };

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const userDetail = { email: result.user.email!, password: result.user.uid, isSignWithGoogle: true };
                const activityObj = {
                    email: userDetail.email,
                    activity: "LoggedIn Account",
                    time: Date.now(),
                };
                dispatch(addCredentials(userDetail));
                dispatch(addNewUser(userDetail));
                dispatch(addActivity(activityObj));
                enqueueSnackbar("Login Success");
                return redirect('/dashboard');
            })
            .catch((error) => {
                console.log(error);
                // enqueueSnackbar(error.message.);
            })
    }

    const storeUserInDB = async (data: logInUserInterface) => {
        return createUserWithEmailAndPassword(auth, data.email, data.password).then((value) => {
            // console.log(value);
            return true;
        }).catch((error) => {
            // console.log(error);
            enqueueSnackbar(error);
            return false;
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className={`${style.card} `}>
                <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState: { error } }) => {
                        return (<TextField
                            {...field}
                            helperText={error?.message || ""}
                            id={`filled-basic-email`}
                            label="Email"
                            variant="filled"
                            error={!!error}
                        />);
                    }}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({ field, fieldState: { error } }) => {
                        return (<TextField
                            {...field}
                            helperText={error?.message || ""}
                            id={`filled-basic-password`}
                            label="Password"
                            variant="filled"
                            type="password"
                            error={!!error}
                        />);
                    }}
                />
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field, fieldState: { error } }) => {
                        return (<TextField
                            {...field}
                            helperText={error?.message || ""}
                            id={`filled-basic-confirmPassword`}
                            label="Confirm Password"
                            variant="filled"
                            type="password"
                            error={!!error}
                        />);
                    }}
                />
                <Card>
                    <Button onClick={handleGoogleSignIn}>Signup with Google</Button>
                </Card>
                <Card>
                    <Button type="submit">Create Account</Button>
                    <Link href="/">
                        <Button>Already Account?</Button>
                    </Link>
                </Card>
            </Card>
        </form>
    );
}

export default LoginForm;