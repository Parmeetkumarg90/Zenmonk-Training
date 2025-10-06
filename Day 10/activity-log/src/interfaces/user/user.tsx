interface usersInterface {
    email: string,
    password: string,
}

interface logInUserInterface {
    email: string,
    password: string,
}

interface signUpUserInterface {
    email: string,
    password: string,
    confirmPassword: string,
}

export type { logInUserInterface, signUpUserInterface, usersInterface };