"use client";
import { RootState } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import style from './style.module.css';
import Card from "@mui/material/Card";
import Image from 'next/image';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Popover from '@mui/material/Popover';
import ProfileEditForm from '@/components/misllaneous/profile-edit-form/profile-edit-form';

const LeftPanel = () => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [profileEditPopUp, setProfileEditPopUp] = useState<HTMLElement | null>(null);

    const handleEditButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setProfileEditPopUp(event.currentTarget);
    }

    const handleCloseEdit = () => {
        setProfileEditPopUp(null);
    }

    return (
        <>
            <Card className={`${style.card} ${style.grid} ${style.textWrap}`}>
                <Card className={`${style.card} ${style.grid} ${style.textWrap} ${style.topElement} ${style.textCenter}`}>
                    <div className={`${style.section1}`}>
                        <div>
                            <p>{loggedInUser.totalPosts}</p>
                            <p>Total Posts</p>
                        </div>
                        <span className={`${style.relative} ${style.w_50}`}>
                            <Image src={loggedInUser.photoURL || "/blank-profile-picture.svg"} fill alt={loggedInUser.photoURL || "/blank-profile-picture.svg"} className={`${style.rounded_logo}`} />
                        </span>
                    </div>
                    <div>
                        <p>{loggedInUser.displayName ?? "Username"}</p>
                        <p>{loggedInUser.email ?? "email"}</p>
                    </div>
                    <Button className={`${style.button}`} onClick={handleEditButtonClick}>Edit Profile</Button>
                    <Popover
                        open={Boolean(profileEditPopUp)}
                        onClose={handleCloseEdit}
                        // anchorOrigin={{
                        // vertical: "center",
                        // horizontal: "center"
                        // }}
                        className={`${style.popover}`}
                    >
                        <ProfileEditForm />
                    </Popover>
                </Card>
            </Card>
        </>
    )
}

export default LeftPanel;