import { shortUser } from "./withdrawal";

export interface bonus{
    user:shortUser,
    _id:string,
    amount:number,
    dateSent:string,
    description:string,
}