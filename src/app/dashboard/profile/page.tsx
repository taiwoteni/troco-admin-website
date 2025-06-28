'use client'

import LottieWidget from '@/components/lottie/LottieWidget';
import { useAdmin } from '@/providers/AdminProvider';
import loadingAnim from '../../../../public/lottie/loading_water.json';
import emptyAnim from '../../../../public/lottie/empty-transactions.json'
import React, { useState } from 'react'
import Image from 'next/image';
import { Colors } from '@/utils/Colors';
import formatDate from '@/utils/DateFormat';
import { toast } from 'sonner';
import modalProps from '@/utils/interfaces/modal';
import PopupModal from '@/components/modal/PopupModal';
import Routes from '@/app/routes';
import Link from 'next/link';
import TransactionItemLayout from '@/components/transactions/TransactionItemLayout';
import LoadingLayout from '@/components/loading/LoadingLayout';
import { distinctList } from '@/utils/ArrayUtil';
import CompactGroupItemLayout from '@/components/groups/CompactGroupItemLayout';
import CompactSessionsItemLayout from '@/components/sessions/CompactSessionsItemLayout';
import { useTransactions } from '@/providers/TransactionsProvider';

export default function ViewAdminPage() {
    const {admin, customerCareSessions:sessions, groups, activity:activities} = useAdmin();
    const [modal, setModal] = useState<modalProps | null>(null)
    const {transactions} = useTransactions()



    if(!admin){
        return <div className='w-full h-full flex flex-col gap-2 flex-center'>
            <LottieWidget lottieAnimation={loadingAnim} className='w-[200px] h-[200px] aspect-square object-cover' />
            <h2 className='text-[25px] font-bold font-lato'>{"Loading this admin's data"}</h2>
            <p className='text-secondary font-quicksand -mt-1 text-sm'>Give us <b>a</b> minute.</p>
        </div>
    }

  return (
    <div className='w-full h-full overflow-y-scroll custom-scrollbar '>

        <div className='w-full h-fit flex px-8 pb-2 gap-7 mt-10'>
            <div className="flex flex-col flex-1 gap-7">

            {/* Brief information side */}
            <div className="rounded-2xl bg-white shadow-lg px-8 py-8 w-full h-fit">
                {/* div containing profile image and brief admin details */}
                <div className='flex gap-7 items-start'>
                <div className="mt-3">
                    <div className="relative w-[100px] h-[100px]">
                    <Image
                        src={'/images/profile_img.png'}
                        width={36}
                        height={36}
                        alt="profile pic"
                        className={`rounded-full w-full h-full object-cover scale-150`}
                    />
                    <div style={{backgroundColor:admin.active? Colors.themeColor:'red'}} className="w-[27%] h-[27%] border-white border-[3px] box-border rounded-[50%] absolute bottom-[-2px] right-[8px] z-10"/>
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-start">
                    <div className="flex h-fit w-fit gap-2 items-center">
                    <p className="text-[26px] text-center font-bold">{admin.username}</p>
                    </div>
                    <p className='text-[17px] font-medium ml-0.5 mb-4'>{admin.role === "Admin"?"Normal Admin":admin.role}</p>
                    <div className="min-h-[34px]" >
                    <p className='max-w-[50%] text-[17px]'>{admin.email}</p>
                    </div>
                </div>
                </div>
            </div>

            {/* Admin Activity */}
            <div className="rounded-2xl relative mb-4 shadow-lg bg-white pb-5 px-5 w-full h-fit max-h-[600px] custom-scrollbar overflow-y-scroll">
                <h1 className="text-[24px] font-bold w-full bg-white sticky top-0 z-10 pt-5 pb-3 text-black mb-4">{admin.role} Activities</h1>
                <div className="w-full h-fit rounded-lg border border-separate border-spacing-0 overflow-hidden">
                <table className="w-full rounded-lg border border-spacing-0 table-fixed text-[14px] overflow-hidden">
                    <thead className="px-5 py-3 h-[60px] border-b">
                    <tr style={{backgroundColor:Colors.tertiary}} className='font-bold text-start'>
                        <th colSpan={2} className="pl-5 py-3 text-start font-bold">Content</th>
                        <th className="py-3 text-center font-bold">Date</th>
                        <th className="py-3 text-center font-bold">Time</th>
                    </tr>
                    </thead>
                    <tbody className=''>
                    {activities.length > 0 ? (
                        activities.map((activity) => {
                        const time = new Date(activity.time);
                        let hours = time.getHours();
                        const minutes =time.getMinutes();
                        const ampm = hours >= 12 ? 'pm' : 'am';
                        hours %= 12;
                        return (
                            <tr onClick={()=>{
                            setModal({
                                title: activity.content,
                                question:<span>Time: <span className="font-semibold">{formatDate(activity.date, false)}</span> at <span className="font-semibold">{`${hours}:${minutes.toString().padStart(2, '0')} ${ampm.toUpperCase()}`}</span></span>,
                                onOk:()=>setModal(null),
                                onCancel:()=> setModal(null),
                                okText:'Seen',
                                cancelText:'Close'
                            })
                            }} key={activity._id} className="border-b py-3 hover:bg-[#F9F8F6] font-medium cursor-pointer w-full last:border-b-0 transition-[background-color] ease-in duration-[0.4s]">
                            <td colSpan={2} className="py-3 px-4 overflow-hidden box-border text-ellipsis whitespace-nowrap">{activity.content}</td>
                            <td className="py-3 px-4 text-center">{new Date(activity.date).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-center">{`${hours}:${minutes.toString().padStart(2, '0')} ${ampm.toUpperCase()}`}</td>
                            </tr>
                        )
                        })
                    ) : (
                        <tr>
                        <td colSpan={4} className="py-3 px-4 text-center">No activities found</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>

            </div>

            {/* Groups/Session & Transaction Side*/}
            <div className="flex flex-col gap-5">
                {/* Transactions */}
                <div className='gap-3 flex flex-col'>
                    {/* Transactions Section */}
                    <div className="rounded-2xl shadow-lg bg-white p-5 pt-0 pb-5 h-[500px] w-[500px] overflow-y-scroll custom-scrollbar">
                        <div className="sticky top-0 bg-inherit pt-5 pb-2">
                        <h1 className="text-[22px] text-[#202224] font-bold pt-2 pb-0.5">
                            Transactions
                        </h1>
                        </div>
                        <div className="gap-4">
                        {distinctList(transactions, '_id').map((transaction, index, array) => (
                        <div key={index}>
                            <Link href={Routes.dashboard.transactions.path + "/" + transaction._id}>
                            <TransactionItemLayout transaction={transaction} style={{borderBottomWidth: index !== array.length-1? 2:0}} />
                            </Link>
                        </div>
                        ))}
                        {admin.transactions.length === 0 && <LoadingLayout className='h-[500px]' lottie={emptyAnim} label={`${admin.username} doesn't have any transactions`} style={{boxShadow:'none', fontSize:'14px'}} />}
                        </div>
                    </div>
                </div>

                {/* Groups/Sessions */}
                <div className="rounded-2xl shadow-lg bg-white p-5 pt-0 pb-5 h-[500px] w-[500px] overflow-y-scroll custom-scrollbar">
                    <div className="sticky top-0 bg-inherit pt-5 pb-2">
                    <h1 className="text-[22px] text-[#202224] font-bold pt-2 pb-0.5">
                        {admin.role === 'Customer Care'?"Sessions":"Orders"}
                    </h1>
                    </div>
                    <div className="gap-4">
                    {admin.role === 'Admin' && distinctList(groups, '_id').map((group, index, array) => (
                    <div key={index}>
                        <Link href={Routes.dashboard.orders.path + "/" + group._id}>
                        <CompactGroupItemLayout userId={admin._id} group={group} style={{borderBottomWidth: index !== array.length-1? 2:0}} />
                        </Link>
                    </div>
                    ))}

                    {admin.role === 'Customer Care' && distinctList(sessions, '_id').map((session, index, array) => (
                    <div key={index}>
                        <div onClick={()=>toast.error("Cannot open session", {description:"Super Admins have not yet been given permission to open sessions"})} style={{borderBottomWidth: index !== array.length-1? 2:0}}>
                        <CompactSessionsItemLayout session={session}/>
                        </div>
                    </div>
                    ))}

                    {admin.transactions.length === 0 && <LoadingLayout className='h-[500px]' lottie={emptyAnim} label={`${admin.username} doesn't have any ${admin.role === 'Admin'? 'orders':'sessions'}`} style={{boxShadow:'none', fontSize:'14px'}} />}
                    </div>
                </div>
                

            </div>
        </div>

      {modal && <PopupModal modal={modal} />}

    </div>
  )
}
