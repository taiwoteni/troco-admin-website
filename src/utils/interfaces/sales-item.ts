export interface salesitem{
    _id:string,
    name?:string,
    serviceName?:string,
    productName?:string,
    virtualName?:string,
    price:number,
    category:string,
    productCondition:string,
    quantity:number,
    pricingImage:string[],
    finalPrice:number,
    escrowCharges:number,
    escrowPercentage:number,
    // the following are parameters that apply to
    // virtual and service pricings
    description?:string,
    serviceRequirement?:string,
    virtualRequirement?:string,
    proofOfWork?:string[],
    buyerPaid?:boolean,
    taskStatus?:string,
    payStatus?:string,
    deadlineTime?:string,
    buyerPaidProof?:string,
    paymentReleased?:boolean,
    clientSatisfied?:boolean

}

export enum TaskStatus {
    Pending = "pending",
    Submitted = "submitted",
    Accepted = "accepted",
    Rejected = "rejected",
}

/// in case it is needed
export class SalesItem{
    
    constructor(private salesItem:salesitem){}

    get id(): string {
        return this.salesItem._id;
    }

    get name(): string {
        return this.salesItem.name ?? this.salesItem.productName ?? this.salesItem.serviceName ?? this.salesItem.virtualName!;
    }

    get escrowFee(): number{
        return this.salesItem.escrowCharges;
    }

    get proofOfWork():string[]{
        if(!this.salesItem.proofOfWork){
            return [];
        }
        return this.salesItem.proofOfWork;
    }

    get finalPrice(): number{
        return this.salesItem.finalPrice;
    }

    get productCondition(): string{
        return this.salesItem.productCondition;
    }

    get quality(): string{
        return this.salesItem.category;
    }

    get requirement(): string{
        return this.salesItem.serviceRequirement ?? this.salesItem.virtualRequirement!;
    }

    get totalPrice(): number{
        return this.finalPrice * this.quantity;
    }

    get price(): number {
        return this.salesItem.price;
    }

    get quantity(): number {
        return this.salesItem.quantity;
    }

    get getImages(): string[] {
        return this.salesItem.pricingImage ?? [];
    }

    get hasImages(): boolean{
        return this.salesItem.pricingImage.length !== 0;
    }

    get mainImage(): string | undefined{
        return this.getImages.length >0? this.getImages[0]:undefined;
    }

    get description(): string | undefined {
        return this.salesItem.description;
    }
    
    get status(): TaskStatus | undefined {
        switch(this.salesItem.taskStatus?.toLowerCase().trim()){
            case 'submitted':
                return TaskStatus.Submitted;
            case 'accepted':
                return TaskStatus.Accepted;
            case 'rejected':
                return TaskStatus.Rejected;
            default:
                return TaskStatus.Pending;            
        }
    }
    get paymentStatus(): TaskStatus{
        switch(this.salesItem.payStatus?.toLowerCase().trim() ?? "pending"){
            case 'submitted':
                return TaskStatus.Submitted;
            case 'accepted':
                return TaskStatus.Accepted;
            case 'rejected':
                return TaskStatus.Rejected;
            default:
                return TaskStatus.Pending;            
        }
    }
    
    get deadline(): Date{
        return this.salesItem.deadlineTime? new Date(this.salesItem.deadlineTime) : new Date();
    }

    get buyerPaidProof(): string | undefined {
        return this.salesItem.buyerPaidProof;
    }

    get paymentMade():boolean{
        return !!this.salesItem.buyerPaid;
    }

    get tasksUploaded():boolean{
        return this.proofOfWork.length !== 0;
    }

    get paymentReleased(): boolean | undefined {
        return this.salesItem.paymentReleased;
    }

    get taskRejected():boolean{
        return this.status === TaskStatus.Rejected
    }

    get paymentApproved():boolean{
        return this.paymentStatus === TaskStatus.Accepted
    }

    get clientSatisfied(): boolean | undefined {
        return this.salesItem.clientSatisfied;
    }

}