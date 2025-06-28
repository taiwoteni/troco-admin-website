import { AxiosInstance, AxiosResponse } from "axios";
import { apiGateway, errorApiGateway, getGateway } from "./Core";
import { ApiResponse } from "@/utils/interfaces/api-resonse";
import { fullTransaction, transaction } from "@/utils/interfaces/transaction";
import EscrowCharge from "@/utils/interfaces/escrow-charge";
import { reportDetail } from "@/utils/interfaces/report";

export async function getOneTransaction(transactionId: string, throwError?: boolean){
    const gateway: AxiosInstance = throwError? errorApiGateway : apiGateway;

    const result =  await gateway.get(`/getOneTransaction/${transactionId}`);
    return result as AxiosResponse<ApiResponse<fullTransaction>, unknown>;
}

export async function getOneTransactionOrError(transactionId: string){
    const result =  await errorApiGateway.get(`/getOneTransaction/${transactionId}`);
    return result as AxiosResponse<ApiResponse<fullTransaction>, unknown>;
}

export async function getAllTransactions(throwError?: boolean){
    const gateway: AxiosInstance = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.get(`/getalltransactions`);
    return result as AxiosResponse<ApiResponse<transaction[]>, unknown>;
}

export async function getReportedTransactions(throwError?: boolean){
    const gateway: AxiosInstance = throwError? errorApiGateway : apiGateway;
    
    const result = await gateway.get(`/get_all_reported_transactions`);
    return result as AxiosResponse<ApiResponse<reportDetail[]>, unknown>;
}

export async function getEscrowCharge(){
    const result =  await apiGateway.get(`/getcharges`);
    return result as AxiosResponse<ApiResponse<EscrowCharge[]>, unknown>;
}
export async function getEscrowChargeOrThrow(){
    const result =  await errorApiGateway.get(`/getcharges`);
    return result as AxiosResponse<ApiResponse<EscrowCharge[]>, unknown>;
}
export async function updateEscrowCharge({ category, percentage}: Record<string, unknown>, throwError?: boolean){
    const result =  await getGateway(throwError).post(`/updateescrowcharge`, {category, percentage});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}


// Driver Endpoints

export async function approveDriverDetails({ sellerId,transactionId,buyerId, adminId, status }: Record<string, string>, throwError?: boolean){
    const result =  await getGateway(throwError).patch(`/approvedriverinformation/${sellerId}/${transactionId}/${buyerId}/${adminId}`, {status});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function revertDriverDetails({ sellerId, transactionId, buyerId, adminId}: Record<string, string>, throwError?: boolean){
    const result = await getGateway(throwError).patch(`/revertdriverinformation/${sellerId}/${transactionId}/${buyerId}/${adminId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}


// Payment Endpoints
export async function revertPayment({ transactionId}: Record<string, string>, throwError?: boolean){
    const result =  await getGateway(throwError).patch(`/revert-product-pay/${transactionId}`, {status});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function approveServicePayment({transactionId,taskId,adminId,transactionType}: Record<string, string>, throwError?: boolean){
    const result =  await getGateway(throwError).patch(`/accept_service_payment/${transactionId}/${taskId}/${adminId}`,{transactionType});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function rejectServicePayment({transactionId,taskId,adminId,transactionType}: Record<string, string>, throwError?: boolean){
    const result = await getGateway(throwError).patch(`/reject_service_payment/${transactionId}/${taskId}/${adminId}`,{transactionType});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}



// Transaction Status Endpoints

export async function updateTransactionStatus({ transactionId, adminId, buyerId, status }: Record<string, string>, throwError?: boolean){
    const result =  await getGateway(throwError).patch(`/adminupdatestatus/${transactionId}/${adminId}/${buyerId}`, {status});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function revertTransactionStatus({ transactionId, adminId }: Record<string, string>, throwError?: boolean){
    const result =  await getGateway(throwError).patch(`/revert-changes/${adminId}/${transactionId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function completeTransaction({ transactionId, sellerId, adminId, status }: Record<string, string>, throwError?: boolean){
    const result =  await getGateway(throwError).patch(`/updatetocompleted/${transactionId}/${sellerId}/${adminId}`, {status});
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}

export async function cancelTransaction({ transactionId, adminId }: Record<string, string>, throwError?: boolean){
    const result =  await getGateway(throwError).patch(`/canscel_transaction_admin/${adminId}/${transactionId}`);
    return result as AxiosResponse<ApiResponse<unknown>, unknown>;
}