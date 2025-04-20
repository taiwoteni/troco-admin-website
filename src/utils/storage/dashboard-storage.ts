import { TransactionStats } from "../interfaces/transactions-stats";
import { UserStats } from "../interfaces/user-stats";
import { WalletStats } from "../interfaces/wallet-stats";

export function saveTransactionStats(stats: TransactionStats){
    if(typeof window !== 'undefined'){
        localStorage.setItem('transaction-stats', JSON.stringify(stats))
    }
}
export function saveUserStats(stats: UserStats){
    if(typeof window !== 'undefined'){
        localStorage.setItem('user-stats', JSON.stringify(stats))
    }
}
export function saveWalletStats(stats: WalletStats){
    if(typeof window !== 'undefined'){
        localStorage.setItem('wallet-stats', JSON.stringify(stats))
    }
}

export function getTransactionStats(): TransactionStats{
    if(typeof window === 'undefined'){
        return {grossEscrowIncome:0,totalTransactions:0};
    }

    const stats = localStorage.getItem('transaction-stats');
    if(!stats){
        return {grossEscrowIncome:0,totalTransactions:0};
    }

    return JSON.parse(stats) as TransactionStats;
}

export function getWalletStats(): WalletStats{
    if(typeof window === 'undefined'){
        return {totalWalletBalance:0};
    }

    const stats = localStorage.getItem('wallet-stats');
    if(!stats){
        return {totalWalletBalance:0};
    }

    return JSON.parse(stats) as WalletStats;
}
export function getUserStats(): UserStats{
    if(typeof window === 'undefined'){
        return {businessAccounts:0,companyAccounts:0,merchantAccounts:0,personalAccounts:0,totalUsers:0};
    }

    const stats = localStorage.getItem('user-stats');
    if(!stats){
        return {businessAccounts:0,companyAccounts:0,merchantAccounts:0,personalAccounts:0,totalUsers:0};
    }

    return JSON.parse(stats) as UserStats;
}