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
}

interface signUpUserInterface {
    email: string,
    password: string,
    confirmPassword: string,
}

export type { logInUserInterface, signUpUserInterface, authorizedInterface, };