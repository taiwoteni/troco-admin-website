export interface Message {
    content?: string;
    thumbnail?: string;
    attachment?: string;
    _id: string;
    profile?:string;
    sender?: string;
    readBy: string[];
    timestamp:string;
  }