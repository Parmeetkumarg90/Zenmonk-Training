interface usersActivityInterface {
    email: string,
    log: activityInterface[]
}

interface activityInterface {
    activity: string,
    time: number
}

interface activityActionInterface {
    email: string,
    activity: string,
    time: number
}

export type { activityInterface, usersActivityInterface, activityActionInterface };