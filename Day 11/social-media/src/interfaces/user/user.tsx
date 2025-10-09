interface logInUserInterface {
    email: string,
    password: string,
    isSignWithGoogle?: boolean,
}

interface authorizedInterface {
    email: string,
    token: string,
    isSignWithGoogle?: boolean,
}

interface signUpUserInterface {
    email: string,
    password: string,
    confirmPassword: string,
}

export type { logInUserInterface, signUpUserInterface, authorizedInterface, };