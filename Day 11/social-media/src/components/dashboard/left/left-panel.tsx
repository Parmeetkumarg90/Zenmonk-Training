"use client";
import { RootState } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const LeftPanel = () => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();
    return (
        <div>LeftPanel</div>
    )
}

export default LeftPanel;