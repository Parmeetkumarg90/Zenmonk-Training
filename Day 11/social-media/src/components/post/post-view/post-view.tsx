import { postCreateDbInterface } from '@/interfaces/post/user';
import Card from "@mui/material/Card";
import style from "./style.module.css";
import Image from 'next/image';
import Carousal from '@/components/image-carousal/carousal';

const PostItem = ({ post, loading }: { post: postCreateDbInterface, loading?: boolean }) => {
    return (
        <Card className={`${style.card} ${style.grid} ${style.pX5} ${style.pY5}`}>
            <div className={`${style.rounded_logo} ${style.placeInRow} ${style.card}`}>
                
                {
                    post.photoURL?
                    <Image src={post.photoURL} width={50} height={50} alt={"Not present"} className={`${style.rounded_logo}`} />
                :""
                }
                <p>{post.displayName || "Name not set yet"}</p>
            </div>
            <div>{post.text}</div>
            <Carousal list={post.imageURLs} />
            <div></div>
        </Card>
    );
}

export default PostItem;