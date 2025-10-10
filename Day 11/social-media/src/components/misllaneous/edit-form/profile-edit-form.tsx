"use client";
import { updateUserSchema } from '@/schema/user/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserInterface } from '@/interfaces/user/user';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import style from "./style.module.css";
import { useEffect, useState } from 'react';
import Typography from "@mui/material/Typography";
import { useAppSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';

const ProfileEditForm = () => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const [isSameValues, setSameValues] = useState<boolean>(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            displayName: loggedInUser.displayName,
            phoneNumber: Number(loggedInUser.phoneNumber),
        }
    });

    const onSubmit: SubmitHandler<updateUserInterface> = (data) => {
        console.log("submitted data: ", data);
    }

    console.log("🚀 ~ ProfileEditForm ~ errors:", errors)
    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`${style.grid}`}>
            <Typography>Welcome, Update Profile</Typography>
            <Controller
                control={control}
                name="displayName"
                render={({ field, fieldState: { error } }) => {
                    return (<TextField
                        {...field}
                        helperText={error?.message || ""}
                        className={`${style.input} ${style.pY5}`}
                        id={`filled-basic-displayName`}
                        label="Display Name"
                        variant="outlined"
                        error={!!error}
                    />);
                }}
            />
            <Controller
                control={control}
                name="phoneNumber"
                render={({ field, fieldState: { error } }) => {
                    console.log(field, error)
                    return (<TextField
                        {...field}
                        helperText={error?.message || ""}
                        className={`${style.input} ${style.pY5} ${style.no_spinners}`}
                        id={`filled-basic-phoneNumber`}
                        label="Phone Number"
                        variant="outlined"
                        type="number"
                        error={!!error}
                    />);
                }}
            />
            <span>
                <input type='file' accept='image/*' name='photoURL' />
                {errors.photoURL && errors.photoURL.message}
            </span>
            {isSameValues ? "Please update your data" : ""}
            <Button type='submit' className={`${style.button}`}>Update Profile</Button>
        </form>
    )
}

export default ProfileEditForm;