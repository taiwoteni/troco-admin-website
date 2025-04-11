export default interface Admin{
    active: boolean,
    blocked: boolean,
    email: string,
    password: string,
    role: AdminRole,
    transactions: string[],
    activity: string[],
    username: string,
    _id: string,
    groups: string[]
}

type AdminRole = "Super Admin" | "Admin" | "Customer Care" | "Secretary"