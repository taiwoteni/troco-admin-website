'use client'

import Routes from '@/app/routes'
import Button from '@/components/Button'
import PinInput from '@/components/pin/PinInput'
import { validatePin } from '@/services/rest-api/pin-api'
import { savePinEntered } from '@/utils/cache/session-pin-cache'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function TwoFactorAuthentication() {
    const [pin, setPin] = useState('');
    const router = useRouter();

    const validatePinMutation = useMutation({
          mutationFn: ()=> validatePin(pin.trim(), true),
          onSuccess: () => {
            toast.success("Verification Success", {description:"You've successfully been verified. Welcome!!"});
            savePinEntered(true);
            router.replace(Routes.dashboard.path);

          },
          onError: (error) => {
            console.error('Error sending message:', error);
            toast.error("Validation Failed", {description:"Ensure you've entered the correct pin or try again later"});
          },
        }
    );

  return (
    <div className='flex flex-col gap-5 w-fit h-fit m-auto p-10 self-end'>
        <div className="m-auto">
            <h1 className="font-bold text-[35px] font-lato text-black text-center">Two-Factor Auth</h1>
            <p className="text-center font-quicksand text-secondary">Enter below, the admin authentication code</p>

            <PinInput
            className='my-10'
            split
            onChangeOtp={(_pin)=>{
                setPin(_pin);
            }}  
            />

            <Button title='Verify' loading={validatePinMutation.isPending} onClick={()=>validatePinMutation.mutate()} disabled={pin.length!==6}  />
        </div>
    </div>
  )
}
