"use client";
import { RootState } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import Create from '../../post//create/create';
import style from "./style.module.css";
import Card from "@mui/material/Card";
import PostItem from '@/components/post/post-view/post-view';
import { useEffect, useState } from 'react';
import { postDbGetInterface } from '@/interfaces/post/user';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { firestoreDb } from '@/config/firebase';
import CircularProgress from '@mui/material/CircularProgress';
import { addPostsCount } from '@/redux/user/currentUser';
import { addUserPosts } from '@/redux/post/user-post';

const MainPanel = ({ userUid }: { userUid?: string }) => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<postDbGetInterface[]>([]);

    useEffect(() => {
        getAllPosts();
    }, []);

    const getAllPosts = async () => {
        try {
            let currentUserPosts = 0;
            let docRef = userUid ? query(collection(firestoreDb, "posts"), where("uid", "==", userUid)) : collection(firestoreDb, "posts");
            const postQuerySnapshot = await getDocs(docRef);
            const postList: postDbGetInterface[] = [];

            postQuerySnapshot.forEach(async (doc) => {
                const postData = doc.data();
                const post: postDbGetInterface = {
                    postId: doc.id,
                    email: postData.email,
                    text: postData.text,
                    imageURLs: postData.imageURLs,
                    likes: postData.likes,
                    uid: postData.uid,
                    time: postData.time,
                    displayName: postData.displayName,
                    photoURL: postData.photoURL,
                };
                if (loggedInUser.uid === postData.uid) {
                    post.displayName = postData.displayName;
                    post.photoURL = postData.photoURL;
                    currentUserPosts++;
                    dispatch(addUserPosts(post));
                }
                postList.push(post);
            });
            dispatch(addPostsCount({ totalPosts: currentUserPosts }));
            setPosts(postList);
        }
        catch (e) {
            console.log("Error in fetching posts: ", e);
        }
        finally {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 100);
        }
    }

    return (
        <Card className={`${style.card} ${style.grid}`}>
            {((userUid === undefined) || (userUid === loggedInUser.uid)) ? <Create /> : <span></span>}
            <div className={`${style.card} ${style.overflow_scroll}`}>
                {
                    isLoading ? <CircularProgress size={"3rem"} title='Loading Post' className={`${style.marginAuto}`} /> :
                        posts.length > 0 ? posts.map((eachDoc, index) =>
                            <span key={index}>
                                <PostItem post={eachDoc} />
                            </span>
                        )
                            : <span>No post</span>
                }
            </div>
        </Card>
    )
}

export default MainPanel;