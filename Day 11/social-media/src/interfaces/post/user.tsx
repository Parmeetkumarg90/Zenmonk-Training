interface postCreateInterface {
    text: string,
    images: File[],
}

interface commentDbInterface {
    postId: string,
    text: string,
    parentId: string | null,
    time: number | string,
    displayName: string | null,
    photoURL: string | null,
    authorUID: string,
    thisCommentId?: string,
    replies?: commentDbInterface[]
}

interface postCreateDbInterface {
    email: string,
    text: string,
    imageURLs: string[],
    likes: string[],
    uid: string,
    time: number,
    displayName: string,
    photoURL: string,
}

interface postDbGetInterface {
    postId: string,
    email: string,
    text: string,
    imageURLs: string[],
    likes: string[],
    uid: string,
    time: number,
    displayName: string,
    photoURL: string,
}

export type { postCreateInterface, postCreateDbInterface, commentDbInterface, postDbGetInterface };