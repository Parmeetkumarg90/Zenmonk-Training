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

const MainPanel = () => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<postDbGetInterface[]>([]);

    useEffect(() => {
        getPosts();
    }, []);

    const getPosts = async () => {
        try {
            let currentUserPosts = 0;
            const postQuerySnapshot = await getDocs(collection(firestoreDb, "posts"));
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
                    currentUserPosts++;
                    dispatch(addUserPosts(post));
                }
                // const userQuerySnapshot = await getDocs(query(collection(firestoreDb, "users"), where("email", "==", post.email)));
                // console.log(post, userQuerySnapshot.metadata)
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
            <Create />
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