import { Group } from "../../components/groups/GroupItemLayout";
import { isAfter, isBefore } from "../DateUtils";
import { reportHolder } from "./report";
import Transaction, { transaction } from "./transaction";

export interface user{
    _id:string,
    firstName:string,
    lastName:string,
    userImage:string,
    email:string,
    reports:reportHolder,
    referralCode:string,
    phoneNumber:string,
    refferal?:any,
    BusinessName:string,
    accountType?:string,
    kycDocuments?:any,
    address:string,
    lastSeen:string,
    city:string,
    state:string,
    zipcode:string,
    nearestBustop:string,
    kyccurrentTier:number,
    kycTier:number,
    wallet:number,
    groups:Group[] | string[],
    transactions:transaction[] | string[],
    createdAt?:string,
    blocked:boolean
} 

export class User {
    // Private field to hold the user object
    private data: user;
  
    // Constructor that accepts an object of type `user`
    constructor(data: user) {
      this.data = data;
    }
  
    // Getter for user ID
    get id(): string {
      return this.data._id;
    }

    get firstName(): string{
        return this.data.firstName;
    }

    get lastName(): string{
        return this.data.lastName;
    }
  
    // Getter for full name
    get fullName(): string {
      return `${this.data.firstName} ${this.data.lastName}`.trim();
    }
  
    // Getter for user image URL
    get profile(): string {
      return this.data.userImage;
    }
  
    // Getter for email
    get email(): string {
      return this.data.email;
    }
  
    // Getter for referral code
    get referralCode(): string {
      return this.data.referralCode;
    }
  
    // Getter for phone number
    get phoneNumber(): string {
      return this.data.phoneNumber;
    }
  
    // Getter for business name
    get businessName(): string {
      return this.data.BusinessName ?? `${this.data.firstName} Ventures`;
    }
  
    // Getter for account category
    get accountCategory(): string {
      return this.data.accountType ?? "Personal";
    }

    get address(): string{
        return this.address;
    }
  
    // Getter for full address
    get fullAddress(): string {
      return `${this.data.zipcode}, ${this.data.address}, ${this.data.city}, ${this.data.state}`;
    }
  
    // Getter for the nearest bus stop
    get nearestBusStop(): string {
      return this.data.nearestBustop;
    }
  
    // Getter for last seen time
    get lastSeen(): string {
      return this.data.lastSeen;
    }

    get lastSeenDateTime(): Date{
        return new Date(this.lastSeen);
    }

    get online(): boolean{
        const currentTime = new Date();

        const lastSeen = this.lastSeenDateTime;
        
        if(currentTime.getFullYear() !== lastSeen.getFullYear()){
            return false;
        }

        if(currentTime.getMonth() !== lastSeen.getMonth()){
            return false;
        }

        if(currentTime.getDay() !== lastSeen.getDay()){
            return false;
        }

        if(currentTime.getHours() !== lastSeen.getHours()){
            return false;
        }

        if((currentTime.getMinutes() - lastSeen.getMinutes()) <= 4){
            return true;
        }

        return false;
    }

    get kycTier():number{
        return this.data.kycTier;
    }

    get verified():boolean{
        return this.data.kycTier === 3;
    }

    get tryingToVerify():boolean{
        return this.data.kyccurrentTier !== this.data.kycTier;
    }

    get groups():Group[]{
      const isDetailedArray = this.data.groups.every(item => typeof item !== 'string')
      if(isDetailedArray){
        return this.data.groups.map(e => (e as Group));
      }

      return [];
    }

    get groupsString():string[]{
      const isDetailedArray = this.data.groups.every(item => typeof item !== 'string')
      if(!isDetailedArray){
        return this.data.groups.map(e => (e as string));
      }

      return Array.from( new Set(this.groups.map(e=> e._id)));
    }

    get transactions():Transaction[]{
      const isDetailedArray = this.data.transactions.every(item => typeof item !== 'string')
      
      if(isDetailedArray){
        return Array.from(
          new Map(this.data.transactions.map(e => (e as transaction)).map(target => [target._id,new Transaction(target)])).values()
        );
      }

      return [];  
    }

    get transactionsString(): string[]{
      const isDetailedArray = this.data.transactions.every(item => typeof item !== 'string')

      if(!isDetailedArray){
        return Array.from(new Set(this.data.transactions.map(e => (e as string))))
      }

      this.transactions.map(e => e.id);

    }

    get walletBalance():number{
      return this.data.wallet;
    }

    get createdDate():Date{
      return this.data.createdAt? new Date(this.data.createdAt) : new Date()
    }

    get isBlocked(): boolean{
        return this.data.blocked;
    }
  }

  
  