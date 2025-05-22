'use client'

import { Colors } from '@/utils/Colors';
import React, { CSSProperties } from 'react'

interface props{
    className?: string,
    style?: CSSProperties,
    tabs: string[],
    onSelectTab: (index: number) => void,
    index?: number
}


export default function AestheticTabbar(tabProps: props) {
    const {className, tabs, index=0, style, onSelectTab} = tabProps;
  return (
    <div style={{
            '--selected-tab-bg-color': 'white',
            '--selected-tab-text-color': 'black',
            '--unselected-tab-text-color': Colors.secondary,
            '--selected-tab-border-radius': '13px',
            ...style} as Record<string, unknown>}
        className={`w-full rounded-[13px] h-[50px] flex box-border bg-tertiary relative ${className} overflow-hidden`}>
        <div className='absolute top-1 bottom-1 left-1 right-1 z-1 overflow-hidden'>
            <div style={{width: `${100 / tabs.length}%`, transform: `translateX(${index * 100}%)` , backgroundColor: 'var(--selected-tab-bg-color)', borderRadius: 'var(--selected-tab-border-radius)'}} className='h-full cursor-pointer select-none transition-transform duration-300 ease' />

        </div>

        <div className='w-full h-full z-10 flex flex-center bg-transparent'>
            {tabs.map((tab, _index)=>(
                <div key={_index} onClick={()=>onSelectTab(_index)} style={{color: `var(--${index === _index? 'selected':'unselected'}-tab-text-color)`, fontWeight: index === _index? '700' :'400'}} className='flex flex-center flex-1 font-quicksand text-[13px] font-medium text-center cursor-pointer select-none'>{tab}</div>
            ))}
        </div>
    </div>
  )
}
