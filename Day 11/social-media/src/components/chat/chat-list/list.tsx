"use client";
import { firestoreDb } from '@/config/firebase';
import { chatInputInterface, chatStatusInterface } from '@/interfaces/chat/chat';
import { userInterface } from '@/interfaces/user/user';
import Card from '@mui/material/Card';
import ListItem from "@mui/material/ListItem"
import { and, collection, doc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { enqueueSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import style from "./style.module.css";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Image from 'next/image';
import { useAppSelector } from '@/redux/hook';
import { RootState } from '@/redux/store';

const ChatList = ({ receiverDetail, senderId }: { receiverDetail: userInterface, senderId: string }) => {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [allMessage, setMessages] = useState<chatInputInterface[]>([]);
    const [isTyping, setTyping] = useState<boolean>(false);
    const loggedInUser = useAppSelector((state: RootState) => state.currentUser);

    useEffect(() => {
        const unsubscribeSent = onSnapshot(query(collection(firestoreDb, "chats"), and(where("senderId", "==", senderId), where("receiverId", "==", receiverDetail.id)), orderBy("time")), result => {
            const sentMessages: chatInputInterface[] = snapShotToData(result);
            const allResult: chatInputInterface[] = unqiueListMaker([...allMessage, ...sentMessages]);
            setMessages(allResult);
        });

        const unsubscribeReceived = onSnapshot(query(collection(firestoreDb, "chats"), and(where("receiverId", "==", senderId), where("senderId", "==", receiverDetail.id)), orderBy("time")), result => {
            const receivedMessages: chatInputInterface[] = snapShotToData(result);
            const allResult: chatInputInterface[] = unqiueListMaker([...allMessage, ...receivedMessages]);
            setMessages(allResult);
        });

        const unsubscribeTyping = onSnapshot(query(collection(firestoreDb, "typingStatus"), and(where("receiverId", "==", senderId), where("senderId", "==", receiverDetail.id))), result => {
            if (!result.empty) {
                const allDoc = result.docs[0].data();
                const typingStatusObj: chatStatusInterface = {
                    senderId: allDoc.senderId,
                    receiverId: allDoc.receiverId,
                    isSenderTyping: allDoc.isSenderTyping,
                    isReceiverTyping: allDoc.isReceiverTyping
                }
                if (typingStatusObj.senderId === receiverDetail.id) {
                    setTyping(typingStatusObj.isSenderTyping);
                }
            }
        });

        getMessages();
        return () => {
            unsubscribeReceived();
            unsubscribeSent();
            unsubscribeTyping();
        }
    }, []);

    const unqiueListMaker = (list: chatInputInterface[]) => {
        return list.filter((message, index, self) => index === self.findIndex(each => each.time === message.time &&
            each.text === message.text &&
            each.senderId === message.senderId &&
            each.receiverId === message.receiverId
        ));
    }

    const getMessages = async () => {
        try {
            setLoading(true);
            const sentMessagesQuery = query(collection(firestoreDb, "chats"), and(where("senderId", "==", senderId), where("receiverId", "==", receiverDetail.id)), orderBy("time"));
            const receivedMessagesQuery = query(collection(firestoreDb, "chats"), and(where("receiverId", "==", senderId), where("senderId", "==", receiverDetail.id)), orderBy("time"));
            getDocs(sentMessagesQuery).then((sentResult) => {
                getDocs(receivedMessagesQuery).then((receivedResult) => {
                    const sentMessages: chatInputInterface[] = snapShotToData(sentResult);
                    const receivedMessages: chatInputInterface[] = snapShotToData(receivedResult);
                    mergeSort(sentMessages, receivedMessages);
                })
                    .catch((error) => {
                        console.log("Error in fetching old messages: ", error);
                        enqueueSnackbar(error);
                    })
            })
                .catch((error) => {
                    console.log("Error in fetching old messages: ", error);
                    enqueueSnackbar(error);
                })
        }
        catch (e) {
            console.log("Error in fetching old messages: ", e);
            enqueueSnackbar("Error in fetching old messages");
        }
        finally {
            const timer = setTimeout(() => {
                clearTimeout(timer);
                setLoading(false);
            }, 800);
        }
    }

    const snapShotToData = (snapshot: any) => {
        const messages: chatInputInterface[] = [];
        const snapshotRef = snapshot.docs;
        snapshotRef.forEach((doc: any) => {
            const data = doc.data();
            messages.push({
                senderId: data.senderId,
                receiverId: data.receiverId,
                text: data.text,
                time: data.time,
            });
        });
        return messages;
    }

    const mergeSort = (sentMessages: chatInputInterface[], receivedMessages: chatInputInterface[]) => {
        const finalResult: chatInputInterface[] = [];
        const sentLength = sentMessages.length, receivedLength = receivedMessages.length;
        const minLength = Math.min(sentLength, receivedLength);
        let indexSent = 0, indexReceive = 0;
        while (indexSent < minLength && indexReceive < minLength) {
            if (sentMessages[indexSent].time < receivedMessages[indexReceive].time) {
                finalResult.push(sentMessages[indexSent]);
                indexSent++;
            }
            else {
                finalResult.push(receivedMessages[indexReceive]);
                indexReceive++;
            }
        }
        while (indexSent < sentLength) {
            finalResult.push(sentMessages[indexSent]);
            indexSent++;
        }
        while (indexReceive < receivedLength) {
            finalResult.push(receivedMessages[indexReceive]);
            indexReceive++;
        }
        setMessages(finalResult);
    }

    return (
        <Card className={`${style.card} ${style.flex} ${style.flexCol}`}>
            {
                isLoading ? "Loading" :
                    <>
                        {
                            allMessage.length ? allMessage.map((message) => (
                                <span key={message.time + Math.random()}
                                    className={`${style.flex} ${style.flexRow} ${message.senderId === senderId ? style.flexRight : ""}`}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Image src={(senderId === message.senderId ? loggedInUser.photoURL : receiverDetail.photoURL) ?? "/blank-profile-picture.svg"} fill alt={receiverDetail.photoURL ?? "blank-profile-picture.svg"} className={`${style.rounded_logo} ${style.relative}`} />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={message.text} secondary={new Date(message.time).toLocaleString()} className={`${style.flexRow}  ${message.senderId === senderId ? style.textRight : ""} ${style.mX2}`} />
                                </span>
                            ))
                                : "No messages yet..."
                        }
                    </>
            }
            {isTyping &&
                <span className={`${style.flex} ${style.flexRow}`}
                >
                    <ListItemAvatar>
                        <Avatar>
                            <Image src={(receiverDetail.photoURL) ?? "/blank-profile-picture.svg"} fill alt={receiverDetail.photoURL ?? "blank-profile-picture.svg"} className={`${style.rounded_logo} ${style.relative}`} />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={`${receiverDetail.displayName ?? receiverDetail.email ?? "User"} is typing`} secondary={new Date(Date.now()).toLocaleString()} className={`${style.flexRow} ${style.mX2}`} />
                </span>
            }
        </Card>
    )
}

export default ChatList;