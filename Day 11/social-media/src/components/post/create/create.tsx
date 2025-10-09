"use client";
import { RootState } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import Card from '@mui/material/Card';
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import style from "./style.module.css";
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postCreateSchema } from '@/schema/post/post';
import Image from 'next/image';
import { postCreateInterface } from '@/interfaces/post/user';
import Button from "@mui/material/Button";
import ToolTip from "@mui/material/Tooltip";
import AddBoxIcon from '@mui/icons-material/AddBox';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EmojiPicker from "emoji-picker-react";
import Popover from '@mui/material/Popover';
import { ChangeEvent, useRef, useState } from 'react';

const Create = () => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLElement | null>(null);
    const uploadInputRef = useRef<HTMLInputElement | null>(null);

    const { handleSubmit, reset, control, getValues, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(postCreateSchema),
        defaultValues: {
            text: "",
            images: [],
        }
    });

    const onSubmit: SubmitHandler<postCreateInterface> = (data) => {
        reset();
        console.log(data)
    }

    const handleFileSelect = () => {
        uploadInputRef.current?.click();
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setValue("images", filesArray, { shouldValidate: true });
        }
    }

    const handleEmojiSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
        setEmojiAnchorEl(event.currentTarget);
    }

    const handleEmojiSelected = (emojiObject: any) => {
        const currentText = getValues("text");
        setValue("text", currentText + emojiObject.emoji);
        handleCloseEmojiPicker();
    }

    const handleCloseEmojiPicker = () => {
        setEmojiAnchorEl(null);
    }

    return (
        <Card className={`${style.card}`}>
            <form className={`${style.form} ${style.grid}`} onSubmit={handleSubmit(onSubmit)}>
                <div className={`${style.rounded_logo} ${style.placeInRow}`}>
                    <Image src={loggedInUser.photoURL} width={50} height={50} alt={loggedInUser.photoURL} className={`${style.rounded_logo}`} />
                    <p>{loggedInUser.displayName}</p>
                    <Controller
                        control={control}
                        name="text"
                        render={({ field, fieldState: { error } }) => {
                            return (<TextField
                                {...field}
                                multiline
                                helperText={error?.message || ""}
                                className={`${style.input} ${style.pY5}`}
                                id={`filled-basic-email`}
                                label="Tell me about your friends and thoughts...."
                                variant="outlined"
                                error={!!error}
                            />);
                        }}
                    />
                </div>
                <div className={`${style.flex_evenly}`}>
                    <ToolTip title="Upload Images">
                        <Button onClick={handleFileSelect}>
                            <input
                                type='file'
                                multiple
                                accept='image/*'
                                className={style.hidden}
                                ref={uploadInputRef}
                                onChange={handleFileChange}
                            />
                            <AddBoxIcon />
                        </Button>
                    </ToolTip>
                    <ToolTip title="Emoji">
                        <Button onClick={handleEmojiSelect}>
                            <EmojiEmotionsIcon />
                        </Button>
                    </ToolTip>
                    <Popover
                        open={Boolean(emojiAnchorEl)}
                        anchorEl={emojiAnchorEl}
                        onClose={handleCloseEmojiPicker}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left"
                        }}
                    >
                        <EmojiPicker onEmojiClick={handleEmojiSelected} />
                    </Popover>
                    <ToolTip title="Post">
                        <Button type='submit'>Post</Button>
                    </ToolTip>
                </div>
                {errors.images && errors.images.message}
            </form>
        </Card>
    )
}

export default Create;