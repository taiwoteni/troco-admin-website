/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
export function isEqual(a:any, b:any):boolean{
    return JSON.stringify(a) === JSON.stringify(b);
}