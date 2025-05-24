import { ApiResponse } from "@/utils/interfaces/api-resonse";
import { getGateway } from "./Core";
import { AxiosResponse } from "axios";

export async function sendChat({content, groupId, userId}: Record<string, string>, throwError?: boolean){
    const result =  await getGateway(throwError).post(`/addMessageToGroup`, {content, groupId, userId});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function markMessageAsRead({messageId, groupId, userId}: Record<string, string>, throwError?: boolean){
    const result =  await getGateway(throwError).patch(`/readrecipts`, {messageId, groupId, userId});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}