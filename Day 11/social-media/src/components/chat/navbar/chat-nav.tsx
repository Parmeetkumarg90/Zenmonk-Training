import { userInterface } from '@/interfaces/user/user';
import style from "./style.module.css";
import Image from 'next/image';
import { Card } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { useRouter } from 'next/navigation';

const ChatNav = ({ receiverDetail, senderId }: { receiverDetail: userInterface, senderId: string }) => {
    const router = useRouter();

    return (
        <Card className={`${style.rounded_logo} ${style.card} ${style.grid}`}>
            <KeyboardArrowLeftIcon fontSize='large' onClick={() => { router.push("/chat"); }} />
            <div className={` ${style.relative}`}>
                <Image src={receiverDetail.photoURL ?? "/blank-profile-picture.svg"} fill alt={receiverDetail.photoURL ?? "blank-profile-picture.svg"} className={`${style.rounded_logo}`} />
            </div>
            <div>
                <p className={`${style.boldText}`}>{receiverDetail.displayName ?? "Username"}</p>
                <p>Status: <span className={`${style.textYellow}`}>{receiverDetail.photoURL}</span></p>
            </div>
        </Card>
    )
}

export default ChatNav;