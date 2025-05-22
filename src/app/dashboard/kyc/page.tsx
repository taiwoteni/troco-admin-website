'use client';

import KycTable from '@/components/kyc/KycTable';
import SearchBar from '@/components/search-bar/SearchBar';
import React, { useState } from 'react'

export default function KYCPage() {
  const [search, setSearch] = useState('');
  
  return (
    <div className='h-full overflow-y-scroll custom-scrollbar px-8 pb-2'>
      <div className='w-full h-fit flex flex-col gap-8 mt-2'>
        <div className='w-full flex justify-between'>
          <p className='text-secondary text-[26px] font-bold'>KYC</p>
          <SearchBar placeholder='Search By Name' value={search} onChangeText={setSearch}/>
        </div>
        
          <KycTable search={search} />

      </div>
    </div>
  )
}
