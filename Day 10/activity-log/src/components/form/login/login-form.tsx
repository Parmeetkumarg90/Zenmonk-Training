"use client";
import { useEffect } from 'react';
import Card from '@mui/material/Card';
import style from './style.module.css';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { logInUserInterface } from '@/interfaces/user/user';
import { enqueueSnackbar } from 'notistack';
import { redirect } from 'next/navigation';
import { logInUserSchema } from '@/schema/user/user';
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';
import { addCredentials } from '@/redux/user/currentUser';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { addActivity } from '@/redux/activity-log/activity';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/config/firebase';
import { addNewUser } from '@/redux/user/users';
import { useRouter } from 'next/navigation';

function LoginForm() {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const users = useAppSelector((state: RootState) => state.users);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        const isValidLogIn = isUserValid(loggedInUser);
        if (isValidLogIn.success) {
            router.push('/dashboard');
        }
    }, []);

    const { handleSubmit, reset, control } = useForm({
        resolver: zodResolver(logInUserSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const isUserValid = (user: logInUserInterface) => {
        const isValid = logInUserSchema.safeParse(user);
        if (isValid.success) {
            const userDetail = users.find((eachUser) => eachUser.email === user.email && eachUser.password === user.password);
            if (userDetail && logInUserSchema.safeParse(userDetail).success) {
                dispatch(addCredentials(userDetail));
                return { success: true, email: userDetail?.email === user.email };
            }
        }
        return { success: false, email: null };
    }

    const onSubmit: SubmitHandler<logInUserInterface> = async (data) => {
        data.email = data.email.trim();
        data.password = data.password.trim();
        const isValidCredentials = isUserValid(data);
        if (isValidCredentials.success) {
            const isStored = await storeUserInDB(data);
            // console.log("🚀 ~ onSubmit ~ isStored:", isStored);
            if (isStored) {
                reset();
                const activityObj = {
                    email: data.email,
                    activity: "LoggedIn Account",
                    time: Date.now(),
                };
                dispatch(addActivity(activityObj));
                enqueueSnackbar("Login Success");
                router.push('/dashboard');
            }
            else {
                enqueueSnackbar("Error occured during creating of account");
            }
        }
        else {
            enqueueSnackbar("Credentials you have entered are incorrect");
        }
    };

    const storeUserInDB = async (data: logInUserInterface) => {
        return signInWithEmailAndPassword(auth, data.email, data.password).then((value) => {
            // console.log(value);
            return true;
        }).catch((error) => {
            // console.log(error);
            enqueueSnackbar(error);
            return false;
        });
    }

    const handleGoogleLogin = () => {
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
                router.push('/dashboard');
            })
            .catch((error) => {
                console.log(error);
                // enqueueSnackbar(error.message.);
            })
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
                <Card>
                    <Button onClick={handleGoogleLogin}>Login with Google</Button>
                </Card>
                <Card>
                    <Button type="submit">Login</Button>
                    <Link href="/register">
                        <Button>Create Account</Button>
                    </Link>
                </Card>
            </Card>
        </form>
    );
}

export default LoginForm;