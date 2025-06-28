'use client';

import Routes from "@/app/routes";
import PopupModal from "@/components/modal/PopupModal";
import SearchBar from "@/components/search-bar/SearchBar";
import AestheticTabbar from "@/components/switch/AestheticTabbar"
import { useTransactions } from "@/providers/TransactionsProvider";
import { useUsers } from "@/providers/UserProvider";
import modalProps from "@/utils/interfaces/modal";
import { reportDetail } from "@/utils/interfaces/report";
import { user } from "@/utils/interfaces/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


export default function ReportsPage() {
  const [type, setType] = useState<number>(0)
  const {reportedTransactions} = useTransactions();
  const {reportedUsers} = useUsers();
  const [modal, setModal] = useState<modalProps | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const router = useRouter();

  const [search, setSearch] = useState('');

  const data = useMemo(()=>(type==0?reportedUsers : reportedTransactions).filter(d => (type == 0? ((d as user).firstName + " " + (d as user).lastName): (d as reportDetail).transaction?.transactionName ?? '').toLowerCase().includes(search.trim().toLowerCase())), [type, reportedTransactions, reportedUsers, search])
  
  // Calculate indices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  

  return (
    <div className="h-full overflow-y-scroll custom-scrollbar px-8 pb-2">

      <div className="w-full h-fit flex flex-col gap-8 mt-2">
        <div className="w-full flex justify-between">
          <h1 className="text-secondary text-[26px] font-bold">Reports</h1>
          
          <SearchBar placeholder='Search By Name' value={search} onChangeText={setSearch}/>
        </div>

        {/* Reported Users Table */}
        <div className="rounded-lg shadow-lg w-full h-fit px-5 pb-5 bg-white mb-8">
          
          {/* Head */}
          <div className='flex items-center justify-between py-4 my-5'>
            <h1 className="text-[24px] font-bold">Reported {type === 0? "Users":"Transactions"}</h1>

            <div className='w-[300px]'>
                <AestheticTabbar className='h-[40px]' tabs={['Users', 'Transactions']} onSelectTab={setType} index={type} />
            </div>
          </div>

          {/* Table */}
          <div className="w-full h-fit rounded-lg border border-separate border-spacing-0 overflow-hidden">
            <table className="w-full rounded-lg border table-fixed border-spacing-0 text-[14px] overflow-hidden">
              {/* Table Header */}
              <thead className="px-5 py-3 h-[60px] border-b">
                <tr className='bg-tertiary'>
                  <th className="pl-5 py-3 text-start font-bold">{type == 0? "Name":"Perpetrator"}</th>
                  <th className="py-3 text-center font-bold">{type == 0? "Reporter":"Transaction"}</th>
                  <th className="py-3 text-center font-bold">{type == 0? "Reason":"Reporter"}</th>
                  <th className="py-3 text-center font-bold pr-3">{type == 0? "No. of Reports":"Reason"}</th>
                </tr>
              </thead>

              <tbody>
                {data.slice(indexOfFirstItem, indexOfLastItem).map(d =>{
                if(type === 0){
                  const user = (d as user);
                  const report = user.reports.details?.findLast(()=> true);
                  const reason = report?.reason.includes(':')? report.reason.substring(0, report.reason.indexOf(':')): "Other";
                  const description = report?.reason.includes(':')? report.reason.substring(reason.length+1): "(No Description)"

                  return <tr onClick={()=>{
                                    setModal({
                                        title:`Report Details`,
                                        question: <span>Reason: <span className="font-bold">{reason}</span><br/><br/> Description: <span className="font-bold">{description}</span></span>,
                                        onCancel:()=>setModal(null),
                                        onOk:()=>router.push(Routes.dashboard.users.path + "/" + user._id),
                                        okText:'View User',
                                        cancelText:'Close'
                                    })
                                  }} key={user._id} className='hover:bg-[#F9F8F6] cursor-pointer border-b last:border-b-0 transition-[background-color] ease-in duration-[0.4s]'>
                          <td className="py-3 pl-3 text-start flex gap-3 overflow-hidden">
                              <div className="flex gap-2 w-fit items-center">
                                  <Image
                                      src={user.userImage ?? '/images/profile_img.png'}
                                      width={36}
                                      height={36}
                                      alt="profile pic"
                                      className={`rounded-full w-[36px] h-[36px] object-cover ${user.userImage?'':'scale-150'}`}
                                  />
                                  <p className='font-medium'>{user.firstName} {user.lastName}</p>
                              </div>
                          </td>
                          <td className='py-3 text-center font-medium overflow-hidden whitespace-nowrap text-ellipsis'>
                            <div className="flex gap-2 w-full items-center justify-center">
                                  <Image
                                      src={report?.reporter.userImage ?? '/images/profile_img.png'}
                                      width={36}
                                      height={36}
                                      alt="profile pic"
                                      className={`rounded-full w-[36px] h-[36px] object-cover ${report?.reporter.userImage?'':'scale-150'}`}
                                  />
                                  <p className='font-medium whitespace-nowrap text-ellipsis'>{report?.reporter.firstName} {report?.reporter.lastName}</p>
                              </div>
                          </td>
                          <td className='py-3 text-center font-medium whitespace-nowrap text-ellipsis overflow-hidden'>
                              {reason}
                          </td>
                          <td className='py-3 text-center font-bold'>
                              {user.reports.count}
                          </td>
                          
                  </tr>
                }

                const report = (d as reportDetail);
                const reason = report?.reason.includes(':')? report.reason.substring(0, report.reason.indexOf(':')): "Other";
                const description = report?.reason.includes(':')? report.reason.substring(reason.length+1): "(No Description)"
                return <tr onClick={()=>{
                                    setModal({
                                        title:`Report Details`,
                                        question: <span>Reason: <span className="font-bold">{reason}</span><br/><br />Description: <span className="font-bold">{description}</span></span>,
                                        onCancel:()=>setModal(null),
                                        onOk:()=>router.push(Routes.dashboard.transactions.path + "/" + report._id),
                                        okText:'View Transaction',
                                        cancelText:'Close'
                                    })
                                  }} key={report._id} className='hover:bg-[#F9F8F6] cursor-pointer border-b last:border-b-0 transition-[background-color] ease-in duration-[0.4s]'>
                                      <td className="py-3 pl-3 text-start flex gap-3 overflow-hidden">
                                          <div className="flex gap-2 w-fit items-center">
                                              <Image
                                                  src={report.reportedUser?.userImage ?? '/images/profile_img.png'}
                                                  width={36}
                                                  height={36}
                                                  alt="profile pic"
                                                  className={`rounded-full w-[36px] h-[36px] object-cover ${report.reportedUser?.userImage?'':'scale-150'}`}
                                              />
                                              <p className='font-medium whitespace-nowrap text-ellipsis'>{report.reportedUser?.firstName} {report.reportedUser?.lastName}</p>
                                          </div>
                                      </td>
                                      <td className='py-3 text-center font-medium whitespace-nowrap text-ellipsis'>
                                          {report.transaction?.transactionName}
                                      </td>
                                      <td className='py-3 text-center font-medium whitespace-nowrap text-ellipsis'>
                                        <div className="flex gap-2 w-full items-center justify-center overflow-hidden">
                                              <Image
                                                  src={report.reporter.userImage ?? '/images/profile_img.png'}
                                                  width={36}
                                                  height={36}
                                                  alt="profile pic"
                                                  className={`rounded-full w-[36px] h-[36px] object-cover ${report.reporter.userImage?'':'scale-150'}`}
                                              />
                                              <p className='font-medium whitespace-nowrap text-ellipsis'>{report.reporter.firstName} {report.reporter.lastName}</p>
                                          </div>
                                      </td>
                                      <td className='py-3 text-center font-medium whitespace-nowrap text-ellipsis overflow-hidden'>
                                          {reason}
                                      </td>
                                      
                                  </tr>
                  })}

                  {data.length === 0 && <tr>
                    <td colSpan={4} className="text-center py-4">{search.trim().length !== 0? `No search results for '${search.trim()}'`:`No reports found`}</td>
                  </tr>
                  }
              </tbody>
            </table>

          </div>

          {/* Pagination Tabs Section */}
          {data.length !== 0 && <div className='w-full flex flex-center mt-4 gap-4 py-2 relative'>
            <button disabled={currentPage==1} onClick={()=> setCurrentPage(prev => Math.max(prev - 1, 1))} className='flex flex-center select-none outline-none w-9 h-[32px] text-black border-[1.5px] rounded-[7px] hover:bg-themeColor hover:border-0 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black disabled:hover:border-[1.5px]'>
              <IoIosArrowBack size={16} />
            </button>
  
            <p className='text-secondary select-none text-sm'>Showing <span className='text-black font-semibold'>{currentPage}</span> out of <span className='text-black font-semibold'>{totalPages}</span></p>
  
            <button disabled={currentPage == totalPages} onClick={()=>setCurrentPage(prev => Math.min(prev + 1, totalPages))} className='flex select-none flex-center outline-none w-9 h-[32px] border-[1.5px] text-black rounded-[7px] hover:bg-themeColor hover:border-0 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-black disabled:hover:border-[1.5px]'>
              <IoIosArrowForward size={16} />
            </button>
          </div>}





        </div>

      </div>

      {modal && <PopupModal modal={modal} />}


      

    </div>
  )
}
