export interface walletTransaction{
    _id:string,
    transactionId?:string,
    status:string,
    createdTime?:string,
    date:string,
    amount:number,
    walletType:string,
    content:string,
}