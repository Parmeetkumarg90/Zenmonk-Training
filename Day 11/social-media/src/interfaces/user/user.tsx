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
    totalPosts?: number,
}

interface signUpUserInterface {
    email: string,
    password: string,
    confirmPassword: string,
}

interface updateUserInterface {
    displayName?: string,
    phoneNumber?: number,
    photoURL?: File
}

export type { logInUserInterface, signUpUserInterface, authorizedInterface, updateUserInterface, };