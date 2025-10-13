interface follow_following_Interface {
    uid: string,
    displayName: string,
    photoURL: string,
    email: string,
}

interface follow_following_view_Interface {
    list: follow_following_Interface[],
    currentUserUid: string,
    type: string,
}

export type { follow_following_Interface, follow_following_view_Interface };