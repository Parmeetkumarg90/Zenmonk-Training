import Image from "next/image"
import style from "./style.module.css";
import Card from "@mui/material/Card";
import UserList from "@/components/list/user-list-chat/userList";

const ChatLayout = ({ children }: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <Card className={`${style.grid}`}>
            <UserList />
            {children}
        </Card>
    )
}

export default ChatLayout