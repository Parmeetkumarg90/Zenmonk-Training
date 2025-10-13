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

const UserPost = () => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<postDbGetInterface[]>([]);
    const allPosts = useAppSelector((state: RootState) => state.posts);

    useEffect(() => {
        getPosts();
    }, []);

    const getPosts = async () => {
        try {
            setPosts(allPosts);
        }
        catch (e) {
            console.log("Error in fetching users post: ", e);
            enqueueSnackbar("User's post fetching error");
        }
        finally {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                setLoading(false);
            }, 800);
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
    );
}

export default UserPost;