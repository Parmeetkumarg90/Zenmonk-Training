interface usersActivityInterface {
    email: string,
    log: activityInterface[]
}

interface activityInterface {
    activity: string,
    time: string
}

interface activityActionInterface {
    email: string,
    activity: string,
    time: string
}

export type { activityInterface, usersActivityInterface, activityActionInterface };