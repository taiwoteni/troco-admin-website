'use client'

import { useUser } from '@/providers/UserProvider'
import loadingAnim from '../../../../../public/lottie/loading_water.json'
import errorAnim from '../../../../../public/lottie/error.json'
import { useWithdrawal } from '@/providers/WithdrawalsProvider'
import { useParams, useRouter } from 'next/navigation'
import React, { useMemo } from 'react'
import LoadingLayout from '@/components/loading/LoadingLayout'
import { User } from '@/utils/interfaces/user'
import { FaX } from 'react-icons/fa6'
import Routes from '@/app/routes'
import Button from '@/components/Button'
import { getStatusColor } from '@/components/transactions/TransactionItemLayout'
import { formatCurrency } from '@/utils/Format'
import CountingText from '@/components/texts/CountingText'
import Image from 'next/image'
import { GrMoney } from 'react-icons/gr'
import BankPayment from '@/components/transactions/payments/BankPayment'
import { useAdmin } from '@/providers/AdminProvider'
import { useMutation } from '@tanstack/react-query'
import { approveWithdrawal, disapproveWithdrawal } from '@/services/rest-api/withdrawal-api'
import { toast } from 'sonner'
import formatDate from '@/utils/DateFormat'

export default function ViewWithdrawalPage() {

    const {id} = useParams()
    const router = useRouter()
    const withdrawal = useWithdrawal(id!.toString())
    const {admin} = useAdmin()
    const {user:userData, userLoading} = useUser(withdrawal?.user._id.toString() ?? "", false)
    const user = useMemo(()=> !userData? undefined: new User(userData), [userData])


    const acceptWithdrawal = useMutation({
        mutationFn: ()=>approveWithdrawal({withdrawalId: withdrawal!._id, adminId: admin!._id}),
        onSuccess:()=>{
            toast.success("Accepted Withdrawal");
            router.replace(Routes.dashboard.withdrawal.path)
        },
        onError: ()=>{
            toast.error("Error Accepting Withdrawal");
        }

    })

    const rejectWithdrawal = useMutation({
        mutationFn: ()=>disapproveWithdrawal({withdrawalId: withdrawal!._id, adminId: admin!._id}),
        onSuccess:()=>{
            toast.success("Rejected Withdrawal");
            router.replace(Routes.dashboard.withdrawal.path)
        },
        onError: ()=>{
            toast.error("Error Rejecting Withdrawal");
        }
    })

    const revertWithdrawal = useMutation({
        mutationFn: ()=>approveWithdrawal({withdrawalId: withdrawal!._id, adminId: admin!._id}),
        onSuccess:()=>{
            router.replace(Routes.dashboard.withdrawal.path)
            
        },
        onError: ()=>{
            toast.error("Error Reverting Withdrawal");
        }

    })




  return (
    <div onClick={(e)=>e.stopPropagation()} style={{animationDuration:'0.5s'}} className='w-[65%] h-[75%] relative bg-white modal-popin rounded-lg'>
      <div onClick={()=> router.replace(Routes.dashboard.withdrawal.path)} className='rounded-[50%] z-[51] absolute -right-3.5 -top-3.5 cursor-pointer text-[12px] p-3 flex items-center justify-center text-white bg-themeColor'>
        <FaX />
      </div>
      <div className='flex flex-col w-full h-full overflow-y-scroll custom-scrollbar p-6'>
        <h2 className="text-[25px] font-bold font-lato self-start mb-4">View Withdrawal</h2>

        {userLoading && withdrawal && <LoadingLayout lottie={loadingAnim} className='w-full flex-1' label='Loading Withdrawal' />}
        {!withdrawal && <LoadingLayout lottie={errorAnim} className='w-full flex-1' label='Withdrawal not found' />}
        {!userLoading && withdrawal && !user && <LoadingLayout lottie={errorAnim} className='w-full flex-1' label='Issuer not found' />}

        {user && withdrawal && !userLoading && (
            <div className="flex w-full h-full gap-12">
                    <div className="flex flex-col min-h-10 h-full flex-1 justify-between gap-5">
                        <div className="rounded-2xl w-full bg-opacity-80 h-fit relative overflow-hidden bg-themeColor">
                            <div className="w-[145px] h-[145px] rounded-[50%] absolute -right-[30px] -top-[35px] bg-white bg-opacity-20 " />
                            <div className="w-[145px] h-[150px] rounded-[50%] absolute -right-[30px] -bottom-[30px] bg-white bg-opacity-40 " />
                            <div className="px-9 py-5 flex flex-col gap-6 z-20">
                                <p className="text-white font-normal text-[16px]">{`${user.firstName}'s Wallet`}</p>
                                <CountingText className='text-white font-bold text-[32px]' text={user.walletBalance} showDecimal={true} />
                                <div className="flex gap-3">
                                    <div className="w-fit flex justify-center items-center gap-2 cursor-pointer px-3 py-1 text-white bg-white bg-opacity-20 rounded-[25px]">
                                        <Image src={'/icons/wallet/referral-code.svg'} width={20} height={20} alt="referral-code" />
                                        <p>{user.referralCode}</p>
                                    </div>

                                    <div onClick={()=>router.push(Routes.dashboard.users.path + "/" + withdrawal.user._id)} className="w-fit flex justify-center items-center gap-2 cursor-pointer px-3 py-1 text-white bg-white bg-opacity-20 rounded-[25px]">
                                        <GrMoney className="w-[20px] h-[20px] text-white" />
                                        <p>Send Bonus</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <BankPayment accountDetails={withdrawal.accountToBeSentTo}  />
                        <p className="text-gray-500 text-sm font-normal">* The Issuer, <span className="font-bold text-black">{withdrawal.user.firstName + " " + withdrawal.user.lastName}</span> attempted to make a withdrawal of <span className="font-bold text-themeColor">{formatCurrency(withdrawal.amount)}</span> from his wallet on <span className="font-bold text-black">{formatDate(withdrawal.dateRequested!)}.</span> The remainder will be a sum of <span className="font-bold text-black">{formatCurrency(user.walletBalance - withdrawal.amount)}</span> which is <span className="font-bold text-black">{user.walletBalance < withdrawal.amount? 'not acceptible.':'acceptible.'}</span> </p>
                    </div>
                    <div className="flex flex-col min-h-10 gap-4 flex-1">
                        <div className="flex justify-between items-center pb-4 border-b text-center text-sm font-normal">
                            <p className="font-bold text-lg">Withdrawal ID</p>
                            <p>#{withdrawal._id}</p>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b text-center text-sm font-normal">
                            <p className="font-bold text-lg">Issuer ID</p>
                            <p>#{withdrawal.user._id}</p>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b text-center text-sm font-normal">
                            <p className="font-bold text-lg">Status</p>
                            <p style={{color:getStatusColor(withdrawal.status)}}>{withdrawal.status}</p>
                        </div>
                        <div className="flex justify-between items-center pb-4 text-center text-sm font-bold">
                            <p className="text-lg">Amount</p>
                            <p className='text-themeColor'>{formatCurrency(withdrawal.amount)}</p>
                        </div>
                        <div className="flex flex-col gap-4 items-center font-bold justify-center">
                            <Button title="Approve" loading={acceptWithdrawal.isPending} onClick={()=>acceptWithdrawal.mutate()} disabled={withdrawal.status !== 'pending'} />
                            
                            {withdrawal.status === 'pending' && <p>OR</p>}
                            {withdrawal.status === 'pending' && <div className="flex w-full flex-col items-start gap-2">
                                <Button className='w-full' disabled={admin?.role?.toLowerCase() !== 'super admin'} title={withdrawal.status === 'pending'?"Reject":"Revert?"} negative={true} loading={rejectWithdrawal.isPending || revertWithdrawal.isPending} onClick={()=>withdrawal.status === 'pending'?rejectWithdrawal.mutate():revertWithdrawal.mutate()}/>
                                <p className="text-orange-600 text-sm font-bold">* This action is irreversible</p>
                            </div>}
                        </div>
                    </div>

                </div>
        )}

      </div>
    </div>
  )
}
