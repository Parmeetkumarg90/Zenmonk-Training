interface usersInterface {
    email: string,
    username: string,
    password: string,
}

interface logInUserInterface {
    email?: string,
    username?: string,
    password: string,
}

interface signUpUserInterface {
    email: string,
    username: string,
    password: string,
    confirmPassword: string,
}

export type { usersInterface, logInUserInterface, signUpUserInterface };