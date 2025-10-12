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

const PostItem = ({ post, loading }: { post: postDbGetInterface, loading?: boolean }) => {
    const [isShowComments, setShowComments] = useState<boolean>(false);
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

    return (
        <Card className={`${style.card} ${style.grid} ${style.pX5} ${style.pY5}`} key={post.postId}>
            <div className={`${style.rounded_logo} ${style.placeInRow} ${style.card}`}>
                {
                    <Image src={post.photoURL ?? "/blank-profile-picture.svg"} width={50} height={50} alt={post.photoURL ?? "blank-profile-picture.svg"} className={`${style.rounded_logo}`} />
                }
                <p>{post.displayName ?? "Username"}</p>
                <p>{timeAgo}</p>
            </div>
            <div>{post.text}</div>
            <Carousal list={post.imageURLs} />
            <div className={`${style.flex_evenly} ${style.mY2}`}>
                <Like postId={post.postId} likes={post.likes} />
                <Button onClick={() => { setShowComments(!isShowComments); }}>Comments</Button>
            </div>
            {isShowComments && <Comment postId={post.postId} />}
        </Card>
    );
}

export default PostItem;