'use client';

import Routes from '@/app/routes';
import Button from '@/components/Button';
import { useAdmin } from '@/providers/AdminProvider';
import { loginAdminOrThrow } from '@/services/rest-api/auth-api';
import Admin from '@/utils/interfaces/admin';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const {setAdmin} = useAdmin();

    const loginMutation = useMutation({
      mutationFn: async()=>{

      toast.loading('Signing In',  {id: 'login',description: "Signing into your account", dismissible: false});
        const promise = await loginAdminOrThrow({email, password,});
        toast.dismiss('login');
        return promise.data;
      },
      onError: (error)=>{
        console.error(error)
        toast.dismiss('login');
        toast.error("Sign-in failed", {description: "Either account does not exist or you should try again later"});
      },
      onSuccess: ({data})=>{
        toast.success("Logged In Successfully", {description: "Good to have you around"});
        setAdmin(data as Admin);
        router.push(Routes.dashboard.path);
      }
    })
  return (
    <div className="flex flex-col gap-7 w-fit h-fit m-auto p-10 self-end">
        <div className="m-auto">
            <h1 className="font-bold text-[35px] font-lato text-black">Keep Connected!!</h1>
            <p className="text-center font-quicksand text-secondary">Log into your admin account</p>
        </div>
        <form className='flex flex-col gap-5' onSubmit={(e)=>{e.preventDefault(); loginMutation.mutate()}}>
            <input
                className="p-3 border-2 rounded-2xl placeholder:text-secondary shadow-sm focus:outline-none focus:border-green-600 w-[400px] md:w-[95%] sm:max-w-[95%] "
                onChange={(e) => { setEmail(e.target.value); }}
                type="email"
                required
                spellCheck="false"
                placeholder="Enter Email"
            />
            <input
                className="p-3 border-2 rounded-2xl placeholder:text-secondary shadow-sm focus:outline-none focus:border-green-600 w-[400px] md:w-[95%] sm:max-w-[95%]"
                onChange={(e) => { setPassword(e.target.value); }}
                type="password"
                required
                spellCheck="false"
                placeholder="Enter Password"
            />
            <Button
              className='p-3 rounded-2xl shadow-sm focus:outline-none w-[400px] text-white bg-themeColor hover:bg-green-800 transition-colors duration-200 flex items-center justify-center'
              type='submit'
              title="Login"
              loading={loginMutation.isPending}
              />
    
            </form>
            <p className="text-secondary text-center">Don&apos;t have an account already? <span className="text-themeColor"><a href={Routes.auth.signup.path}>Signup</a></span></p>
    </div>
  )
}
