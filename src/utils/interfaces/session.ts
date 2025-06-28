import { SessionChat } from "./session-message";

interface ShortUser{
    _id: string,
    email: string,
}

export interface Session{
    _id: string,
    user: ShortUser,
    customerCare: ShortUser,
    messages: SessionChat[],
    active: boolean,
    lastActivity: string

}