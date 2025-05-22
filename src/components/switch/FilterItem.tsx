'use client';

import React from 'react'
import { Colors } from '@/utils/Colors'

interface props{
    label:string,
    checked:boolean,
    onClick:()=> void,
}

export default function FilterItem({label, checked: checked, onClick}:props) {
  return (
    <button
          style={{backgroundColor: !checked ? 'white' : Colors.themeColor, color:  !checked? 'black' : 'white', transition:'all 0.3s ease'}}
          className="rounded-[27px] min-w-[164px] h-[48px] font-semibold px-2 py-1 font-lato"
          onClick={onClick}
        >
          {label}
        </button>
  )
}
