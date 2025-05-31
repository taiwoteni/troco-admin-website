import { ApiResponse } from "@/utils/interfaces/api-resonse";
import { getGateway } from "./Core";
import { AxiosResponse } from "axios";
import { Session } from "@/utils/interfaces/session";

interface Response<T=unknown> extends ApiResponse{
    chatSession?: T,
    chatsession?: T
}

export async function getChatSessions(adminId: string,throwError?: boolean){
    const result =  await getGateway(throwError).get(`/getchatsessions/${adminId}`);
    return result as AxiosResponse<Response<Session[]>, unknown>;
}

export async function getSessionMessages(sessionId: string,throwError?: boolean){
    const result =  await getGateway(throwError).get(`/getcustomercaremessages/${sessionId}`);
    return result as AxiosResponse<Response<Session>, unknown>;
}

export async function sendMessage({content, sessionId, senderId}:Record<string, string>, throwError?: boolean){
    const result =  await getGateway(throwError).post(`/sendMessage`, { sessionId, senderId, content });
    return result as AxiosResponse<unknown, unknown>;
}

export async function markAllMessagesAsRead(sessionId:string, throwError?: boolean){
    const result =  await getGateway(throwError).patch(`/mark_all_as_read__customercare/${sessionId}`);
    return result as AxiosResponse<unknown, unknown>;
}
