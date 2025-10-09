"use client";
import { useEffect } from 'react';
import Card from '@mui/material/Card';
import style from './style.module.css';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { logInUserInterface } from '@/interfaces/user/user';
import { enqueueSnackbar } from 'notistack';
import { logInUserSchema } from '@/schema/user/user';
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';
import { addCredentials } from '@/redux/user/currentUser';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/config/firebase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Cookies from "js-cookie";
import { firbaseDb } from '@/config/firebase';
import { ref, get, set, push } from "firebase/database";
import { activityActionInterface } from '@/interfaces/activity-log/activity';

function LoginForm() {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();

    // useEffect(() => {
    //     const isValidLogIn = isUserValid(loggedInUser);
    //     if (isValidLogIn.success) {
    //         router.push('/dashboard');
    //     }
    // }, []);

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
            return { success: true };
        }
        return { success: false };
    }

    const onSubmit: SubmitHandler<logInUserInterface> = async (data) => {
        data.email = data.email.trim();
        data.password = data.password.trim();
        const isValidCredentials = isUserValid(data);
        if (isValidCredentials.success) {
            const isStored = await handleManualLogin(data);
            if (isStored.success) {
                const token = await getToken();
                if (!token) {
                    enqueueSnackbar("Invalid Credentials");
                    return;
                }
                reset();
                const userDetail = { email: isStored.result.email!, token: token };
                dispatch(addCredentials(userDetail));
                Cookies.set("credentials", JSON.stringify(userDetail), {
                    path: "/",
                    expires: 7,
                    sameSite: "Lax",
                    secure: process.env.NODE_ENV === "production",
                });
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

    const handleManualLogin = async (data: logInUserInterface) => {
        return signInWithEmailAndPassword(auth, data.email, data.password).then((value) => {
            // console.log(value);
            return { success: true, result: value };
        }).catch((error) => {
            // console.log(error);
            enqueueSnackbar(error);
            return { success: false, result: error };
        });
    }

    const handleGoogleLogin = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const token = await getToken();
                if (!token) {
                    enqueueSnackbar("Invalid Credentials");
                    return;
                }
                const userDetail = { email: result.user.email!, token: token, isSignWithGoogle: true };
                const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
                if (isNewUser) {
                }
                dispatch(addCredentials(userDetail));
                Cookies.set("credentials", JSON.stringify(userDetail), {
                    path: "/",
                    expires: 7,
                    sameSite: "Lax",
                    secure: process.env.NODE_ENV === "production",
                });
                enqueueSnackbar("Login Success");
                router.push('/dashboard');
            })
            .catch((error) => {
                console.log(error);
                enqueueSnackbar(error.message);
            })
    }

    const newUserActivity = (email: string) => {
        const activityObj = {
            email: email,
            activity: "Register Account",
            time: Date.now(),
        };
    }

    const loggedInActivity = (email: string) => {
        const activityObj = {
            email: email,
            activity: "LoggedIn Account",
            time: Date.now(),
        };
    }

    const getToken = async () => {
        if (auth.currentUser) {
            try {
                const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ true);
                return idToken;
            } catch (error) {
                console.error("Error getting token:", error);
            }
        } else {
            console.warn("No user is currently signed in.");
        }
        return null;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className={`${style.card} ${style.grid}`}>
                <div className={`${style.text_left}`}>
                    <p className={`${style.blurText}`}>
                        Please Enter your details
                    </p>
                    <Typography>
                        Welcome Back
                    </Typography>
                </div>
                <Controller
                    control={control}
                    name="email"
                    render={({ field, fieldState: { error } }) => {
                        return (<TextField
                            {...field}
                            helperText={error?.message || ""}
                            className={`${style.input} ${style.pY5}`}
                            id={`filled-basic-email`}
                            label="Email Address"
                            variant="outlined"
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
                            className={`${style.input} ${style.pY5}`}
                            id={`filled-basic-password`}
                            label="Password"
                            variant="outlined"
                            type="password"
                            error={!!error}
                        />);
                    }}
                />
                <Button type="submit" className={`${style.button} ${style.color_w_background_b}`}>Login</Button>
                <Button onClick={handleGoogleLogin} className={`${style.button}`}>
                    <Image src="/google-favicon.svg" height={30} width={30} alt="google-favicon" className={`${style.mR}`} />
                    Login with Google
                </Button>
                <span className={`${style.blurText}`}>
                    Don't have a account? <Link href="/register" className={`${style.blueColor} ${style.underline}`}>Sign up</Link>
                </span>
            </Card>
        </form>
    );
}

export default LoginForm;