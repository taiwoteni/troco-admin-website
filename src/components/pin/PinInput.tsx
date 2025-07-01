'use client';

import { Minus } from 'iconsax-react';
import React, { useRef, useState } from 'react';

interface props{
    length?: number;
    className?: string;
    onChangeOtp?: (otp: string) => void;
    size?: number;
    split?: boolean
}

const PinInput = ({ length = 6, onChangeOtp, className='', size=48, split=false}: props) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | undefined)[]>([]);

  const handleChange = (value: string, index: number) => {
    const char = value.toUpperCase();

    if (/^[A-Z0-9]$/.test(char)) {
        const newOtp = [...otp];
        newOtp[index] = char;
        setOtp(newOtp);
        onChangeOtp?.(newOtp.join(''));

        // Move focus to next input
        if (index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const key = e.key;

    if (key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[index] !== '') {
        newOtp[index] = '';
        setOtp(newOtp);
        onChangeOtp?.(newOtp.join(''));
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        onChangeOtp?.(newOtp.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className={`flex gap-[10px] flex-center uppercase ${className}`}>
      {otp.slice(0, length/2).map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el ?? undefined;
          }}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className='text-center text-[20px] border  border-gray-300 focus:outline-themeColor rounded-xl'
          style={{width:size, height:size*1.05}}
        />
      ))}

      {split && <div className='flex text-center whitespace-nowrap flex-center text-[20px]'
        style={{width:size, height:size*1.05}}>
        <Minus color='#000' size={size * .6}/>

      </div>}

      {otp.slice(length/2).map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index + (length/2)] = el ?? undefined;
          }}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index+(length/2))}
          onKeyDown={(e) => handleKeyDown(e, index+(length/2))}
          className='text-center text-[20px] border  border-gray-300 focus:outline-themeColor rounded-xl'
          style={{width:size, height:size*1.05}}
        />
      ))}
    </div>
  );
};

export default PinInput;
