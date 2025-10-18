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
import { collection, getDocs, where, query, limit, startAfter, QueryDocumentSnapshot, DocumentData, setDoc, doc, and, or, getDoc } from 'firebase/firestore';
import { firestoreDb } from '@/config/firebase';
import CircularProgress from '@mui/material/CircularProgress';
import { addPostsCount } from '@/redux/user/currentUser';
import { addUserPosts } from '@/redux/post/user-post';
import { authorizedInterface, typeStatus } from '@/interfaces/user/user';

const MainPanel = ({ userUid }: { userUid?: string }) => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const [currentProfileDetail, setcurrentProfileDetail] = useState<authorizedInterface | null>(null);
    const dispatch = useAppDispatch();
    const [isLoading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<postDbGetInterface[]>([]);
    const targetRef = useRef<HTMLSpanElement>(null);
    const [lastDocRef, setLastDocRef] = useState<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);


    useEffect(() => {
        initialFetch();
    }, []);

    useEffect(() => {
        getAllPosts();
    }, [currentProfileDetail]);

    const initialFetch = async () => {
        if (userUid && userUid.trim() != loggedInUser.uid) {
            const docQuery = query(collection(firestoreDb, "users"), where("uid", "==", userUid));
            const profileSnapshot = await getDocs(docQuery);
            const profileDocRef = profileSnapshot.docs[0];
            if (profileDocRef.exists()) {
                const profileData = profileDocRef.data();
                setcurrentProfileDetail({
                    email: profileData.email!,
                    token: profileData.token,
                    photoURL: profileData.photoURL!,
                    phoneNumber: profileData.phoneNumber!,
                    displayName: profileData.displayName!,
                    uid: profileData.uid,
                    totalPosts: profileData.totalPosts,
                    followers: profileData.followers,
                    following: profileData.following,
                    id: profileData.id,
                    isOnline: profileData.isOnline,
                    type: profileData.type
                });
            }
        }
    }

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
    }, [lastDocRef, hasMore, targetRef]);

    const getAllPosts = async () => {
        try {
            let docRef;
            if (currentProfileDetail && currentProfileDetail.uid != loggedInUser.uid) {
                if (currentProfileDetail.type === typeStatus.PUBLIC) {
                    docRef = !lastDocRef ?
                        query(collection(firestoreDb, "posts"), and(where("uid", "==", currentProfileDetail.uid), where("type", "==", typeStatus.PUBLIC), where("isDeleted", "==", false)), limit(5)) :
                        query(collection(firestoreDb, "posts"), and(where("uid", "==", currentProfileDetail.uid), where("type", "==", typeStatus.PUBLIC), where("isDeleted", "==", false)), startAfter(lastDocRef), limit(5));
                }
                else {
                    if (currentProfileDetail.followers.includes(loggedInUser.uid)) {
                        docRef = !lastDocRef ?
                            query(collection(firestoreDb, "posts"), where("uid", "==", currentProfileDetail.uid), limit(5)) :
                            query(collection(firestoreDb, "posts"), where("uid", "==", currentProfileDetail.uid), startAfter(lastDocRef), limit(5));
                    }
                    else {
                        docRef = null;
                    }
                }
            }
            else {
                docRef = !lastDocRef ?
                    query(collection(firestoreDb, "posts"), and(
                        or(
                            where("uid", "in", [...loggedInUser.following]),
                            where("type", "==", typeStatus.PUBLIC),
                            where("uid", "==", loggedInUser.uid),
                        ),
                        where("isDeleted", "==", false)
                    ), limit(5)) :
                    query(collection(firestoreDb, "posts"), and(
                        or(
                            where("uid", "in", [...loggedInUser.following]),
                            where("type", "==", typeStatus.PUBLIC),
                            where("uid", "==", loggedInUser.uid),
                        ),
                        where("isDeleted", "==", false)
                    ), startAfter(lastDocRef), limit(5));
            }
            if (!docRef) {
                setHasMore(false);
                setLastDocRef(null);
                return;
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
                    type: postData.type,
                    isDeleted: postData.isDeleted
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
            setPosts([...posts, ...postList].sort((a, b) => a.likes.length - b.likes.length));
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

    const addNewPost = (newPost: postDbGetInterface) => {
        setPosts([newPost, ...posts]);
    }

    const removePost = (postId: string) => {
        setPosts(posts.filter(each => each.postId !== postId));
    }

    const editPost = (postId: string, type: typeStatus) => {
        const newPosts = posts.map(each => {
            if (each.postId === postId) {
                each.type = type;
            }
            return each;
        });
        setPosts(newPosts);
    }

    return (
        <Card className={`${style.card} ${style.grid}`}>
            {((userUid === undefined) || (userUid === loggedInUser.uid)) ? <Create onPostCreated={addNewPost} /> : <span></span>}
            <Card className={`${style.card} ${style.overflow_scroll} ${style.mT3}`}>
                {
                    isLoading ? <CircularProgress size={"3rem"} title='Loading Post' className={`${style.marginAuto}`} /> :
                        posts.length > 0 ? posts.map((eachDoc, index) =>
                            <span key={index} ref={posts.length - 1 === index ? targetRef : null}>
                                <PostItem post={eachDoc} loading={isLoading} removePost={removePost} modifyPost={editPost}
                                    canDelete={userUid === loggedInUser.uid} canEdit={userUid === loggedInUser.uid}
                                />
                            </span>
                        )
                            : <></>
                }
                {!hasMore && "No more post to load....."}
            </Card>
        </Card>
    )
}

export default MainPanel;