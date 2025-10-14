import { follow_following_view_Interface } from '@/interfaces/follower-following-list';
import Grid from "@mui/material/Grid";
import CircularProgress from '@mui/material/CircularProgress';
import Card from "@mui/material/Card";
import style from "./style.module.css";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DeleteIcon from "@mui/icons-material/Delete";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';
import { enqueueSnackbar } from 'notistack';
import { query, collection, where, getDocs, updateDoc } from 'firebase/firestore';
import { firestoreDb } from '@/config/firebase';
import { addFollowing, removeFollowing } from '@/redux/user/currentUser';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const FollowerFollowing = ({ data, loading }: { data: follow_following_view_Interface, loading: boolean }) => {
    const dispatch = useAppDispatch();
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);

    const handleFollowButtonClick = async (userId: string) => {
        if (userId) {
            const profileUid = userId;
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
                enqueueSnackbar(`Error in ${loggedInUser?.following.includes(data.currentUserUid) ? "Unfollowing" : "Following"} operation`);
            }
        }
        else {
            enqueueSnackbar("Invalid Profile to follow/unfollow");
        }
    }

    return (
        <Card className={`${style.card} ${style.textCenter}`}>
            <Typography className={`${style.textYelow}`}>{data?.type}</Typography>
            {loading ?
                <CircularProgress size={"3rem"} title='Loadig profiles' /> :
                <List>
                    {data?.list.length ? data?.list.map((profile) =>
                        <ListItem
                            key={profile.uid}
                            secondaryAction={
                                < IconButton edge="end"
                                    onClick={() => { handleFollowButtonClick(profile.uid); }}
                                    aria-label={data.type === "FOLLOWERS" ?
                                        loggedInUser?.following.includes(profile.uid) ? "Unfollow" : "" :
                                        loggedInUser?.followers.includes(profile.uid) ?
                                            loggedInUser?.following.includes(profile.uid) ? "Unfollow" : "Follow Back" : ""
                                    }>
                                    {data.type !== "FOLLOWERS" ?
                                        loggedInUser?.following.includes(profile.uid) ? <PersonRemoveAlt1Icon /> : "" :
                                        loggedInUser?.followers.includes(profile.uid) ?
                                            loggedInUser?.following.includes(profile.uid) ? <PersonRemoveAlt1Icon /> : <CompareArrowsIcon /> : ""}
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <AccountBoxIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={profile.displayName ?? profile.email ?? "User"}
                            />
                        </ListItem>
                    ) : <>No profiles yet..</>}
                </List>
            }
        </Card >
    )
}

export default FollowerFollowing;
