'use client';

import { Colors } from '@/utils/Colors';
import { SearchNormal1 } from 'iconsax-react';
import React from 'react'

interface props{
    value?: string,
    placeholder?: string,
    onChangeText?: (_: string)=>void 
}

export default function SearchBar({placeholder='Search something...', value, onChangeText = ()=>{}}:props) {
  return (
    <div className="relative w-full sm:w-80 bg-tertiary rounded-lg flex flex-center mt-4 sm:mt-0 text-secondary">
    <input 
        type="text" 
        placeholder={placeholder} 
        className="w-full px-4 py-3.5 pl-10 text-secondary text-[13.5px] font-quicksand rounded-lg outline-none bg-white focus:outline-none focus:ring-2 focus:ring-themeColor"
        value={value}
        onChange={(e) => onChangeText(e.currentTarget.value)}
    />
    {/* <!-- Search Icon (Optional) --> */}
    <SearchNormal1 size={18} color={Colors.secondary} className="absolute z-[1] left-3 text-secondary" />
    </div>
  )
}
