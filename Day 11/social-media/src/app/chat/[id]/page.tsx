"use client";
import Card from "@mui/material/Card";
import style from "./style.module.css";
import ChatNav from "@/components/chat/navbar/chat-nav";
import ChatInput from "@/components/chat/input/char-input";
import ChatList from "@/components/chat/chat-list/list";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";
import { CircularProgress } from "@mui/material";
import { userInterface } from "@/interfaces/user/user";
import { doc, getDoc } from "firebase/firestore";
import { firestoreDb } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const SpecificChat = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const loggedInUser = useAppSelector((state: RootState) => state.currentUser);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [receiverDetail, setReceiverDetail] = useState<userInterface | null>(null);

  useEffect(() => {
    getReceiverDetail();
  }, []);

  const getReceiverDetail = async () => {
    try {
      const { id } = await params;
      const docRef = doc(firestoreDb, "users", id);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const docDetail = docSnapshot.data();
        const receiverDetail: userInterface = {
          email: docDetail.email,
          photoURL: docDetail.photoURL,
          displayName: docDetail.displayName,
          uid: docDetail.uid,
          id: docSnapshot.id,
        };
        setReceiverDetail(receiverDetail);
      }
      else {
        enqueueSnackbar("Invalid Profile for chat");
        router.push('/chat');
      }
    }
    catch (e) {
      console.log("Error in finding user id: ", e);
    }
    finally {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        setLoading(false);
      }, 800);
    }
  }

  return (
    <Card className={`${style.grid}`}>
      {
        isLoading ? <CircularProgress size={"3rem"} title="Loading chat area" /> :
          <>
            <ChatNav senderId={loggedInUser.id!} receiverDetail={receiverDetail!} />
            <ChatList senderId={loggedInUser.id!} receiverDetail={receiverDetail!} />
            <ChatInput senderId={loggedInUser.id!} receiverDetail={receiverDetail!} />
          </>
      }
    </Card>
  )
}

export default SpecificChat;