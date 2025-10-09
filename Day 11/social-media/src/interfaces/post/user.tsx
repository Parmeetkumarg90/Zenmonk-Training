interface postCreateInterface {
    text: string,
    images: File[],
}

interface commentDbInterface {
    postId: string,
    text: string,
    parentId: string,
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

export type { postCreateInterface, postCreateDbInterface, commentDbInterface };