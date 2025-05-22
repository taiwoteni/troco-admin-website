import { accountDetail } from "./account-detail";
import { driver } from "./driver";
import { reportDetail,} from "./report";
import { SalesItem, salesitem } from "./sales-item";

export type TransactionCategory = 'product' | 'service' | 'virtual'

export type Transaction_Status = 'Pending' | 'InProgress' | 'Ongoing' | 'Processing' | 'Finalizing' | 'Completed' | 'Cancelled'
export interface transaction{
    _id:string,
    transactionName:string,
    location?:string,
    address?:string,
    aboutService:string,
    DateOfWork:string,
    reports?:string[],
    createdTime:string,
    updatedAt:string,
    inspectionDays:number,
    inspectionPeriod:string,
    typeOftransaction: TransactionCategory,
    status:string,
    pricing:string[],
    driverInformation:string[],
    paymentReceipt:string,
    returnedItems?: string[],
    previousStatus?:string,
    groupName:string,
    totalTransactionAmount?:number,
    adminPaymentApproved:boolean,
    creatorName:string,
    creatorImage:string,
    creator:string,
    buyer:string,
    accountDetailes:string[],
    paymentMade:boolean,
    buyerSatisfied:boolean,
}

export interface fullTransaction{
  _id:string,
  transactionName:string,
  location?:string,
  address?:string,
  aboutService:string,
  DateOfWork:string,
  reports?:reportDetail[],
  createdTime:string,
  updatedAt:string,
  inspectionDays:number,
  inspectionPeriod:string,
  typeOftransaction:string,
  status:string,
  pricing:salesitem[],
  driverInformation:driver[],
  paymentReceipt:string,
  returnedItems?:[],
  previousStatus?:string,
  groupName:string,
  totalTransactionAmount?:number,
  adminPaymentApproved:boolean,
  creatorName:string,
  creatorImage:string,
  creator:string,
  buyer:string,
  accountDetailes:accountDetail[],
  paymentMade:boolean,
  buyerSatisfied:boolean,
}

export enum TransactionType { Product="Product", Virtual="Virtual", Service="Service"}

export enum TransactionStatus {
  Pending="Pending",
  InProgress="In Progress",
  Ongoing="Ongoing",
  Processing="Processing",
  Finalizing="Finalizing",
  Completed="Completed",
  Cancelled="Cancelled",
}

const parseTransactionStatus = (value:string): TransactionStatus =>{
  switch(value.toLowerCase().trim()){
  
    case 'rejected':
      return TransactionStatus.Cancelled;
    
      default:
      return TransactionStatus[value.toLowerCase().trim() as keyof typeof TransactionStatus]
  }
}

export default class Transaction {
    private data: fullTransaction;

    constructor(data: fullTransaction) {
      this.data = data;
    }

    get rawData(): fullTransaction{
        return this.data;
    }
    
    get id(): string {
      return this.data._id;
    }

    get creatorId():string{
      return this.data.creator;
    }

    get creatorName():string{
      return this.data.creatorName;
    }

    get creatorProfile(): string{
      return this.data.creatorImage;
    }

    get buyerId():string{
      return this.data.buyer;
    }

    get previousStatus():TransactionStatus{
      return parseTransactionStatus(this.data.previousStatus ?? "pending")
    }

    get paymentMade():boolean{
      if(this.transactionType !== TransactionType.Product){
        return this.pricings.some((item)=> item.paymentMade) && this.transactionStatus !== TransactionStatus.Pending;
      }
      return this.data.paymentMade && this.transactionStatus !== TransactionStatus.Pending ;
    }

    get paymentApproved():boolean{
      if(this.transactionType !== TransactionType.Product){
        return this.currentTask.paymentApproved;
      }
      return this.data.adminPaymentApproved;
    }

    get paymentReceipt():string{
      if(this.transactionType !== TransactionType.Product){
        return this.currentTask.buyerPaidProof!
      }
      return this.data.paymentReceipt;
    }

    get hasAccountDetails():boolean{
      return this.data.accountDetailes.length !== 0
    }

    get buyerAccountDetails():accountDetail{
      return this.data.accountDetailes[0];
    }

    get transactionType(): TransactionType{
      
      switch(this.data.typeOftransaction.toLowerCase().trim()){

        case 'virtual':
          return TransactionType.Virtual
        case 'service':
          return TransactionType.Service;  
        default:
          return TransactionType.Product
      }
    }

