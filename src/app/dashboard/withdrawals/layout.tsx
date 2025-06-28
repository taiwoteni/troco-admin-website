'use client';

import SearchBar from '@/components/search-bar/SearchBar';
import WithdrawalsTable from '@/components/withdrawals/WithdrawalsTable';
import React, { ReactNode, useState } from 'react'

export default function WithdrawalsLayout({children}:{children?: ReactNode}) {
  const [search, setSearch] = useState('');

  return (
    <div className='h-full overflow-y-scroll custom-scrollbar px-8 py-2'>
        <div className='w-full h-fit gap-8 flex flex-col'>
          <div className='w-full flex justify-between items-center'>
            <h1 className="text-gray-700 text-[25px] font-bold mb-5">Withdrawals</h1>
            <SearchBar
              placeholder='Search Withdrawal'
              onChangeText={setSearch}
              value={search}
            />
          </div>
          <WithdrawalsTable search={search} />
        </div>
        {children}
    </div>
  )
}
