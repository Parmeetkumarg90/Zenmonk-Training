"use client";
import LoginForm from "@/components/form/login/login-form";
import { useEffect } from "react";
import { firestoreDb } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { removeAllPosts } from "@/redux/post/user-post";
import { useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";

export default function Home() {
  const loggedInUser = useAppSelector((state: RootState) => state.currentUser);

  useEffect(() => {
    window.addEventListener("beforeunload", handleLogout);
    return () => {
      window.removeEventListener("beforeunload", handleLogout);
    }
  }, []);

  const handleLogout = async (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = '';
    await setDoc(doc(firestoreDb, "users", loggedInUser.id), { ...loggedInUser, isOnline: false });
  }

  return (
    <LoginForm />
  );
}