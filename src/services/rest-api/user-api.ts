import { user } from "@/utils/interfaces/user";
import { AxiosResponse } from "axios";
import { apiGateway, errorApiGateway } from "./Core";
import { ApiResponse } from "@/utils/interfaces/api-resonse";
import { referral } from "@/utils/interfaces/referral";
import { walletTransaction } from "@/utils/interfaces/wallet-transaction";
import { ReportUserResponse } from "@/utils/interfaces/report";

export async function getAllUsers(throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.get(`/getallusers`);
    return result as AxiosResponse<ApiResponse<user[]>, unknown>;
}

export async function getReportedUsers(throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.get(`/get_reported_users`);
    return result as AxiosResponse<ReportUserResponse, unknown>;
}

export async function getOneUser(userId: string,throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.get(`/findoneuser/${userId}`);
    return result as AxiosResponse<ApiResponse<user>, unknown>;
}

export async function getUserReferralHistory(userId: string, throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.get(`/getreferred_users/${userId}`);
    return result as AxiosResponse<ApiResponse<referral[]>, unknown>;
}
export async function getWalletHistory(userId: string, throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.get(`/getwallethistory/${userId}`);
    return result as AxiosResponse<ApiResponse<walletTransaction[]>, unknown>;
}

export async function sendMessageToUser(userId: string, adminId: string, messageContent:string, throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.post(`/send_user_message/${adminId}/${userId}`, {messageContent});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function updateUser(userId: string, newData: user, throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.patch(`/updateuser/${userId}`, newData);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function blockUser(userId: string, adminId: string, throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.patch(`/blockUser/${userId}/${adminId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function unblockUser(userId: string, adminId: string, throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.patch(`/unblockUser/${userId}/${adminId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function deleteUser(userId: string, throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.delete(`/deleteuser/${userId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function sendWalletBonus(userId: string, amount:number, description: string, type: 'bonus' | 'refund', throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.post(`/send_bonuses/${userId}`, {amount, description, type});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function revertKYC(userId: string, throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.delete(`/revert_kyc/${userId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function rejectKYC(userId: string, adminId: string, throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.patch(`/rejectkyc/${userId}/${adminId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function approveKYC(userId: string, adminId: string, throwError?: boolean){
    const gateway = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.patch(`/approvekyc/${userId}/${adminId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

