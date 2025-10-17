"use client";
import { follow_following_Interface, follow_following_view_Interface, follower_following_action_type, follower_following_type } from '@/interfaces/follower-following-list';
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
import { useEffect, useState } from 'react';

const FollowerFollowing = ({ data, loading, handleFollowButtonClick }:
    {
        data: follow_following_view_Interface, loading: boolean,
        handleFollowButtonClick: (userId: string, task: follower_following_action_type | null) => void
    }) => {
    return (
        <Card className={`${style.card} ${style.textCenter}`}>
            <Typography className={`${style.textYelow}`}>{data?.type}</Typography>
            {loading ? <CircularProgress size={"3rem"} title='Loadig profiles' /> :
                <List>
                    {data?.list.length ? data?.list.map((profile) =>
                        <span key={profile.uid}>
                            <ListItemComponent profile={profile} currentUserUid={data.currentUserUid} type={data.type} handleFollowButtonClick={handleFollowButtonClick} />
                        </span>
                    ) : <>No profiles yet..</>
                    }
                </List >
            }
        </Card >
    )
}

const ListItemComponent = ({ profile, currentUserUid, type, handleFollowButtonClick }: { profile: follow_following_Interface, currentUserUid: string, type: follower_following_type, handleFollowButtonClick: (userId: string, task: follower_following_action_type | null) => void }) => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const [action, setAction] = useState<follower_following_action_type | null>();

    useEffect(() => {
        setAction(findAction(currentUserUid));
    }, []);

    useEffect(() => {
        setAction(findAction(currentUserUid));
    }, [loggedInUser.followers, loggedInUser.following, action]);

    const findAction = (uid: string) => {
        return type === follower_following_type.FOLLOWER ?
            (loggedInUser.following.includes(uid) ? follower_following_action_type.UNFOLLOW : null) :
            (loggedInUser.followers.includes(uid) ?
                (loggedInUser.following.includes(uid) ? follower_following_action_type.UNFOLLOW : follower_following_action_type.FOLLOW_BACK) : null);
    };
    return <ListItem
        key={profile.uid}
        secondaryAction={
            loggedInUser.uid !== currentUserUid && action &&
            < IconButton edge="end"
                onClick={() => { handleFollowButtonClick(profile.uid, action!); setAction(findAction(profile.uid)); }}
                aria-label={action?.toUpperCase()}
            >
                {action === follower_following_action_type.FOLLOW && <PersonAddAlt1Icon />}
                {action === follower_following_action_type.UNFOLLOW && <PersonRemoveAlt1Icon />}
                {action === follower_following_action_type.FOLLOW_BACK && <CompareArrowsIcon />}
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
}

export default FollowerFollowing;
