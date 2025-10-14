"use client";
import { postDbGetInterface } from '@/interfaces/post/user';
import Card from "@mui/material/Card";
import style from "./style.module.css";
import Image from 'next/image';
import Carousal from '@/components/image-carousal/carousal';
import Like from '../like/like';
import Comment from '../comment/comment';
import Button from "@mui/material/Button";
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { firestoreDb } from '@/config/firebase';
import { removeUserPost } from '@/redux/post/user-post';
import { useAppDispatch } from '@/redux/hook';
import { enqueueSnackbar } from 'notistack';
import Link from 'next/link';

const PostItem = ({ post, loading, canDelete }: { post: postDbGetInterface, loading?: boolean, canDelete?: boolean }) => {
    const [isLoading, setLoading] = useState<boolean>(!!loading);
    const [isShowComments, setShowComments] = useState<boolean>(false);
    const [isDeleted, setDeleted] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const now = new Date().getTime();
    const postTime = post.time;
    const diffMs = now - postTime;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    let timeAgo = '';
    if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        timeAgo = diffMinutes + " minutes ago";
    } else if (diffHours < 24) {
        timeAgo = diffHours + " hours ago";
    } else {
        timeAgo = diffDays + " days ago";
    }

    const deletePost = async (postId: string) => {
        try {
            setLoading(true);
            const docRef = doc(firestoreDb, "posts", postId);
            await deleteDoc(docRef);

            const commentDocRef = query(collection(firestoreDb, "comments"), where("postId", "==", postId));
            const commentSnapshots = await getDocs(commentDocRef);

            commentSnapshots.forEach(async (each) => {
                const docRef = doc(firestoreDb, "comments", each.id);
                await deleteDoc(docRef);
            });

            dispatch(removeUserPost(postId));
            setDeleted(true);
        }
        catch (e) {
            console.log("Error in post deletion: ", e);
            enqueueSnackbar("Error in post deletion");
        }
        finally {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                setLoading(false);
            }, 800);
        }
    }

    return (
        <Card className={`${style.card} ${style.grid} ${style.pX5} ${style.mY2} ${style.border}`} key={post.postId}>
            {isLoading ?
                <CircularProgress size={"3rem"} /> :
                isDeleted ? <></> :
                    <>
                        <div className={`${style.rounded_logo} ${style.placeInRow}`}>
                            <Link href={`/profile/${post.uid}`} className={`${style.placeInRow} ${style.rounded_logo} ${style.card}`}>
                                {
                                    <Image src={post.photoURL ?? "/blank-profile-picture.svg"} width={50} height={50} alt={post.photoURL ?? "blank-profile-picture.svg"} className={`${style.rounded_logo}`} />
                                }
                                <p className={`${style.boldText}`}>{post.displayName ?? "Username"}</p>
                                <p className={`${style.textYellow}`}>{timeAgo}</p>
                            </Link>
                            {canDelete && <Button onClick={() => { deletePost(post.postId); }}>Delete</Button>}
                        </div>
                        <div>{post.text}</div>
                        <Carousal list={post.imageURLs} />
                        <div className={`${style.flex_evenly} ${style.mY2}`}>
                            <Like postId={post.postId} likes={post.likes} />
                            <Button onClick={() => { setShowComments(!isShowComments); }}>Comments</Button>
                        </div>
                        {isShowComments && <Comment postId={post.postId} />}
                    </>}
        </Card >
    );
}

export default PostItem;