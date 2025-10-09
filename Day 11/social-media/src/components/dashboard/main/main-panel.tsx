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
import { postCreateDbInterface } from '@/interfaces/post/user';
import { collection, getDocs, where, query } from 'firebase/firestore';
import { firestoreDb } from '@/config/firebase';
import CircularProgress from '@mui/material/CircularProgress';

const MainPanel = () => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<postCreateDbInterface[]>([]);

    useEffect(() => {
        getPosts();
    }, []);

    const getPosts = async () => {
        try {
            const postQuerySnapshot = await getDocs(collection(firestoreDb, "posts"));
            const postList: postCreateDbInterface[] = [];

            postQuerySnapshot.forEach(async (doc) => {
                const postData = doc.data();
                const post: postCreateDbInterface = {
                    email: postData.email,
                    text: postData.text,
                    imageURLs: postData.imageURLs,
                    likes: postData.likes,
                    uid: postData.uid,
                    time: postData.time,
                    displayName: postData.displayName,
                    photoURL: postData.photoURL,
                };
                // const userQuerySnapshot = await getDocs(query(collection(firestoreDb, "users"), where("email", "==", post.email)));
                // console.log(post, userQuerySnapshot.metadata)
                postList.push(post);
            });
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
                    isLoading ? <CircularProgress size={"3rem"} /> :
                        // {
                        posts.length > 0 ? posts.map((eachDoc, index) =>
                            <span key={index}>
                                <PostItem post={eachDoc} />
                            </span>
                        )
                            : <>No post</>
                }
            </div>
        </Card>
    )
}

export default MainPanel;