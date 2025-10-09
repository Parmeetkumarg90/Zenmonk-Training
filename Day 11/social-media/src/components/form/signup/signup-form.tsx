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
import { authorizedInterface } from '@/interfaces/user/user';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { auth, provider } from '@/config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import Image from 'next/image';
import Typography from "@mui/material/Typography";
import Cookies from 'js-cookie';
import { activityActionInterface } from '@/interfaces/activity-log/activity';
import { ref, push, get, set } from "firebase/database";
import { firestoreDb } from "../../../config/firebase";
import { addDoc, collection } from 'firebase/firestore';

function SignupForm() {
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
        resolver: zodResolver(signUpUserSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const isUserSchemaPass = (user: logInUserInterface) => {
        const isValid = logInUserSchema.safeParse(user);
        if (isValid.success) {
            return { success: true };
        }
        return { success: false };
    }

    const onSubmit: SubmitHandler<signUpUserInterface> = async (data) => {
        data.email = data.email.trim();
        data.password = data.password.trim();
        const isValidCredentials = isUserSchemaPass(data);
        if (!isValidCredentials.success) {
            enqueueSnackbar("Please fill fields correctly.");
        }
        else {
            const isStored = await handleManualLogin(data);
            // console.log("🚀 ~ onSubmit ~ isStored:", isStored);
            if (isStored.success) {
                const token = await getToken();
                if (!token) {
                    enqueueSnackbar("Invalid Credentials");
                    return;
                }
                const userDetail: authorizedInterface = {
                    email: isStored.result.user.email!,
                    token: token,
                    photoURL: isStored.result.user.photoURL,
                    phoneNumber: isStored.result.user.phoneNumber,
                    displayName: isStored.result.user.displayName,
                    uid: isStored.result.user.uid,
                };
                reset();
                dispatch(addCredentials(userDetail));
                if (isStored.result.user.metadata.creationTime === isStored.result.user.metadata.lastSignInTime) {
                    await addDoc(collection(firestoreDb, "users"), userDetail);
                }
                Cookies.set("credentials", JSON.stringify(userDetail), {
                    path: "/",
                    expires: 7,
                    sameSite: "Lax",
                    secure: process.env.NODE_ENV === "production",
                });
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
            .then(async (result) => {
                const token = await getToken();
                if (!token) {
                    enqueueSnackbar("Invalid Credentials");
                    return;
                }
                const userDetail: authorizedInterface = {
                    email: result.user.email!,
                    token: token,
                    photoURL: result.user.photoURL!,
                    phoneNumber: result.user.phoneNumber!,
                    displayName: result.user.displayName!,
                    isSignWithGoogle: true,
                    uid: result.user.uid,
                };
                dispatch(addCredentials(userDetail));
                if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
                    await addDoc(collection(firestoreDb, "users"), userDetail);
                }
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
            })
    }

    const handleManualLogin = async (data: logInUserInterface) => {
        return createUserWithEmailAndPassword(auth, data.email, data.password).then((value) => {
            // console.log(value);
            return { success: true, result: value };
        }).catch((error) => {
            // console.log(error);
            enqueueSnackbar(error);
            return { success: false, result: error };
        });
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

export default SignupForm;