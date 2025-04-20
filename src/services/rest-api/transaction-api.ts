import { AxiosInstance, AxiosResponse } from "axios";
import { apiGateway, errorApiGateway } from "./Core";
import { ApiResponse } from "@/utils/interfaces/api-resonse";
import { transaction } from "@/utils/interfaces/transaction";
import EscrowCharge from "@/utils/interfaces/escrow-charge";

export async function getOneTransaction(transactionId: string){
    const result =  await apiGateway.get(`/getOneTransaction/${transactionId}`);
    return result as AxiosResponse<ApiResponse<transaction>, unknown>;
}

export async function getOneTransactionOrError(transactionId: string){
    const result =  await errorApiGateway.get(`/getOneTransaction/${transactionId}`);
    return result as AxiosResponse<ApiResponse<transaction>, unknown>;
}

export async function getAllTransactions(throwError?: boolean){
    const gateway: AxiosInstance = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.get(`/getalltransactions`);
    return result as AxiosResponse<ApiResponse<transaction[]>, unknown>;
}

export async function getEscrowCharge(){
    const result =  await apiGateway.get(`/getcharges`);
    return result as AxiosResponse<ApiResponse<EscrowCharge[]>, unknown>;
}
export async function getEscrowChargeOrThrow(){
    const result =  await errorApiGateway.get(`/getcharges`);
    return result as AxiosResponse<ApiResponse<EscrowCharge[]>, unknown>;
}