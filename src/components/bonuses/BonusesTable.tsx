'use client'

import { useBonuses } from '@/providers/BonusesProvider'
import formatDate from '@/utils/DateFormat';
import { formatCurrency } from '@/utils/Format';
import Image from 'next/image';
import React, { useMemo, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default function BonusesTable({search}:Record<string,string>) {
  const {bonuses} = useBonuses();
  const [currentPage, setCurrentPage] = useState(1);
          const itemsPerPage = 10;
  const filteredBonuses = useMemo(()=>bonuses.filter(b => (b.user.firstName + ' ' + b.user.lastName).toLowerCase().includes(search.trim().toLowerCase()) || b.description.toLowerCase().includes(search.trim().toLowerCase())),[bonuses, search])
  
const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const totalPages = Math.ceil(filteredBonuses.length / itemsPerPage);

  
  return (
    <div className="rounded-lg shadow-lg w-full h-fit p-5 bg-white mb-8">
      <h1 className="text-[24px] font-bold py-4 mb-5">All Bonuses</h1>
      <div className='w-full h-fit rounded-lg border border-separate border-spacing-0 overflow-hidden'>
        <table className='w-full rounded-lg border table-fixed border-spacing-0 text-[14px] overflow-hidden'>
          <thead className='pl-5 py-3 h-[60px] border-b'>
            <tr className='bg-tertiary font-bold text-start'>
              <th className="px-5 py-3 text-start font-bold">
                Recipient
              </th>
              <th className="py-3 text-center font-bold">
                Description
              </th>
              <th className="py-3 text-center font-bold">
                Date
              </th>
              <th className="py-3 text-center font-bold">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBonuses.slice(indexOfFirstItem, indexOfLastItem).map(bonus => (
                <tr  key={bonus._id} className='hover:bg-tertiary cursor-pointer border-b last:border-b-0 transition-[background-color] ease-in duration-[0.4s]'>
                  <td className="py-3 pl-3 text-start flex gap-3 overflow-hidden">
                    <div className="flex gap-2 w-fit items-center">
                        <Image
                            src={bonus.user.userImage ?? '/images/profile_img.png'}
                            width={36}
                            height={36}
                            alt="profile pic"
                            className={`rounded-full w-[36px] h-[36px] object-cover ${bonus.user.userImage?'':'scale-150'}`}
                        />
                        <p className='font-medium'>{bonus.user.firstName} {bonus.user.lastName}</p>
                    </div>
                  </td>
                  <td className='py-3 text-center font-medium'>
                    {bonus.description}
                  </td>
                  <td className='py-3 text-center font-medium'>
                    {formatDate(bonus.dateSent, false)}
                  </td>
                  <td className="py-3 text-center font-bold">
                    {formatCurrency(bonus.amount)}
                  </td>                      
                </tr>
            ))}
            {filteredBonuses.length === 0 && <tr><td colSpan={4} className='text-center py-4'>{search.trim().length !== 0 ?`No search results for '${search}'`:'No Bonuses sent yet'}</td></tr>}
          </tbody>
        </table>
      </div>
      {/* Pagination Tabs Section */}
                    {filteredBonuses.length !== 0 && <div className='w-full flex flex-center mt-4 gap-4 py-2 relative'>
                      <button disabled={currentPage==1} onClick={()=> setCurrentPage(prev => Math.max(prev - 1, 1))} className='flex flex-center select-none outline-none w-9 h-[32px] text-black border-[1.5px] rounded-[7px] hover:bg-themeColor hover:border-0 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black disabled:hover:border-[1.5px]'>
                        <IoIosArrowBack size={16} />
                      </button>
            
                      <p className='text-secondary select-none text-sm'>Showing <span className='text-black font-semibold'>{currentPage}</span> out of <span className='text-black font-semibold'>{totalPages}</span></p>
            
                      <button disabled={currentPage == totalPages} onClick={()=>setCurrentPage(prev => Math.min(prev + 1, totalPages))} className='flex select-none flex-center outline-none w-9 h-[32px] border-[1.5px] text-black rounded-[7px] hover:bg-themeColor hover:border-0 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black disabled:hover:border-[1.5px]'>
                        <IoIosArrowForward size={16} />
                      </button>
                    </div>}
      


    </div>
  )
}
