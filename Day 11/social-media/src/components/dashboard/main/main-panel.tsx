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
import { useCallback, useEffect, useRef, useState } from 'react';
import { postDbGetInterface } from '@/interfaces/post/user';
import { collection, getDocs, where, query, limit, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firestoreDb } from '@/config/firebase';
import CircularProgress from '@mui/material/CircularProgress';
import { addPostsCount } from '@/redux/user/currentUser';
import { addUserPosts } from '@/redux/post/user-post';

const MainPanel = ({ userUid }: { userUid?: string }) => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<postDbGetInterface[]>([]);
    const targetRef = useRef<HTMLSpanElement>(null);
    const [lastDocRef, setLastDocRef] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        getAllPosts();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore) {
                    getAllPosts();
                }
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 1,
            }
        );
        if (targetRef.current) {
            observer.observe(targetRef.current);
        }
        return () => {
            if (targetRef.current) {
                observer.unobserve(targetRef.current);
            }
        };
    }, [lastDocRef]);

    const getAllPosts = async () => {
        try {
            let docRef = userUid && userUid.trim() != "" ?
                query(collection(firestoreDb, "posts"), where("uid", "==", userUid), limit(5)) :
                query(collection(firestoreDb, "posts"), limit(5));
            if (lastDocRef) {
                docRef = userUid && userUid.trim() != "" ?
                    query(collection(firestoreDb, "posts"), where("uid", "==", userUid), limit(5), startAfter(lastDocRef)) :
                    query(collection(firestoreDb, "posts"), limit(5), startAfter(lastDocRef));
            }
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
                    dispatch(addUserPosts(post));
                }
                postList.push(post);
            });
            if (postQuerySnapshot.empty) {
                setHasMore(false);
                setLastDocRef(null);
            }
            else {
                setHasMore(true);
                setLastDocRef(postQuerySnapshot.docs[postQuerySnapshot.docs.length - 1]);
            }
            setPosts([...posts, ...postList]);
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
            {((userUid === undefined) || (userUid === loggedInUser.uid)) ? <Create onPostCreated={getAllPosts} /> : <span></span>}
            <Card className={`${style.card} ${style.overflow_scroll} ${style.mT3}`}>
                {
                    isLoading ? <CircularProgress size={"3rem"} title='Loading Post' className={`${style.marginAuto}`} /> :
                        posts.length > 0 ? posts.map((eachDoc, index) =>
                            <span key={index} ref={posts.length - 1 === index ? targetRef : null}>
                                <PostItem post={eachDoc} />
                            </span>
                        )
                            : <span>No post</span>
                }
                {!hasMore && "No more post to load....."}
            </Card>
        </Card>
    )
}

export default MainPanel;