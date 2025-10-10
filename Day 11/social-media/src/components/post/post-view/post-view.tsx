import { postDbGetInterface } from '@/interfaces/post/user';
import Card from "@mui/material/Card";
import style from "./style.module.css";
import Image from 'next/image';
import Carousal from '@/components/image-carousal/carousal';
import Like from '../like/like';
import Comment from '../comment/comment';

const PostItem = ({ post, loading }: { post: postDbGetInterface, loading?: boolean }) => {
    const postTimeDifference = new Date(Date.now() - post.time).getHours();

    return (
        <Card className={`${style.card} ${style.grid} ${style.pX5} ${style.pY5}`} key={post.postId}>
            <div className={`${style.rounded_logo} ${style.placeInRow} ${style.card}`}>
                {
                    <Image src={post.photoURL ?? "/blank-profile-picture.svg"} width={50} height={50} alt={post.photoURL ?? "blank-profile-picture.svg"} className={`${style.rounded_logo}`} />
                }
                <p>{post.displayName ?? "Username"}</p>
                <p>{postTimeDifference < 24 ? postTimeDifference + " hours ago" : postTimeDifference / 24 + " days ago"}</p>
            </div>
            <div>{post.text}</div>
            <Carousal list={post.imageURLs} />
            <div className={`${style.flex_evenly} ${style.mY2}`}>
                <Like postId={post.postId} likes={post.likes} />
                <Comment />
            </div>
        </Card>
    );
}

export default PostItem;