'use client';

import Routes from '@/app/routes';
import { useUsers } from '@/providers/UserProvider';
import { AccountType, User } from '@/utils/interfaces/user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { FaUser } from 'react-icons/fa';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface props{
  search?: string
}

export default function KycTable({search= ''}:props) {
    const {users} = useUsers();
    const [filter] = useState<AccountType | 'all'>('all')
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const filteredUsers = useMemo(()=>users.filter(u => u.kycTier !== u.kyccurrentTier).filter(u => (search.trim().length ==0 || [u.firstName + " " + u.lastName, u.accountType ?? "personal", u.kycTier, u.kyccurrentTier].some((value)=> value.toString().trim().toLowerCase().includes(search.trim().toLowerCase())))),[users, search])

    // Calculate indices
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  return (
    <div className='rounded-lg shadow-lg w-full h-fit min-h-[400px] px-5 pb-5 bg-white mb-8'>
        <div className='flex items-center justify-between py-4 my-5'>
            <h1 className="text-[24px] font-bold">
                {filter === "all" && "All KYC"}
                {filter === "company" && "Company KYC"}
                {filter === "business" && "Business KYC"}
                {filter === "merchant" && "Merchant KYC"}
                {filter === "personal" && "Personal KYC"}
            </h1>
        </div>

        <div className="w-full h-fit rounded-lg border border-separate border-spacing-0 overflow-hidden">
            <table className="w-full rounded-lg border table-fixed border-spacing-0 text-[14px] overflow-hidden">
              <thead className="px-5 py-3 h-[60px] border-b">
                <tr className='bg-tertiary'>
                  <th className="pl-5 py-3 text-start font-bold">
                    Names
                  </th>
                  <th className="py-3 text-center font-bold">
                    Category
                  </th>
                  <th className="py-3 text-center font-bold">
                    Upload Type
                  </th>
                  <th className="py-3 text-center font-bold">
                    Current Tier
                  </th>
                  <th className="py-3 text-center font-bold pr-3">
                    Request Tier
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  filteredUsers.length <=0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">{search.trim().length !== 0? `No search results for '${search.trim()}'`:`No ${filter === 'all'? "KYC": filter.charAt(0).toUpperCase() + filter.substring(1)} requests found`}</td>
                    </tr>
                  )
                }
                {filteredUsers.length !== 0 && (
                  filteredUsers.slice(indexOfFirstItem, indexOfLastItem).map((user, index) => {
                    const userData = new User(user)
                    return <tr
                    key={index}
                    onClick={() => {
                      router.push(Routes.dashboard.users.path + "/" + user._id + "/?v=kyc");
                    }}
                    className="cursor-pointer hover:bg-tertiary font-quicksand font-[400] border-b last:border-b-0 transition-[background-color] ease-in duration-[0.4s]"
                  >
                    <td className="py-3 pl-3  overflow-hidden">
                      <div className="flex gap-2 items-center">
                        {user.userImage ? (
                          <Image
                            src={user.userImage}
                            width={36}
                            height={36}
                            alt="profile pic"
                            className="rounded-full w-[36px] h-[36px] object-cover"
                          />
                        ) : (
                          <div className="rounded-full w-[36px] h-[36px] overflow-hidden bg-gray-200 flex items-end justify-center">
                            <FaUser className="text-gray-400 text-[32px]" />
                          </div>
                        )}
                        <p>{userData.firstName + " " + userData.lastName}</p>
                        {userData.verified && <Image className='object-cover w-4 h-4' src='/icons/dashboard/verification.svg' width={50} height={50} alt="verification icon" />}
  
                      </div>
                    </td>
                    <td className="py-3 text-center">{userData.accountCategory.charAt(0).toUpperCase() + userData.accountCategory.slice(1).toLowerCase()}</td>
                    <td className="py-3 text-center">
                      {user.kyccurrentTier === 1 && "Formal Picture"}
                      {user.kyccurrentTier === 2 && "Identity Document"}
                      {user.kyccurrentTier === 3 && "Nepa Bill"}
                    </td>
                    <td className="py-3 text-center">Teir {user.kycTier}</td>
                    <td className="py-3 text-center">Teir {user.kyccurrentTier}</td>
                  </tr>
                  })
                )}
              </tbody>
            </table>
        </div>
        {/* Pagination Tabs Section */}
        {filteredUsers.length !== 0 && <div className='w-full flex flex-center mt-4 gap-4 py-2 relative'>
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
