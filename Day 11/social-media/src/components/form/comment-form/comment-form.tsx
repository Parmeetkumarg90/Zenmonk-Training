"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import style from "./style.module.css";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';
import { enqueueSnackbar } from 'notistack';
import { collection, addDoc } from 'firebase/firestore';
import { firestoreDb } from '@/config/firebase';
import { commentDbSchema } from '@/schema/post/post';
import { commentDbInterface } from '@/interfaces/post/user';
import { useState } from 'react';
import { Card, CircularProgress } from '@mui/material';


const CommentAddForm = ({ parentId, postId }: { parentId: string | null, postId: string }) => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const [isCommenting, setCommenting] = useState<boolean>(false);
    const { control, handleSubmit, watch, formState: { errors }, setValue, reset } = useForm({
        resolver: zodResolver(commentDbSchema),
        defaultValues: {
            //static
            postId,
            displayName: loggedInUser.displayName,
            photoURL: loggedInUser.photoURL,
            authorUID: loggedInUser.uid,
            //dynamic
            parentId: parentId,
            time: Date.now(),
            text: ""
        }
    });

    const onSubmit: SubmitHandler<commentDbInterface> = async (data) => {
        try {
            setCommenting(true);
            const dbRef = collection(firestoreDb, "comments");
            await addDoc(dbRef, data);
            enqueueSnackbar("Comment created Successfully");
            reset();
        }
        catch (e) {
            console.log("Error in adding comment: ", e);
            enqueueSnackbar("Error in creating comment");
        }
        finally {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                setCommenting(false);
            }, 800);
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)} className={`${style.grid}`}>
                <Typography>{parentId ? "Add your reply" : "Add Comment"}</Typography>
                <Controller
                    control={control}
                    name="text"
                    render={({ field, fieldState: { error } }) => {
                        return (<TextField
                            {...field}
                            helperText={error?.message || ""}
                            className={`${style.input} ${style.pY5}`}
                            id={`filled-basic-text`}
                            label="Text"
                            variant="outlined"
                            error={!!error}
                        />);
                    }}
                />
                {isCommenting && <CircularProgress size={"3rem"} />}
                <Button type='submit' className={`${style.button}`} disabled={isCommenting}>Submit</Button>
            </form>
        </Card>
    )
}

export default CommentAddForm;