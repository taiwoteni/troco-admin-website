import { accountDetail } from "./account-detail";

export interface shortUser{
  _id:string,
  firstName:string,
  lastName:string,
  userImage:string,
  email:string
}

export interface withdrawal{
    amount:number,
    accountToBeSentTo:accountDetail,
    _id:string,
    user:shortUser,
    status:string,
    dateRequested?:string,
}

export enum WithdrawalStatus{Pending="Pending", Approved="Approved", Declined="Declined"}

export class Withdrawal {
    private data: withdrawal;
  
    constructor(withdrawal: withdrawal) {
      this.data = withdrawal;
    }
  
    get amount(): number {
      return this.data.amount;
    }

    get rawData(): withdrawal{
        return this.data;
    }
  
    get accountToBeSentTo(): accountDetail {
      return this.data.accountToBeSentTo;
    }
  
    get id(): string {
      return this.data._id;
    }
  
    get userId(): string {
      return this.data.user._id;
    }
  
    get status(): WithdrawalStatus {
      switch(this.data.status.toLowerCase().trim()){
        case 'pending':
            return WithdrawalStatus.Pending;
        case 'approved':
            return WithdrawalStatus.Approved;
        default:
            return WithdrawalStatus.Declined;        
      }
    }
  
    get creatorName(): string {
      return `${this.data.user.firstName} ${this.data.user.lastName}`;
    }
  
    get creatorImage(): string | undefined{
      const src = this.data.user.userImage.trim();
      return src.length === 0? undefined:src;

    }
  
    get time(): Date {
      return this.data.dateRequested? new Date(this.data.dateRequested): new Date();
    }
  }