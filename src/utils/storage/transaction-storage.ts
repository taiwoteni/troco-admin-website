import { transaction } from "../interfaces/transaction";

export function saveTransactions(transactions: transaction[]){
    if(typeof window !== 'undefined'){
        localStorage.setItem('transactions', JSON.stringify(transactions))
    }
}

export function getTransactions(): transaction[]{
    if(typeof window === 'undefined'){
        return [];
    }

    return JSON.parse(localStorage.getItem('transactions') ?? '[]') as transaction[];
}