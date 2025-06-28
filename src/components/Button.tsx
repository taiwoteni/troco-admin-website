'use client'

import React, { HTMLAttributes } from 'react'
import { Colors } from '@/utils/Colors'
import { FaSpinner } from 'react-icons/fa'

interface props{
    loading?:boolean,
    title:string,

    onClick?:()=> void,
    disabled?:boolean,
    negative?:boolean,
    className?:HTMLAttributes<string> | string
    type?:"submit" | "reset" | "button" | undefined;
}


export default function Button({className,loading=false, title, type, onClick, disabled=false, negative=false}:props){
    return <button type={type} className={`select-none w-full h-[55px] rounded-[15px] font-semibold text-gray-600 text-center items-center justify-center inline-flex ${className}`} style={{color:disabled?'#4b5563':'white', backgroundColor:disabled?Colors.tertiary:negative? 'darkred':Colors.themeColor}} disabled={disabled || loading} onClick={onClick}>
        {!loading? title:<FaSpinner className="animate-spin" />}
        </button>
}