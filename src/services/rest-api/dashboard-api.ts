import { AxiosInstance, AxiosResponse } from "axios";
import { apiGateway, errorApiGateway } from "./Core";
import { TransactionStats } from "@/utils/interfaces/transactions-stats";
import { WalletStats } from "@/utils/interfaces/wallet-stats";
import { UserStats } from "@/utils/interfaces/user-stats";

export async function getTransactionStats(throwError?: boolean){
    const gateway: AxiosInstance = throwError? errorApiGateway : apiGateway;

    const result = await gateway.get(`/total_transactions_stats`);
    return result as AxiosResponse<TransactionStats, unknown>;
}

export async function getWalletStats(throwError?: boolean){
    const gateway: AxiosInstance = throwError? errorApiGateway : apiGateway;

    const result = await gateway.get(`/total_wallet_balance`);
    return result as AxiosResponse<WalletStats, unknown>;
}

export async function getUserStats(throwError?: boolean){
    const gateway: AxiosInstance = throwError? errorApiGateway : apiGateway;

    const result = await gateway.get(`/total_users_stats`);
    return result as AxiosResponse<UserStats, unknown>;
}