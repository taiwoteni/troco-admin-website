'use client'

import { useAdmin } from '@/providers/AdminProvider';
import { useTransactions } from '@/providers/TransactionsProvider'
import { Transaction_Status, TransactionCategory } from '@/utils/interfaces/transaction';
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation';
import Routes from '@/app/routes';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa6';
import formatDate from '@/utils/DateFormat';
import { formatCurrency } from '@/utils/Format';
import { Colors } from '@/utils/Colors';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export function getStatusColor(status:string):string{
  switch(status.trim().toLowerCase()){
      case 'pending':
          return 'brown'
      case 'in progress':
          return '#ffc400';
      case 'processing':
          return '#ff33aa';
      case 'ongoing':
          return 'purple';
      case 'finalizing':
          return '#960096';   
      case 'completed':
          return Colors.themeColor;
      case 'approved':
          return Colors.themeColor;                  
      default:
          return 'red'
  }
}

interface props{
  search?: string
}

export default function TransactionTable({search=''}:props) {
    const {admin} = useAdmin();
    const [filter] = useState<TransactionCategory | Transaction_Status | 'all'>('all')
    const {allTransactions, transactions} = useTransactions();
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

    const filteredTransactions = useMemo(()=>(admin?.role !== 'Admin'? allTransactions : transactions).filter(t =>  (search.trim().length === 0 || [t.typeOftransaction, t.status, t.transactionName].some((value)=> value.trim().toLowerCase().includes(search.toLowerCase())))),[admin?.role, allTransactions, transactions, search])

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    
  return (
    <div className='rounded-lg shadow-lg w-full h-fit min-h-[400px] px-5 pb-5 bg-white mb-8'>
        <div className='flex items-center justify-between py-4 my-5'>
            <h1 className="text-[24px] font-bold">
                {filter === "all" && "All Transactions"}
                {filter === "product" && "Product Transactions"}
                {filter === "service" && "Service Transactions"}
                {filter === "virtual" && "Virtual Transactions"}
                {!['all', 'product', 'service', 'virtual'].includes(filter) && `${filter} Transactions`}
            </h1>

        </div>

        <div className="w-full h-fit rounded-lg border border-separate border-spacing-0 overflow-hidden">
            <table className="w-full rounded-lg border table-fixed border-spacing-0 text-[14px] overflow-hidden">
              <thead className="px-5 py-3 h-[60px] border-b">
                <tr className='bg-tertiary'>
                <th className="pl-5 py-3 text-start font-bold">
                    Creator
                  </th>
                  <th className="py-3 text-center font-bold">
                    Name
                  </th>
                  <th className="py-3 text-center font-bold">
                    Category
                  </th>
                  <th className="py-3 text-center font-bold">
                    Created
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
                {
                  filteredTransactions.length <=0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-4">{search.trim().length !== 0? `No search results for '${search.trim()}'`:`No ${filter === 'all'? "\b": filter.charAt(0).toUpperCase() + filter.substring(1)} transactions found`}</td>
                    </tr>
                  )
                }
                {filteredTransactions.length !== 0 && (
                  filteredTransactions.slice(indexOfFirstItem, indexOfLastItem).map((transaction, index) => {
                    // const userData = new User(transaction)
                    return <tr
                    key={index}
                    onClick={() => {
                      router.push(Routes.dashboard.transactions.path + "/" + transaction._id);
                    }}
                    className="cursor-pointer hover:bg-tertiary font-quicksand font-[400] border-b last:border-b-0 transition-[background-color] ease-in duration-[0.4s]"
                  >
                    <td className="py-3 pl-3  overflow-hidden">
                      <div className="flex gap-2 items-center">
                        {transaction.creatorImage ? (
                          <Image
                            src={transaction.creatorImage}
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
                        <p>{transaction.creatorName}</p>
                      </div>
                    </td>
                    <td className="py-3 text-center overflow-hidden text-ellipsis whitespace-nowrap">{transaction.transactionName}</td>
                    <td className="py-3 text-center">{transaction.typeOftransaction.charAt(0).toUpperCase() + transaction.typeOftransaction.substring(1).toLowerCase()}</td>
                    <td className="py-3 text-center">
                      {formatDate(transaction.createdTime,false)}
                    </td>
                    <td style={{color: getStatusColor(transaction.status)}} className="py-3 text-center font-medium">
                      {transaction.status}
                    </td>
                    <td className="py-3 text-center font-medium">{!transaction.totalTransactionAmount?"Free" : formatCurrency(transaction.totalTransactionAmount)}</td>
                  </tr>
                  })
                )}
              </tbody>
            </table>
        </div>
        {/* Pagination Tabs Section */}
        {filteredTransactions.length !== 0 && <div className='w-full flex flex-center mt-4 gap-4 py-2 relative'>
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
