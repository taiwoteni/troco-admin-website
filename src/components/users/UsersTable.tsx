/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Routes from '@/app/routes';
import { useUsers } from '@/providers/UserProvider';
import formatDate from '@/utils/DateFormat';
import { user, User } from '@/utils/interfaces/user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { FaUser } from 'react-icons/fa';
import AestheticTabbar from '../switch/AestheticTabbar';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface props{
  search?: string,
}

export default function UsersTable({search=''}:props) {
    const {users} = useUsers();
    const [filter, setFilter] = useState<'Online' | 'Offline' | 'all'>('all')
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

       

    const userOnline = (u: user)=>{
      const currentTime = new Date();

        const lastSeen = new Date(u.lastSeen);
        
        if(currentTime.getFullYear() !== lastSeen.getFullYear()){
            return false;
        }

        if(currentTime.getMonth() !== lastSeen.getMonth()){
            return false;
        }

        if(currentTime.getDay() !== lastSeen.getDay()){
            return false;
        }

        if(currentTime.getHours() !== lastSeen.getHours()){
            return false;
        }

        if((currentTime.getMinutes() - lastSeen.getMinutes()) <= 4){
            return true;
        }

        return false;
    };

    const filterMethod = (u: user)=>{
      const name = (u.firstName + " " + u.lastName).toLowerCase().trim().includes(search.trim().toLowerCase());
      const category = (u.accountType ?? '').toLowerCase().trim().includes(search.trim().toLowerCase())
      const online = userOnline(u) && filter === 'Online';
      const offline = !userOnline(u) && filter === 'Offline';

      return (name || category) && (filter == 'all' || online || offline) 
    };

    const filteredUsers = useMemo(()=> users.filter(u => filterMethod(u)),[users, filter, search])
    
    // Calculate indices
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  return (
    <div className='rounded-lg shadow-lg w-full h-fit min-h-[400px] px-5 pb-5 bg-white mb-8'>
        <div className='flex items-center justify-between py-4 my-5'>
            <h1 className="text-[24px] font-bold">
                {filter === "all" && "All Users"}
                {filter === "Offline" && "Offline Users"}
                {filter === "Online" && "Online Users"}
            </h1>

            <div className='w-[300px]'>
                <AestheticTabbar className='h-[40px]' tabs={['All', 'Online', 'Offline']} onSelectTab={(o) => setFilter(o === 0? 'all': o ===1? 'Online':'Offline')} index={filter === 'all'? 0:filter === 'Online'?1:2} />
            </div>
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
                    Email
                  </th>
                  <th className="py-3 text-center font-bold">
                    Transactions
                  </th>
                  <th className="py-3 text-center font-bold">
                    Joined
                  </th>
                  <th className="py-3 text-center font-bold pr-3">
                    KYC Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  filteredUsers.length <=0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4">{search.trim().length !== 0? `No search results for '${search.trim()}'`:`No ${filter === 'all'? "\b": filter.charAt(0).toUpperCase() + filter.substring(1)} users found`}</td>
                    </tr>
                  )
                }
                {filteredUsers.length !== 0 && (
                  filteredUsers.slice(indexOfFirstItem, indexOfLastItem).map((user, index) => {
                    const userData = new User(user)
                    return <tr
                    key={index}
                    onClick={() => {
                      router.push(Routes.dashboard.users.path + "/" + user._id);
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
                    <td className="py-3 text-center">{user.email}</td>
                    <td className="py-3 text-center">
                      {userData.transactionsString?.length}
                    </td>
                    <td className="py-3 text-center">
                      {formatDate(userData.createdDate, false)}
                    </td>
                    <td className="py-3 text-center">Teir {user.kycTier}</td>
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
