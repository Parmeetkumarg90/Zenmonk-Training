interface notificationInterface {
    senderId: string,
    receiverId: string,
    postId: string | null,
    notificationText: string,
}

export type { notificationInterface };