interface logInUserInterface {
    email: string,
    password: string,
    isSignWithGoogle?: boolean,
}

interface authorizedInterface {
    email: string,
    token: string,
    photoURL: string,
    displayName: string,
    phoneNumber: string,
    isSignWithGoogle?: boolean,
    uid: string,
    totalPosts: number,
    followers: string[],
    following: string[],
    id?: string
}

interface userInterface {
    email: string,
    photoURL: string,
    displayName: string,
    uid: string,
    id: string,
}

interface signUpUserInterface {
    email: string,
    password: string,
    confirmPassword: string,
}

interface updateUserInterface {
    displayName: string | null,
    phoneNumber: string | null,
    photoURL: File | null
}

export type { logInUserInterface, signUpUserInterface, authorizedInterface, updateUserInterface, userInterface };