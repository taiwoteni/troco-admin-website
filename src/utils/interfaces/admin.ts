import CustomerCareSession from "./customer-care-session"
import { Group } from "./group"
import Notification from "./Notification"
import { transaction } from "./transaction"

export default interface Admin{
    active: boolean,
    blocked: boolean,
    email: string,
    password: string,
    role: AdminRole,
    notifications: string[],
    transactions: string[],
    activity: string[],
    sessions: string[],
    username: string,
    _id: string,
    groups: string[]
}

export interface FullAdmin{
    active: boolean,
    blocked: boolean,
    email: string,
    password: string,
    role: AdminRole,
    notifications: Notification[],
    sessions: CustomerCareSession[],
    transactions: transaction[],
    activity: unknown[],
    username: string,
    _id: string,
    groups: Group[]
}

export type AdminRole = "Super Admin" | "Admin" | "Customer Care" | "Secretary"