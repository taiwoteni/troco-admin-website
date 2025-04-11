import { shortUser } from "./withdrawal";

export interface reportDetail{
    reporter:shortUser,
    transaction?:{
      _id:string,
      transactionName:string,
    },
    reportedUser?:shortUser,
    createdAt?: string,
    reason:string,
    reportedAt:string,
    _id:string,
}

export interface reportHolder{
    count:number,
    details?:reportDetail[]
}

export interface report{
    _id:string,
    reports:reportHolder[],
    email:string,
    firstName:string,
    lastName:string,
}

export class ReportDetail {
    private reportDetail: reportDetail;
  
    constructor(reportDetail: reportDetail) {
      this.reportDetail = reportDetail;
    }
  
    get reporterId(): string {
      return this.reportDetail.reporter._id;
    }
  
    get reason(): string {
      return this.reportDetail.reason;
    }
  
    get date(): Date {
      return new Date(this.reportDetail.reportedAt);
    }
  
    get id(): string {
      return this.reportDetail._id;
    }
}

export class ReportHolder  {
    private reportHolder: reportHolder;
  
    constructor(reportHolder: reportHolder) {
      this.reportHolder = reportHolder;
    }
  
    get count(): number {
      return this.reportHolder.count;
    }
  
    get details(): ReportDetail[]{
      return this.reportHolder.details?.map((d)=> new ReportDetail(d)) ?? [];
    }
}

export class Report {
    private report: report;
  
    constructor(report: report) {
      this.report = report;
    }
  
    get id(): string {
      return this.report._id;
    }
  
    get reports(): ReportHolder[] {
      return this.report.reports.map((e)=> new ReportHolder(e));
    }
  
    get email(): string {
      return this.report.email;
    }
  
    get firstName(): string {
      return this.report.firstName;
    }
  
    get lastName(): string {
      return this.report.lastName;
    }
  }
  