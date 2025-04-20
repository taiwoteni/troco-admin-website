'use client'

import TransactionsBarChart from '@/components/barchart/TransactionsBarChart';
import DashboardCard from '@/components/cards/DashboardCard';
import { useAdmin } from '@/providers/AdminProvider'
import { useDashboardStats } from '@/providers/DashboardProvider';
import { formatDigits } from '@/utils/Format';
import React, { useMemo } from 'react'

export default function DashboardPage() {
  const {admin:adminOrNull} = useAdmin();
  const {transactions, users, wallet} = useDashboardStats()
  const admin = useMemo(()=>adminOrNull!, [adminOrNull]);

  return (
    <div className='w-full h-full overflow-x-hidden overflow-y-scroll custom-scrollbar px-8 pb-2'>
      {/* Name Welcome */}
      <div className='w-full h-fit flex flex-col gap-8 mt-2'>
        <p className='text-secondary text-[26px]'>Welcome, <span className='font-bold text-black'>{admin.username.charAt(0).toUpperCase()}{admin.username.substring(1).toLocaleLowerCase()}</span></p>
      
        {/* Analysis Cards */}
        <div className="w-full h-fit flex flex-wrap gap-4">
          <DashboardCard
            label='Total Users'
            value={formatDigits(users.totalUsers ?? 0)}
            // background='brown'
            icon={'/icons/dashboard/users.svg'}
            />
            <DashboardCard 
            label='Total Transactions'
            value={formatDigits(transactions.totalTransactions ?? 0)}
            // background='#2196F3'
            top={false}
            bottom={true}
            icon={'/icons/dashboard/merchant-icon.svg'}
            />
            <DashboardCard 
            label='Gross Escrow Income'
            value={formatDigits(transactions.grossEscrowIncome ?? 0)}
            // background='#9C27B0'
            icon={'/icons/dashboard/business-icon.svg'}
            />
            <DashboardCard 
            label='Wallet Balance'
            value={formatDigits(wallet.totalWalletBalance ?? 0)}
            top={false}
            // background='#FF6E40FF'
            bottom={true}
            icon={'/icons/dashboard/wallet.svg'}
            />
        </div>

        <TransactionsBarChart />
      </div>

    </div>
  )
}
