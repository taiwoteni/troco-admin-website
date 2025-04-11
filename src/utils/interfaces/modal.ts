import { ReactNode } from "react";

export default interface modalProps{
    title:string,
    question:string | ReactNode,
    negative?:boolean,
    onCancel:()=> void,
    cancelText?:string,
    okText?:string,
    onOk?:()=> void,
}

export function initialModal():modalProps{
    return {title:'Hey',question:"How're you", onCancel:(()=>{}), onOk:(()=>{})};
}