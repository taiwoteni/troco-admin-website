import { AxiosResponse } from "axios";
import { apiGateway, errorApiGateway } from "./Core";
import { ApiResponse } from "@/utils/interfaces/api-resonse";

type GlobalMessagePayload = {
    adminId:string,
    messageTitle:string,
    messageContent:string
}

export const markNotification = async(notificationId: string, adminId: string)=>{
    const result = await apiGateway.patch(`/marknotificationasread/${adminId}/${notificationId}`);
    return result as AxiosResponse<ApiResponse, unknown>;
}

export const markNotificationOrThrow = async(notificationId: string, adminId: string)=>{
    const result = await errorApiGateway.patch(`/marknotificationasread/${adminId}/${notificationId}`);
    return result as AxiosResponse<ApiResponse, unknown>;
}

export const broadcastMessage = async (payload: GlobalMessagePayload)=>{
    const result = await apiGateway.post(`/send_global_message/${payload.adminId}`, payload);
    return result as AxiosResponse<ApiResponse, unknown>;
}

export const broadcastMessageOrThrow = async (payload: GlobalMessagePayload)=>{
    const result = await errorApiGateway.post(`/send_global_message/${payload.adminId}`, payload);
    return result as AxiosResponse<ApiResponse, unknown>;
}