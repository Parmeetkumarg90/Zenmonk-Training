"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Button from "@mui/material/Button";
import style from "./style.module.css";

const Carousal = ({ list }: { list: string[] }) => {
    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        // const timer = setInterval(() => {
        //     setIndex(nextCorrectIndex());
        // }, 100);
    }, []);

    const nextCorrectIndex = () => {
        const isTurn = (index + 1) % list.length;
        return isTurn;
    }

    const previousCorrectIndex = () => {
        const isTurn = index - 1;
        return isTurn < 0 ? list.length - 1 : isTurn;
    }

    return (
        <>
            {
                list.length > 0 &&
                < div className={`${style.card}`
                }>
                    {
                        list.length > 1 &&
                        <Button onClick={() => { setIndex(previousCorrectIndex()); }} className={`${style.arrow} ${style.absolute} ${style.leftArrow}`}>
                            <KeyboardArrowLeftIcon fontSize='large' titleAccess='Previous' />
                        </Button>
                    }
                    < Image src={list[index] ?? "/broken-image.png"} fill alt={list[index] ?? "/broken-image.png"} key={index} />
                    {
                        list.length > 1 &&
                        <Button onClick={() => { setIndex(nextCorrectIndex()); }} className={`${style.arrow} ${style.absolute} ${style.rightArrow}`}>
                            <KeyboardArrowRightIcon fontSize='large' titleAccess='Next' />
                        </Button>
                    }
                </div >
            }
        </>
    );
}

export default Carousal;