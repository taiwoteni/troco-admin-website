'use client'

import AdminsTable from '@/components/admins/AdminsTable';
import SearchBar from '@/components/search-bar/SearchBar';
import React, { useState } from 'react'

export default function AdminsPage() {
  const [search, setSearch] = useState('');
  
  return (
    <div className='h-full overflow-y-scroll custom-scrollbar px-8 py-2'>
      <div className='w-full h-fit gap-8 flex flex-col'>
        <div className='w-full flex justify-between items-center'>
          <h1 className="text-gray-700 text-[25px] font-bold mb-5">Admins</h1>
          <SearchBar
            placeholder='Search Admins'
            onChangeText={setSearch}
            value={search}
          />
        </div>
        
      </div>

      <AdminsTable search={search}  />
    </div>
  )
}
