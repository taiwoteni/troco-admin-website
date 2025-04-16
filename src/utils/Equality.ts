/* eslint-disable @typescript-eslint/no-explicit-any */
export function isEqual(a:any, b:any):boolean{
    return JSON.stringify(a) === JSON.stringify(b);
}