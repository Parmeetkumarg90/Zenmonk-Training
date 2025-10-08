"use client";
import { useEffect } from 'react';
import Card from '@mui/material/Card';
import style from './style.module.css';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { logInUserInterface, signUpUserInterface } from '@/interfaces/user/user';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
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
import Image from 'next/image';
import Typography from "@mui/material/Typography";
import Cookies from 'js-cookie';
import { activityActionInterface } from '@/interfaces/activity-log/activity';
import { firbaseDb } from '@/config/firebase';
import { ref, push, get, set } from "firebase/database";

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
                Cookies.set("credentials", JSON.stringify(userDetail));
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
            const isStored = await handleManualLogin(data);
            // console.log("🚀 ~ onSubmit ~ isStored:", isStored);
            if (isStored.success) {
                reset();
                dispatch(addNewUser(data));
                dispatch(addCredentials(data));
                Cookies.set("credentials", JSON.stringify(data));
                newUserActivity(data.email, isStored.user.uid);
                loggedInActivity(data.email, isStored.user.uid);
                enqueueSnackbar("Account Register Success");
                router.push('/dashboard');
            }
            else {
                enqueueSnackbar("Error occured during creating of account: ");
            }
        }
    };

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const userDetail = { email: result.user.email!, password: result.user.uid, isSignWithGoogle: true };
                const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;
                if (isNewUser) {
                    newUserActivity(result.user.email!, result.user.uid);
                }
                loggedInActivity(result.user.email!, result.user.uid);
                dispatch(addCredentials(userDetail));
                Cookies.set("credentials", JSON.stringify(userDetail));
                dispatch(addNewUser(userDetail));
                enqueueSnackbar("Login Success");
                router.push('/dashboard');
            })
            .catch((error) => {
                console.log(error);
                // enqueueSnackbar(error.message.);
            })
    }

    const handleManualLogin = async (data: logInUserInterface) => {
        return createUserWithEmailAndPassword(auth, data.email, data.password).then((value) => {
            // console.log(value);
            return { success: true, ...value };
        }).catch((error) => {
            // console.log(error);
            enqueueSnackbar(error);
            return { success: false, ...error };
        });
    }

    const newUserActivity = (email: string, uid: string) => {
        const activityObj = {
            email: email,
            activity: "Register Account",
            time: Date.now(),
        };
        dispatch(addActivity(activityObj));
        addActivityInDb(uid, activityObj);

    }

    const loggedInActivity = (email: string, uid: string) => {
        const activityObj = {
            email: email,
            activity: "LoggedIn Account",
            time: Date.now(),
        };
        dispatch(addActivity(activityObj));
        addActivityInDb(uid, activityObj);
    }

    const addActivityInDb = (uid: string, activityObj: activityActionInterface) => {
        const dbRef = ref(firbaseDb, `activities/${uid}`);
        const newActivityRef = push(dbRef);
        set(newActivityRef, {
            activity: activityObj.activity,
            time: activityObj.time,
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card className={`${style.card} ${style.grid}`}>
                <div className={`${style.text_left}`}>
                    <p className={`${style.blurText}`}>
                        Please Enter your details
                    </p>
                    <Typography>
                        Join Us
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
                <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field, fieldState: { error } }) => {
                        return (<TextField
                            {...field}
                            helperText={error?.message || ""}
                            className={`${style.input} ${style.pY5}`}
                            id={`filled-basic-confirmPassword`}
                            label="Confirm Password"
                            variant="outlined"
                            type="password"
                            error={!!error}
                        />);
                    }}
                />
                <Button type="submit" className={`${style.button}  ${style.color_w_background_b}`}>Signup</Button>
                <Button onClick={handleGoogleSignIn} className={`${style.button}`}>
                    <Image src="/google-favicon.svg" height={30} width={30} alt="google-favicon" className={`${style.mR}`} />
                    Signup with Google
                </Button>
                <span className={`${style.blurText}`}>
                    Already have an account? <Link href="/" className={`${style.blueColor} ${style.underline}`}>Login</Link>
                </span>
            </Card>
        </form>
    );
}

export default LoginForm;