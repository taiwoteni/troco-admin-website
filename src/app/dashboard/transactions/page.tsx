'use client';

import SearchBar from '@/components/search-bar/SearchBar'
import TransactionTable from '@/components/transactions/TransactionTable'
import React, { useState } from 'react'

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  return (
    <div className='h-full overflow-y-scroll custom-scrollbar px-8 pb-2'>
      <div className='w-full h-fit flex flex-col gap-8 mt-2'>
        <div className='w-full flex justify-between'>
          <p className='text-secondary text-[26px] font-bold'>Transactions</p>
          <SearchBar placeholder='Search By Transaction Name' value={search} onChangeText={setSearch}/>
        </div>

        <TransactionTable search={search} />  
      
      </div>
    </div>
  )
}
