'use client'

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { FaX } from 'react-icons/fa6';
import { Colors } from '@/utils/Colors';
import { setPin } from '@/services/rest-api/pin-api';
import { toast } from 'sonner';
import Button from '../Button';
import PinInput from '../pin/PinInput';

interface props{
    onCancel: ()=> void,
}


export default function SetAdminPin({onCancel}:props) {
    const [confirmPin, setConfirmPin] = useState('');
    const [initialPin, setInitialPin] = useState('');

    const setPinMutation = useMutation({
          mutationFn: ()=> setPin(confirmPin.trim(), true),
          onSuccess: () => {
            toast.success("Set Pin", {description:"Authentication pin was set successfully"});
            onCancel();
            setConfirmPin('');
            setInitialPin('');
            onCancel()
          },
          onError: (error) => {
            console.error('Error sending message:', error);
            toast.error("Error setting pin", {description:"Please check your internet or try again later."});
          },
        }
    );


    return (
        <div  onClick={onCancel} className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div onClick={(e)=>{
                e.stopPropagation()
              }} style={{animationDuration: '0.75s'}} className="relative bg-white modal-animate p-6 rounded-lg min-w-[450px]">
            <div onClick={onCancel} className='rounded-[50%] z-[51] absolute -right-3.5 -top-3.5 cursor-pointer text-[12px] p-3 flex items-center justify-center text-white' style={{backgroundColor:Colors.themeColor}}>
                <FaX />
            </div>
            <h2 className="text-xl font-semibold mb-4">Set Auth Pin</h2>
            
            <p className='text-secondary text-sm ml-3 mb-2'>Enter new pin:</p>
            <PinInput split size={45} className='mb-8' onChangeOtp={setInitialPin} />

            {/* Message Content Textarea */}
            <p className='text-secondary text-sm ml-3 mb-2'>Confirm new pin:</p>
            <PinInput split size={45} className='mb-8' onChangeOtp={setConfirmPin} />
            
            <Button
              disabled={setPinMutation.isPending || (initialPin.length !==6 || initialPin !== confirmPin)}
              onClick={()=>setPinMutation.mutate()}
              loading={setPinMutation.isPending}
              title='Set' />
            
          </div>
        </div>
    )
}