    get transactionStatus():TransactionStatus{
      switch(this.data.status.toLowerCase().trim()){

        case 'pending':
          return TransactionStatus.Pending
        case 'in progress':
            return TransactionStatus.InProgress
        case 'ongoing':
          return TransactionStatus.Ongoing
        case 'processing':
          return TransactionStatus.Processing
        case 'finalizing':
            return TransactionStatus.Finalizing
        case 'completed':
              return TransactionStatus.Completed      
        default:
          return TransactionStatus.Cancelled
      }
    }

    get createdTime():Date{
      return new Date(this.data.createdTime)
    }

    get estimatedEnd():Date{
      return new Date(this.data.DateOfWork)
    }

    get transactionName(): string {
      return this.data.transactionName.trim();
    }

    get transactionDescription(): string{
      return this.data.aboutService;
    }

    get inspectionPeriod(): string{
      return `${this.data.inspectionDays} ${this.data.inspectionPeriod}`
    }

    get returnedItems(): SalesItem[]{
      if((this.data.returnedItems ?? []).length === 0){
        return [];
      }
      const list = [...(this.data.returnedItems?.findLast(()=> true)!["products"] ?? [])]

      return list.map((e)=> this.pricings.find((val)=> val.id === e)!);
    }

    get returnedReason(): string{
      const reason = (this.data.returnedItems?.findLast(()=> true)!["comments"]);
      return reason!;
    }

    get totalPriceReturned(): number{
      const prices = this.returnedItems.map((item)=> item.totalPrice);
      let sum = 0;
      for(const price of prices){
        sum +=price;
      }
      return sum;
    }
    
    get fullAddress(): string {
      return `${this.data.location || "No location"}`;
    }

    get pricings():SalesItem[]{
      return this.data.pricing.map((item)=> new SalesItem(item));
    }

    get totalAmount(): number{
      if(this.rawData.totalTransactionAmount){
        return this.rawData.totalTransactionAmount;
      }
      
      const prices = this.pricings.map((item)=> isNaN(item.totalPrice)? 0 : item.totalPrice);
      let sum = 0;
      for(const price of prices){
        if(typeof price === 'number'){
          sum +=price;
        }
        
      }
      return sum;
    }

    get hasDriver(): boolean{
      return this.data.driverInformation.length !== 0;
    }

    get driver(): driver{
      return this.data.driverInformation.findLast(()=>true)!
    }

    get driverApproved(): boolean{
      const statuses = [
        TransactionStatus.Ongoing,
        TransactionStatus.Finalizing,
        TransactionStatus.Completed];

        return this.hasDriver && statuses.includes(this.transactionStatus)
    }

    get returnDriver():driver{
      return this.data.driverInformation.findLast(()=> true)!;
    }

    get hasReturnDriver(): boolean{
      return this.data.driverInformation.length >1;
    }

    get pricingsName():string{
      switch(this.transactionType){
        case TransactionType.Service:
          return `Task${this.pricings.length!=1?"s":''}`
        case TransactionType.Virtual:
          return `Virtual Item${this.pricings.length!=1?"s":''}`  
        default:
          return `Product${this.pricings.length!=1?"s":''}`
      }
    }

    get buyerSatisfied():boolean{
      return this.rawData.buyerSatisfied;
    }

    get currentTask():SalesItem{
      const target = this.pricings.find((value)=>{
        return !value.tasksUploaded || !value.paymentMade  || !value.paymentApproved || !value.clientSatisfied || !value.paymentReleased;
      });
      return target?target:this.pricings.findLast(()=>true)!;
    }

    get currentTaskPosition(): number{
      if(this.transactionType === TransactionType.Product){
        return 0;
      }

      return this.pricings.map(p => p.id).indexOf(this.currentTask.id);
    }

    get completedTasks():boolean{
      const target = this.pricings.find((value)=>{
        return !value.tasksUploaded || !value.paymentMade  || !value.paymentApproved || !value.clientSatisfied || !value.paymentReleased;
      });
      
      /// If target is null or undefined, that means all the tasks have been completed.
      return !target;
    }
  
    // Add other getters for fields you want to expose or manipulate
  }
  
  

