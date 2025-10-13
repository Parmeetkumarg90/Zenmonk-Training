"use client";
import { persister, RootState } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import style from './style.module.css';
import Card from "@mui/material/Card";
import Image from 'next/image';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import Popover from '@mui/material/Popover';
import ProfileEditForm from '@/components/form/edit-form/profile-edit-form';
import { addFollowing, logout, removeFollowing } from '@/redux/user/currentUser';
import { authorizedInterface } from '@/interfaces/user/user';
import { CircularProgress } from '@mui/material';
import { collection, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestoreDb } from '@/config/firebase';
import { removeAllPosts } from '@/redux/post/user-post';
import FollowerFollowing from '@/components/list/followers-following/follower-following';
import { follow_following_Interface, follow_following_view_Interface } from '@/interfaces/follower-following-list';

const LeftPanel = ({ userUid }: { userUid?: string }) => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const [userDetail, setUserDetail] = useState<authorizedInterface>(loggedInUser);
    const [isFollowing, setFollowing] = useState<string>("");
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isModalLoading, setModalLoading] = useState<boolean>(false);
    const [profileList, setProfileList] = useState<follow_following_view_Interface | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [profileEditPopUp, setProfileEditPopUp] = useState<HTMLElement | null>(null);

    useEffect(() => {
        if (userUid) {
            getUserData();
        }
        else {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                setLoading(false);
            }, 800);
        }
    }, []);

    useEffect(() => {
        setFollowing((loggedInUser?.following?.includes(userDetail.uid) ? "Unfollow" : loggedInUser?.followers?.includes(userDetail.uid) ? "Follow Back" : "Follow"));
    }, [loggedInUser.following]);

    const getUserData = async () => {
        try {
            setLoading(true);
            const docQuery = query(collection(firestoreDb, "users"), where("uid", "==", userUid));
            const snapshot = await getDocs(docQuery);
            if (snapshot.docs.length) {
                const userData = snapshot.docs[0].data();
                // console.log(userData);
                const userDetails: authorizedInterface = {
                    email: userData.email!,
                    token: userData.token,
                    photoURL: userData.photoURL!,
                    phoneNumber: userData.phoneNumber!,
                    displayName: userData.displayName!,
                    uid: userData.uid,
                    totalPosts: userData.totalPosts,
                    followers: userData.followers,
                    following: userData.following
                };

                setUserDetail(userDetails);
                setFollowing((loggedInUser?.following?.includes(userDetails.uid) ? "Unfollow" : loggedInUser?.followers?.includes(userDetails.uid) ? "Follow Back" : "Follow"));
            }
        }
        catch (e) {
            console.log("Error in profile detail fetching: ", e);
            enqueueSnackbar("Error in profile detail fetching");
            router.push("/dashboard");
        }
        finally {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                setLoading(false);
            }, 800);
        }
    }

    const handleEditButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setProfileEditPopUp(event.currentTarget);
    }

    const handleCloseEdit = () => {
        setProfileEditPopUp(null);
    }

    const redirectToUrl = (url: string) => {
        router.push(url);
    }

    const handleLogout = () => {
        redirectToUrl("/");
        Cookies.remove("credentials");
        dispatch(removeAllPosts());
        dispatch(logout());
        enqueueSnackbar("Logout Successfully");
    }

    const handleFollowButtonClick = async () => {
        if (userUid) {
            const profileUid = userUid;
            const logInUserUid = loggedInUser.uid;
            try {
                // add uid of profileUid in our following
                const followingQuery = query(collection(firestoreDb, "users"), where("uid", "==", logInUserUid));
                const followingSnapshot = await getDocs(followingQuery);
                const followingDocRef = followingSnapshot.docs[0];
                const followingData = followingDocRef.data();
                if (!followingData.following.includes(profileUid)) {
                    followingData.following.push(profileUid);
                    dispatch(addFollowing(profileUid));
                }
                else {
                    followingData.following = followingData.following.filter((each: string) => each !== profileUid);
                    dispatch(removeFollowing(profileUid));
                }
                await updateDoc(followingDocRef.ref, { ...followingData });

                // add uid of loggedin user in his followers
                const followerQuery = query(collection(firestoreDb, "users"), where("uid", "==", profileUid));
                const followerSnapshot = await getDocs(followerQuery);
                const followerDocRef = followerSnapshot.docs[0];
                const followerData = followerDocRef.data();
                if (!followerData.followers.includes(logInUserUid)) {
                    followerData.followers.push(logInUserUid);
                }
                else {
                    followerData.followers = followerData.followers.filter((each: string) => each !== logInUserUid);
                }
                await updateDoc(followerDocRef.ref, { ...followerData });
            }
            catch (e) {
                console.log("Error in follow/unfollow operation: ", e);
                enqueueSnackbar(`Error in ${loggedInUser?.following.includes(userUid) ? "Unfollowing" : "Following"} operation`);
            }
        }
        else {
            enqueueSnackbar("Invalid Profile to follow/unfollow");
        }
    }

    const handleModalClose = () => {
        setAnchorEl(null);
    }

    const fetchProfileDetail = async (uid: string) => {
        const docQuery = query(collection(firestoreDb, "users"), where("uid", "==", uid));
        const snapshot = await getDocs(docQuery);
        const docRef = snapshot.docs;
        if (docRef.length) {
            const data = docRef[0].data();
            return ({
                uid: data.uid,
                photoURL: data.photoURL,
                displayName: data.displayName,
                email: data.email
            });
        }
        return null;
    }

    const handleModalOpen = (e: React.MouseEvent<HTMLParagraphElement>, type: string) => {
        try {
            setModalLoading(true);
            const uidList: string[] = type === "FOLLOWERS" ? userDetail.followers : type === "FOLLOWING" ? userDetail.following : [];
            const list: follow_following_Interface[] = [];
            uidList.forEach((eachUid) => {
                fetchProfileDetail(eachUid).then((result) => {
                    if (result) {
                        list.push(result);
                    }
                });
            });
            const finalList: follow_following_view_Interface = {
                list,
                type,
                currentUserUid: loggedInUser.uid
            };
            setProfileList(finalList);
        }
        catch (e) {
            console.log("Error in fetching profiles: ", e);
            enqueueSnackbar("Error in fetching profiles");
        }
        finally {
            setAnchorEl(e.currentTarget);
            setModalLoading(false)
        }
    }

    return (
        <Card className={`${style.card} ${style.grid} ${style.textWrap}`}>
            {isLoading && <CircularProgress size={"3rem"} title='Loading Profile' />}
            {!isLoading &&
                <Card className={`${style.card} ${style.grid} ${style.textWrap} ${style.topElement} ${style.textCenter}`}>
                    <div className={`${style.section1}`}>
                        <span className={`${style.relative} ${style.w_100}`}>
                            <Image src={userDetail.photoURL ?? "/blank-profile-picture.svg"} fill alt={userDetail.photoURL ?? "/blank-profile-picture.svg"} className={`${style.rounded_logo}`} />
                        </span>
                        <div>
                            <p>Total Posts: {userDetail.totalPosts}</p>
                        </div>
                    </div>
                    <div>
                        <p>{userDetail.displayName ?? "Username"}</p>
                        <p>{userDetail.email ?? "email"}</p>
                    </div>
                    {((loggedInUser.uid === userDetail.uid) || (userUid === undefined)) ?
                        <>
                            < Button className={`${style.button}`} onClick={handleEditButtonClick}>Edit Profile</Button>
                            <Popover
                                open={Boolean(profileEditPopUp)}
                                onClose={handleCloseEdit}
                                className={`${style.popover}`}
                            >
                                <ProfileEditForm />
                            </Popover>
                        </> :
                        (loggedInUser.uid !== userDetail.uid) && < Button className={`${style.button}`} onClick={handleFollowButtonClick}>{isFollowing}</Button>
                    }
                </Card>
            }
            <Card className={`${style.card} ${style.textWrap} ${style.bottomElem} ${style.textCenter}`}>
                <Popover open={!!anchorEl} onClose={handleModalClose}>
                    <FollowerFollowing data={profileList} loading={isModalLoading} />
                </Popover>
                <div className={`${style.placeInRow}`}>
                    <p className={`${style.linkModal}`} onClick={(e) => { handleModalOpen(e, "FOLLOWERS"); }}>Followers: {userDetail.followers.length}</p>
                    <p className={`${style.linkModal}`} onClick={(e) => { handleModalOpen(e, "FOLLOWING"); }}>Following: {userDetail.following.length}</p>
                </div>
                <Button onClick={() => { redirectToUrl("/dashboard"); }}>Feed</Button>
                <Button onClick={() => { redirectToUrl("/dashboard/my-posts"); }}>My Posts</Button>
                <Button onClick={handleLogout}>Logout</Button>
            </Card>
        </Card >
    );
}

export default LeftPanel;