'use client';

import Routes from '@/app/routes';
import Button from '@/components/Button';
import { registerAdminOrThrow } from '@/services/rest-api/auth-api';
import { AdminRole } from '@/utils/interfaces/admin';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [matchPasswords, setMatchPasswords] = useState(true);
    const [role, setRole] = useState<AdminRole | undefined>();
    const router = useRouter();

    function handlePasswordCheck() {
      if (password === confirmPassword) {
          setMatchPasswords(true);
          return true;
      } else {
          setMatchPasswords(false);
          return false;
      }
    }

    const registerMutation = useMutation({
      mutationFn: async ()=>{
        const match = handlePasswordCheck();
        if(!match) return;

        toast.loading('Registering Account',  {id: 'register',description: "Your account is being registered", dismissible: false});
        const promise = await registerAdminOrThrow({email, password, username, role:role!});
        toast.dismiss('register');
        return promise;
      },
      onError: ()=>{
        toast.dismiss('register');
        toast.error("Registration Failed", {description: "Either this exists or you should try again later"});
      },
      onSuccess: ()=>{
        toast.success("Created Successfully", {description: "Re-login to verify your account"});
        router.push(Routes.auth.login.path);
      }
    })

  return (
    <div className="flex flex-col gap-5 w-fit h-full overflow-y-scroll no-scrollbar m-auto p-10 self-end">
        <div className="m-auto">
            <h1 className="font-bold text-[35px] font-lato text-black">Register Account</h1>
            <p className="text-center font-quicksand text-secondary">Register your admin account</p>
        </div>
        <form className='flex flex-col gap-5' onSubmit={(e)=>{e.preventDefault(); registerMutation.mutate()}}>
        <input
            className="p-3 border-2 rounded-2xl placeholder:text-secondary shadow-sm focus:outline-none focus:border-green-600 w-[400px] md:w-[95%] sm:max-w-[95%] "
            onChange={(e) => { setEmail(e.target.value); }}
            type="email"
            required
            spellCheck="false"
            placeholder="Email"
        />
        <input
            className="p-3 border-2 rounded-2xl placeholder:text-secondary shadow-sm focus:outline-none focus:border-green-600 w-[400px] md:w-[95%] sm:max-w-[95%] "
            onChange={(e) => { setUsername(e.target.value); }}
            required
            spellCheck="false"
            placeholder="Username"
        />
        <select name="" id=""
            className="p-3 border-2 rounded-2xl placeholder:text-secondary shadow-sm focus:outline-none focus:border-green-600 w-[400px] md:w-[95%] sm:max-w-[95%] m"
            required
            onChange={
                e=>{
                    setRole(e.target.value as AdminRole)
                }
            }
        >
            <option value="" >Select role</option>
            <option value="Admin">Admin</option>
            <option value="Customer Care">Customer care</option>
            <option value="Secretary">Secretary</option>
            <option value="Super Admin">Super Admin</option>
        </select>
        <input
            className="p-3 border-2 rounded-2xl placeholder:text-secondary shadow-sm focus:outline-none focus:border-green-600 w-[400px] md:w-[95%] sm:max-w-[95%]"
            onChange={(e) => { setPassword(e.target.value); }}
            type="password"
            required
            spellCheck="false"
            placeholder="Password"
        />
        <div>
            <input
                className="relative p-3 border-2 rounded-2xl placeholder:text-secondary shadow-sm focus:outline-none focus:border-themeColor w-[400px] md:w-[95%] sm:max-w-[95%] "
                onChange={(e) => { setConfirmPassword(e.target.value); }}
                onBlur={handlePasswordCheck}
                type="password"
                required
                spellCheck="false"
                placeholder="Confirm Password"
            />
            {
                !matchPasswords && (
                    <p className="absolute text-[14px] text-red-600">* passwords do not match</p>
                )
            }
        </div>
        <p className="text-[#495065]">By registering, you agree to troco <a href="https://www.troco.ng/terms.html" className="text-themeColor underline decoration-themeColor">terms of use</a></p>
        <Button
            className='p-3 rounded-2xl shadow-sm focus:outline-none w-[400px] text-white bg-themeColor hover:bg-green-800 transition-colors duration-200 flex items-center justify-center'
            type='submit'
            title="Register"
            loading={registerMutation.isPending}
            />

        </form>
        <p className="text-[#495065] text-center">Have an account already? <span className="text-themeColor"><a href={Routes.auth.login.path}>Login</a></span></p>
    </div>
  )
}
