import { Message } from "./message";

export interface Group {
    name: string;
    deadlineTime: string;
    creationTime: string;
    useDelivery: boolean;
    adminId: string;
    _id: string;
    members:string[];
    messages: Message[];
    creator: string;
  }