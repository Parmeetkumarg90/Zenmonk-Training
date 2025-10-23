"use client";
import { firestoreDb } from "@/config/firebase";
import { useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";
import { Button } from "@mui/material";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import style from "./style.module.css";

const Like = ({ postId, likes, postCreatorId }: { postId: string, likes: string[], postCreatorId: string }) => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const [isLike, setLike] = useState<boolean>(likes.includes(loggedInUser.uid));

    const handleLikeChange = async () => {
        const isPresent = likes.includes(loggedInUser.uid);
        try {
            const docRef = doc(firestoreDb, "posts", postId);
            if (isPresent) {
                likes = likes.filter((uid) => uid != loggedInUser.uid);
            }
            else {
                likes.push(loggedInUser.uid);
                if (loggedInUser.id !== postCreatorId) {
                    await addDoc(collection(firestoreDb, "notification"), {
                        senderId: loggedInUser.id,
                        receiverId: postCreatorId,
                        postId: postId,
                        notificationText: `${loggedInUser.displayName} like your post`,
                    });
                }
            }
            await updateDoc(docRef, { likes });
            setLike(!isLike);
        }
        catch (error) {
            console.log("Error in liking post: ", error);
            enqueueSnackbar("Error in changing like state");
            if (isPresent) {
                likes.push(loggedInUser.uid);
            }
            else {
                likes = likes.filter((uid) => uid != loggedInUser.uid);
            }
        }
    }

    return (
        <Button onClick={handleLikeChange} className={`${style.button}`}>
            {isLike ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </Button>
    )
}

export default Like;