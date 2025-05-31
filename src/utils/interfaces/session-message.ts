export interface SessionChat{
    _id: string,
    attachment?: string,
    thumbnail?: string,
    content: string,
    sender?: string,
    timestamp: string,
    read: boolean,
}