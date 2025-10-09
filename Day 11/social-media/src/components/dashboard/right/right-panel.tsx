"use client";
import { logout } from '@/redux/user/currentUser';
import { RootState } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const RightPanel = () => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        Cookies.remove("credentials");
        enqueueSnackbar("Logout Success");
        router.push("/");
    }
    return (
        <div>RightPanel</div>
    )
}

export default RightPanel;