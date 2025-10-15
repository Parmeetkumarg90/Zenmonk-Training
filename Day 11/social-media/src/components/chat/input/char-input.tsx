import { userInterface } from '@/interfaces/user/user';
import style from "./style.module.css";
import Image from 'next/image';
import { Card } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { useRouter } from 'next/navigation';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { chatInputSchema } from '@/schema/chat/chat';
import { commentDbInterface } from '@/interfaces/post/user';
import { chatInputInterface } from '@/interfaces/chat/chat';
import TextField from "@mui/material/TextField";
import { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { addDoc, collection } from 'firebase/firestore';
import { firestoreDb } from '@/config/firebase';

const ChatInput = ({ receiverDetail, senderId }: { receiverDetail: userInterface, senderId: string }) => {
    const [isSubmitDisabled, setSubmitDisabled] = useState<boolean>(false);
    const { control, formState: { errors }, handleSubmit, reset } = useForm({
        resolver: zodResolver(chatInputSchema),
        defaultValues: {
            senderId,
            receiverId: receiverDetail.id,
            text: "",
            time: 0
        }
    });

    const onSubmit: SubmitHandler<chatInputInterface> = async (data) => {
        if (isSubmitDisabled) {
            enqueueSnackbar("Try to send this previous message");
            return;
        }
        try {
            setSubmitDisabled(true);
            data.time = Date.now();
            const docRef = collection(firestoreDb, "chats");
            addDoc(docRef, data).then((result) => {
                reset();
            }).catch((error) => {
                enqueueSnackbar("Error in sending message", error);
            });
        }
        catch (e) {
            console.log("Error in sending message: ", e);
            enqueueSnackbar("Error in sending message");
        }
        finally {
            setSubmitDisabled(false);
        }
    }

    const router = useRouter();
    return (
        <Card>
            <form className={`${style.card} ${style.grid} ${style.border}`} onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="text"
                    render={({ field, fieldState: { error } }) => (<TextField
                        {...field}
                        multiline
                        className={`${style.input}`}
                        helperText={error?.message ?? ""}
                        id={`filled-basic-text`}
                        label="Enter your message here"
                        variant="outlined"
                        error={!!error}
                    />)
                    }
                />
                <KeyboardArrowRightIcon fontSize='large' className={`${style.pointer}`} onClick={handleSubmit(onSubmit)} />
            </form>
        </Card>
    )
}

export default ChatInput;