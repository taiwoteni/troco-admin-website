'use client';

import BonusesTable from '@/components/bonuses/BonusesTable';
import SearchBar from '@/components/search-bar/SearchBar';
import React, { useState } from 'react'

export default function BonusesPage() {
  const [search, setSearch] = useState('');

  return (
    <div className='h-full overflow-y-scroll custom-scrollbar px-8 py-2'>
        <div className='w-full h-fit gap-8 flex flex-col'>
          <div className='w-full flex justify-between items-center'>
            <h1 className="text-gray-700 text-[25px] font-bold mb-5">Wallet Bonuses</h1>
            <SearchBar
              placeholder='Search Bonus'
              onChangeText={setSearch}
              value={search}
            />
          </div>
          <BonusesTable search={search} />
        </div>
    </div>
  )
}
