'use client'

import { useWithdrawals } from '@/providers/WithdrawalsProvider';
import formatDate from '@/utils/DateFormat';
import { formatCurrency } from '@/utils/Format';
import { Withdrawal } from '@/utils/interfaces/withdrawal';
import Image from 'next/image';
import React, { useMemo } from 'react'
import { getStatusColor } from '../transactions/TransactionItemLayout';
import { useRouter } from 'next/navigation';
import Routes from '@/app/routes';

export default function WithdrawalsTable({search}:Record<string,string>) {
  const {withdrawals} = useWithdrawals();
  const router = useRouter();
  const filteredWithdrawals = useMemo(()=>withdrawals.filter(b => (b.user.firstName + ' ' + b.user.lastName).toLowerCase().includes(search.trim().toLowerCase()) || b.accountToBeSentTo.accountName.toLowerCase().includes(search.trim().toLowerCase()) || b.accountToBeSentTo.accountNumber.toLowerCase().includes(search.trim().toLowerCase()) || b.accountToBeSentTo.bankName.toLowerCase().includes(search.trim().toLowerCase())).map(w => new Withdrawal(w)),[withdrawals, search])
  

  
  return (
    <div className="rounded-lg shadow-lg w-full h-fit p-5 bg-white mb-8">
      <h1 className="text-[24px] font-bold py-4 mb-5">All Withdrawals</h1>
      <div className='w-full h-fit rounded-lg border border-separate border-spacing-0 overflow-hidden'>
        <table className='w-full rounded-lg border table-fixed border-spacing-0 text-[14px] overflow-hidden'>
          <thead className='pl-5 py-3 h-[60px] border-b'>
            <tr className='bg-tertiary font-bold text-start'>
              <th className="px-5 py-3 text-start font-bold">
                Issuer
              </th>
              <th className="py-3 text-center font-bold">
                Bank Name
              </th>
              <th className="py-3 text-center font-bold">
                Account No.
              </th>
              <th className="py-3 text-center font-bold">
                Date
              </th>
              <th className="py-3 text-center font-bold">
                Status
              </th>
              <th className="py-3 text-center font-bold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredWithdrawals.map(withdrawal => (
                <tr  key={withdrawal.id} onClick={()=>router.push(Routes.dashboard.withdrawal.path + "/" + withdrawal.id)} className='hover:bg-tertiary cursor-pointer border-b last:border-b-0 transition-[background-color] ease-in duration-[0.4s]'>
                  <td className="py-3 pl-3 text-start flex gap-3 overflow-hidden">
                    <div className="flex gap-2 w-fit items-center">
                        <Image
                            src={withdrawal.creatorImage ?? '/images/profile_img.png'}
                            width={36}
                            height={36}
                            alt="profile pic"
                            className={`rounded-full w-[36px] h-[36px] object-cover ${withdrawal.creatorImage?'':'scale-150'}`}
                        />
                        <p className='font-medium'>{withdrawal.creatorName}</p>
                    </div>
                  </td>
                  <td className='py-3 text-center font-medium'>
                    {withdrawal.accountToBeSentTo.bankName}
                  </td>
                  <td className='py-3 text-center font-medium'>
                    {withdrawal.accountToBeSentTo.accountNumber}
                  </td>
                  <td className='py-3 text-center font-medium'>
                    {formatDate(withdrawal.time, false)}
                  </td>
                  <td style={{color:getStatusColor(withdrawal.status)}} className='py-3 text-center font-bold'>
                      {withdrawal.status}
                  </td>
                  <td className="py-3 text-center font-bold">
                    {formatCurrency(withdrawal.amount)}
                  </td>                      
                </tr>
            ))}
            {filteredWithdrawals.length === 0 && <tr><td colSpan={6} className='text-center py-4'>{search.trim().length !== 0 ?`No search results for '${search}'`:'No withdrawal requests yet'}</td></tr>}
          </tbody>
        </table>
      </div>
      


    </div>
  )
}
