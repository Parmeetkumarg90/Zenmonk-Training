enum TaskStatus {
    Completed = "completed",
    Pending = "pending",
    Deleted = "deleted"
}

interface taskInterface {
    id: string,
    name: string,
    status: TaskStatus,
}

interface errorInterface {
    title: string,
    description: string
}

export type { taskInterface, errorInterface };

export { TaskStatus };