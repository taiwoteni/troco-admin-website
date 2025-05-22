'use client';

import React, { HTMLAttributes, useEffect, useState } from 'react'

interface props{
    text:number,
    milliseconds?:number,
    showDecimal?:boolean,
    className?:HTMLAttributes<HTMLParagraphElement>| string,
    spanClassName?:HTMLAttributes<HTMLParagraphElement>,

}



export default function CountingText({text, className, spanClassName, showDecimal=false, milliseconds = 1000}:props) {
    const [animatedText, setText] = useState(0);



    useEffect(()=>{
        let target = 0.0;
        const intervalId = setInterval(() => {
            target +=0.1;
        
            setText((prev) => {
              if (prev >= text) {
                clearInterval(intervalId)
                return text;
              }
              return text*target; 
            });
          }, (milliseconds/10));
      
          // Clean up the interval on component unmount
          return () => clearInterval(intervalId);

    }, [text, milliseconds])


    const formatCurrency = (amount:number) => {
        return new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          maximumFractionDigits:showDecimal?0:2,
        }).format(amount);
      };
  return (
    <p style={{transition:'all 0.05s ease'}} className={`${className}`}>{formatCurrency(showDecimal? Math.trunc(animatedText):animatedText)}{showDecimal && <span className={`opacity-40 ${spanClassName}`}>{(animatedText-Math.trunc(animatedText)).toFixed(2).substring(1)}</span>}</p>
  )
}
