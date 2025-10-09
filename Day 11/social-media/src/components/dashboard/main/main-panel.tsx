"use client";
import { RootState } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import Create from '../../post//create/create';
import style from "./style.module.css";
import Card from "@mui/material/Card";

const MainPanel = () => {
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
    const dispatch = useAppDispatch();
    const router = useRouter();
    return (
        <Card className={`${style.card} ${style.grid}`}>
            <Create />
            <div>hi</div>
        </Card>
    )
}

export default MainPanel;