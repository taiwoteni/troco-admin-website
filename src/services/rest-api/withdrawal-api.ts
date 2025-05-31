import { ApiResponse } from "@/utils/interfaces/api-resonse";
import { getGateway } from "./Core";
import { AxiosResponse } from "axios";
import { withdrawal } from "@/utils/interfaces/withdrawal";

export async function getAllWithdrawals(throwError?: boolean){
    const result =  await getGateway(throwError).get(`/getallwithdraws`);
    return result as AxiosResponse<ApiResponse<withdrawal[]>, unknown>;
}

export async function approveWithdrawal({withdrawalId, adminId}:Record<string, unknown>,throwError?: boolean){
    const result =  await getGateway(throwError).patch(`/approvewithdrawal/${withdrawalId}/${adminId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function disapproveWithdrawal({withdrawalId, adminId}:Record<string, unknown>,throwError?: boolean){
    const result =  await getGateway(throwError).patch(`/disapprovewithdrawal/${withdrawalId}/${adminId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}