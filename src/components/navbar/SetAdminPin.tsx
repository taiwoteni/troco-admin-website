'use client'

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { FaX } from 'react-icons/fa6';
import { Colors } from '@/utils/Colors';
import { setPin } from '@/services/rest-api/pin-api';
import { toast } from 'sonner';
import Button from '../Button';

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
              }} style={{animationDuration: '0.75s'}} className="relative bg-white modal-animate p-6 rounded-lg max-w-[350px]">
            <div onClick={onCancel} className='rounded-[50%] z-[51] absolute -right-3.5 -top-3.5 cursor-pointer text-[12px] p-3 flex items-center justify-center text-white' style={{backgroundColor:Colors.themeColor}}>
                <FaX />
            </div>
            <h2 className="text-xl font-semibold mb-4">Set Auth Pin</h2>
            
            {/* Message Title Input */}
            <input
              type="text"
              value={initialPin}
              
              onChange={(e) => {
                setInitialPin(e.target.value)
              }}
              placeholder="Set Pin"
              className="w-full px-4 py-3 bg-tertiary border outline-none border-none rounded-[15px] mb-4"
            />

            {/* Message Content Textarea */}
            <input
              type="text"
              value={confirmPin}
              
              onChange={(e) => {
                setConfirmPin(e.target.value)
              }}
              placeholder="Confirm Pin"
              className="w-full px-4 py-3 bg-tertiary border outline-none border-none rounded-[15px] mb-4"
            />
            
            <Button
              disabled={setPinMutation.isPending || (initialPin.length ===0 || initialPin !== confirmPin)}
              onClick={()=>setPinMutation.mutate()}
              loading={setPinMutation.isPending}
              title='Set' />
            
          </div>
        </div>
    )
}
