'use client'

import LottieWidget from '@/components/lottie/LottieWidget';
import loadingAnim from '../../../../../public/lottie/loading_water.json'
import FilterItem from '@/components/switch/FilterItem'
import { useUser } from '@/providers/UserProvider';
import { useParams, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { User } from '@/utils/interfaces/user';
import Link from 'next/link';
import Image from 'next/image';
import { Colors } from '@/utils/Colors';
import formatDate from '@/utils/DateFormat';
import Button from '@/components/Button';
import LoadingLayout from '@/components/loading/LoadingLayout';
import { useAdmin } from '@/providers/AdminProvider';
import emptyAnim from '../../../../../public/lottie/empty.json';
import transactionsAnim from "../../../../../public/lottie/empty-transactions.json";
import moneyBagAnim from "../../../../../public/lottie/money-bag.json";
import { Add, Coin, Magicpen } from 'iconsax-react';
import CompactGroupItemLayout from '@/components/groups/CompactGroupItemLayout';
import TransactionItemLayout from '@/components/transactions/TransactionItemLayout';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { approveKYC, blockUser, deleteUser, rejectKYC, revertKYC, sendMessageToUser, sendWalletBonus, unblockUser, updateUser } from '@/services/rest-api/user-api';
import PopupModal from '@/components/modal/PopupModal';
import modalProps from '@/utils/interfaces/modal';
import { FaSpinner } from 'react-icons/fa6';
import CountingText from '@/components/texts/CountingText';
import WalletTransactionItem from '@/components/wallet/WalletTransactionItem';
import { formatCurrency } from '@/utils/Format';
import Routes from '@/app/routes';
import ReferralItemLayout from '@/components/referrals/ReferralItemLayout';

type UserNavigationType = "Wallet" | "KYC" | "User Details";

const getPage  = (d?: string | null)=> {
    switch(d?.toLowerCase().trim()){
        case 'wallet':
                return 'Wallet'
        case 'kyc':
            return 'KYC'
        default:
            return 'User Details';
    }
}

export default function ViewUserPage() {
    const {id:userID} = useParams()
    /// params for the type of details to show is `v`
    const router = useRouter();
    const params = useSearchParams();
    const filter = getPage(params.get('v'))
    const {admin} = useAdmin()

    const userData = useUser(userID!.toString());
    const referrals = useMemo(()=> userData.referrals ?? [],[userData.referrals]);
    const walletHistory = useMemo(()=> userData.wallet ?? [], [userData.wallet])
    const user = useMemo(()=>!userData.user? undefined: new User(userData.user), [userData.user])

    const [reason, setReason] = useState('')
    const [type, setType] = useState<'bonus' | 'refund'>('bonus')
    const [amount, setAmount] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bonusModal, setBonusModal] = useState(false);
    const [messageContent, setMessageContent] = useState('');
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [modal, setModal] = useState<modalProps | undefined>();
    const [editMode, setEditMode] = useState(false)
    const [editValue, setEditValue] = useState<string | undefined>();
    const [showDetails, setShowDetails] = useState(true);
    const [edittedBusinessName, setBusinessName] = useState<string | undefined>()

    const sendMessageMutation = useMutation({
        mutationFn: ()=> sendMessageToUser(user!.id, admin!._id, messageContent, true),
        onSuccess: () => {
            toast.success("Message sent successfully.");
            setIsMessageModalOpen(false); // Close the modal after sending
            setMessageContent(''); // Clear the message content
        },
        onError: () => {
            toast.error(`Error sending message`);
        },
    }
    );

    const blockUserMutation = useMutation({
        mutationFn: ()=> user!.isBlocked? unblockUser(user!.id, admin!._id, true) : blockUser(user!.id, admin!._id, true),
        onSuccess: () => {
            toast.success(`User has been ${user!.isBlocked ? 'unblocked' : 'blocked'} successfully`);
        },
        onError: () => {
            toast.error(`Error ${user!.isBlocked ? 'unblock' : 'block'}ing user`);
        },
    }
    );

    const deleteUserMutation = useMutation({
        mutationFn: ()=> deleteUser(user!.id, true),
        onSuccess: async() => {
            toast.success(`User has been deleted successfully`);
            await userData.refresh();
            router.back()
        },
        onError: () => {
            toast.error(`Error deleting user`);
        },
    }
    );

    const editUserMutation = useMutation({
        mutationFn: ()=>updateUser(user!.id, {
            ...userData.user!,
            BusinessName: edittedBusinessName ?? userData.user!.BusinessName
        }, true),
        onSuccess: async(data) => {
            console.log(data)
            await userData.refresh()
            editUserMutation.reset();
            toast.success("Editted User's Details");

        },
        onError: () => {
            toast.error(`Couldn't edit user`);
        },
        }
    );

    const sendBonusMutation = useMutation({
        mutationFn: ()=>sendWalletBonus(user!.id, amount, reason, type),
      onSuccess:()=>{
        toast.success('Reward Bonus Sent')
        setBonusModal(false)
      },
      onError:()=>{
        toast.error("Couldn't Send Bonus")
      }
    })

     // handle kyc aproval
  const approveKycDocs = useMutation({
    mutationFn: ()=>approveKYC(user!.id, admin!._id, true),
      onSuccess: async() => {
        toast.success("KYC approved successfully.");
        await userData.refresh()
        approveKycDocs.reset()
      },
      onError: () => {
        toast.error(`Error approving KYC`);
      },
    }
  );

  // handle kyc aproval
  const disapproveKycDocs = useMutation({
    mutationFn: ()=>rejectKYC(user!.id, admin!._id, true),
      onSuccess: async() => {
        toast.success("Rejected Kyc Details");
        await userData.refresh()
        disapproveKycDocs.reset()
      },
      onError: (error) => {
        console.log(error);
        toast.error(`Error disapproving KYC`);
      },
    }
  );

  const revertKycDocs = useMutation({
    mutationFn: ()=>revertKYC(user!.id, true),
      onSuccess: async() => {
        toast.success("Reverted Kyc Details");
        await userData.refresh()
        revertKycDocs.reset()
      },
      onError: (error) => {
        console.log(error);
        toast.error(`Error reverting KYC`);
      },
    }
  );

    if(!user){
        return <div className='w-full h-full flex flex-col gap-2 flex-center'>
            <LottieWidget lottieAnimation={loadingAnim} className='w-[200px] h-[200px] aspect-square object-cover' />
            <h2 className='text-[25px] font-bold font-lato'>{"Loading this user's data"}</h2>
            <p className='text-secondary font-quicksand -mt-1 text-sm'>Give us <b>a</b> minute.</p>
        </div>
    }

   const profileIcon = ()=>{
        return <div className="relative w-[100px] h-[100px] ">
            <Image className={`w-full h-full object-cover rounded-[50%] ${!user?.profile? 'scale-150':''}`} alt={`${user!.fullName}'s profile photo`} width={200} height={200} src={user?.profile ?? '/images/profile_img.png'} priority={true} />
            <div className="w-[27%] h-[27%] border-white border-[3px] box-border rounded-[50%] absolute bottom-[-2px] right-[8px] z-10" style={{backgroundColor:user!.online? Colors.themeColor:'red'}} />
        </div>
    }

    const handleBlockToggle = () => {
        if (user) {
        setIsModalOpen(false);
        blockUserMutation.mutate();
        }
    };

    const handleSendMessage = () => {
        sendMessageMutation.mutate();
    };

    const toggleBlur = (fieldName:string)=>{
        if(editValue !== fieldName){
            console.log(fieldName)
            setEditMode(true)
            setEditValue(fieldName)

            return;
        }
        
        setEditValue(undefined);

    }

    function EditIcon({fieldName}:{fieldName:string}){

        return (
        <div onClick={()=>toggleBlur(fieldName)} className="flex justify-end items-center text-[19px] cursor-pointer font-extrabold text-themeColor">
            {editValue !== fieldName && <Magicpen color={Colors.themeColor} className='text-themeColor' />}

            {editValue === fieldName && <Add color={Colors.themeColor} className='rotate-45 text-themeColor' />}
        </div>
        )

    }

    const navigate = (a: UserNavigationType)=>{
       router.push(Routes.dashboard.users.path + '/' +userID+'/?v='+a.toLowerCase(),)
    }

    const userDetails = ()=>(
        <div className="flex gap-7 mt-10 w-full">
          {/* information side */}
          <div className="flex flex-col flex-1 gap-7">
            {/* Brief information side */}
            <div className="rounded-2xl bg-white shadow-lg px-8 py-8 w-full h-fit">
              {/* div containing profile image and brief user details */}
              <div className='flex gap-7 items-start'>
                <div className="mt-3">{profileIcon()}</div>
                <div className="flex-1 flex flex-col items-start">
                  <div className="flex h-fit w-fit gap-2 items-center">
                    <p className="text-[26px] text-center"><span className="font-bold">{user.firstName}</span>{` ${user.lastName}`}</p>
                    {user.verified && <Image className='object-cover w-[23px] h-[23px]' src='/icons/dashboard/verification.svg' width={50} height={50} alt="verification icon" />}
                  </div>
                  <p className='text-[17px] font-medium ml-0.5 mb-4'>{` ${user.accountCategory} User`}</p>
                  <p className='max-w-[50%] text-[17px]'>{user.fullAddress}</p>

                  {user.tryingToVerify && <p onClick={()=> navigate('KYC')} style={{color:Colors.themeColor}} className='hover:underline text-[14px] mt-2 cursor-pointer'>Pending KYC Document</p>}

                  <div className='flex gap-3 mt-4'>
                    <button className={`rounded-[25px] w-[120px] py-[10px] font-semibold cursor-pointer border-[#109E15] text-[#109E15] border-[2px]`}
                        onClick={() => setIsMessageModalOpen(true)}>Message</button>
                    <button className={`rounded-[30px] w-[115px] py-[10px] font-semibold cursor-pointer ${user.isBlocked? 'border-red-500 text-red-500 border-[2px]':'bg-red-500 text-white'}`}
                        onClick={() => setIsModalOpen(true)}
                        disabled={blockUserMutation.isPending}>{blockUserMutation.isPending?'Hold On..':user.isBlocked?'Unblock':'Block'}</button>
                    
                    <button className={`rounded-[30px] w-[115px] py-[10px] font-semibold cursor-pointer ${!user.isBlocked? 'border-red-500 text-red-500 border-[2px]':'bg-red-500 text-white'}`}
                        onClick={() =>{
                          setModal({
                            title:"Delete User",
                            question:"Are you sure you want to delete this user?",
                            negative:true,
                            onOk: ()=>{
                              setModal(undefined)
                              deleteUserMutation.mutate()
                            },
                            onCancel: ()=>{
                              setModal(undefined)
                            },
                            okText:'Yes, Delete'
                          })
                        }}
                        disabled={deleteUserMutation.isPending}>{deleteUserMutation.isPending?'Deleting..':'Delete'}</button>
                  </div>
                </div>
              </div>
            </div>

            {/* User Details and Groups side */}
            <div className="rounded-2xl shadow-lg bg-white p-5 pt-0 pb-5 min-h-[400px] w-full h-fit">
              <div className="bg-inherit pt-5 pb-2">
                <div className="flex gap-4 pt-2 pb-0.5">
                  <button onClick={()=>setShowDetails(true)} className={`rounded-[25px] w-[120px] py-[10px] font-semibold cursor-pointer text-[#109E15] ${showDetails? 'border-[2px] border-[#109E15]':''}`}>Details</button>
                  <button  onClick={()=>setShowDetails(false)}className={`rounded-[25px] w-[120px] py-[10px] font-semibold cursor-pointer text-[#109E15] ${!showDetails? 'border-[2px] border-[#109E15]':''}`}>Groups</button>
                </div>
              </div>
              <div className="gap-4">
                {showDetails && <div className="px-1 h-fit">
                  <div className="flex flex-col py-4 w-full border-b items-start">
                    <p className='text-gray-400 text-[13px]'>USER ID</p>
                    <p className='text-black font-medium'>{user.id}</p>
                  </div>
                  <div className="flex flex-col w-full py-4 border-b items-start">
                    <p className='text-gray-400 text-[13px]'>EMAIL ADDRESS</p>
                    <p className='text-black font-medium'>{user.email}</p>
                  </div>
                  <div className="flex flex-col w-full py-4 border-b items-start">
                    <p className='text-gray-400 text-[13px]'>PHONE NUMBER</p>
                    <p className='text-black font-medium'>{user.phoneNumber}</p>
                  </div>
                  <div className="flex flex-col w-full py-4 border-b items-start">
                    <p className='text-gray-400 text-[13px]'>BUSINESS NAME</p>
                    <div className='w-full text-black font-medium flex justify-between'>
                        {
                          editValue === 'businessName'?
                          <input
                            type="text"
                            value={edittedBusinessName ?? user.businessName}
                            onChange={(e)=>{
                              setBusinessName(e.target.value)
                            }}
                            onBlur={()=>toggleBlur('businessName')}
                            autoFocus
                           />
                          :
                          <p>{edittedBusinessName ?? user.businessName}</p>
                        }
                        <EditIcon fieldName={'businessName'} />
                    </div>
                  </div>
                  <div className="flex flex-col w-full py-4 border-b items-start">
                    <p className='text-gray-400 text-[13px]'>ACCOUNT TYPE</p>
                    <p className='text-black font-medium'>{user.accountCategory}</p>
                  </div>
                  <div className="flex flex-col w-full py-4 border-b items-start">
                    <p className='text-gray-400 text-[13px]'>KYC VERIFICATION</p>
                    <p className='text-black font-medium'>{user.kycTier === 0? "Not Verified":`Tier ${user.kycTier} Verified`}</p>
                  </div>
                  <div className="flex flex-col w-full border-b py-4 items-start">
                    <p className='text-gray-400 text-[13px]'>REFERRAL CODE</p>
                    <p className='text-black font-medium'>{user.referralCode}</p>
                  </div>
                  <div className="flex flex-col w-full py-4 items-start">
                    <p className='text-gray-400 text-[13px]'>DATE JOINED</p>
                    <p className='text-black font-medium'>{formatDate(user.createdDate)}</p>
                  </div>

                  {editMode && <Button title="Save Changes" loading={editUserMutation.isPending || editUserMutation.isSuccess} onClick={()=>editUserMutation.mutate()}/>}
                  </div>}
                {!showDetails && user.groups.map((group)=>(
                  <div key={group._id}>
                  <CompactGroupItemLayout group={group} userId={user.id}/>
                </div>
                ))}
                {!showDetails && user.groups.length===0 && <LoadingLayout lottie={emptyAnim} label={`${user.firstName} doesn't have any groups`} style={{boxShadow:'none'}} />}
              </div>
            </div>
          </div>

          {/* Transactions Side */}
          <div className="flex flex-col gap-3 h-[500px] ">

            <div className="rounded-2xl shadow-lg bg-white p-5 pt-0 pb-5 min-h-[400px] w-[500px] flex-1 overflow-y-auto custom-scrollbar">
              <div className="sticky top-0 bg-inherit pt-5 pb-2">
                <h1 className="text-[22px] text-[#202224] font-bold pt-2 pb-0.5">
                  Transactions
                </h1>
              </div>
              <div className="gap-4">
              {user.transactions.map((transaction, index) => (
                <div key={transaction.id}>
                  <Link href={Routes.dashboard.transactions.path + "/" + transaction.id}>
                    <TransactionItemLayout transaction={transaction.rawData} style={{borderBottomWidth: index !== user.transactions.length-1? 2:0}} />
                  </Link>
                </div>
              ))}
              {user.transactions.length === 0 && <LoadingLayout className='h-[400px]' lottie={emptyAnim} label={`${user.firstName} doesn't have any transactions`} style={{boxShadow:'none', fontSize:'14px'}} />}
              </div>
            </div>
          </div>
        </div>
    )

    const walletDetails = ()=>(
        <div className="w-full flex justify-center gap-5">
            <div className="flex flex-col flex-1 gap-5">
                {/* Wallet Details */}
                <div className="rounded-3xl w-full bg-themeColor relative overflow-hidden">
                    <div className="w-[160px] h-[160px] rounded-[50%] absolute -right-[35px] -top-[40px] bg-white bg-opacity-20 " />
                    <div className="w-[160px] h-[160px] rounded-[50%] absolute -right-[35px] -bottom-[35px] bg-white bg-opacity-40 " />

                    <div className="px-9 py-5 flex flex-col gap-6 z-20">
                    <p className="text-white font-normal text-[16px]">{`${user!.firstName}'s Wallet`}</p>
                    <CountingText className='text-white font-bold text-[32px]' text={user!.walletBalance} showDecimal={true} />
                    <div className="flex gap-3">
                        <div className="w-fit flex justify-center items-center gap-2 cursor-pointer px-3 py-1 text-white bg-white bg-opacity-20 rounded-[25px]">
                            <Image src={'/icons/wallet/referral-code.svg'} width={20} height={20} alt="referral-code" />
                            <p>{user.referralCode}</p>
                        </div>

                        <div onClick={()=> setBonusModal(true)} className="w-fit flex justify-center items-center gap-2 cursor-pointer px-3 py-1 text-white bg-white bg-opacity-20 rounded-[25px]">
                            <Coin color='#fff' className="w-[20px] h-[20px] text-white" />
                            <p>Send Bonus</p>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Wallet Incomes */}
                <div className="rounded-2xl shadow-lg bg-white px-5 p-5 h-fit min-h-[500px]">
                    <h1 className="text-[22px] text-[#0c1927] font-bold py-2">
                    Wallet Incomes
                    </h1>
                    {
                    walletHistory.filter(target => target.walletType === "Income").length === 0 && <LoadingLayout className='w-full h-fit flex-1 shadow-none' lottie={moneyBagAnim} label="No Wallet Incomes" />
                    }

                    {walletHistory.filter(target => target.walletType === "Income").map((income, index, list)=>{
                    return <WalletTransactionItem onClick={()=> setModal({
                        title: income.content,
                        question:<span>ID: <span className="font-bold">{income._id}</span><br/><br/>Status: <span className={`font-bold ${income.status.toLowerCase() == 'completed'? 'text-themeColor': 'text-red-500'}`}>{income.status}</span><br/><br/>Time: <span className="font-bold">{formatDate(income.createdTime ?? income.date, true)}</span><br/><br/>Amount: <span className={`font-bold ${income.walletType.toLowerCase() == 'income'? 'text-themeColor': 'text-red-500'}`}>{formatCurrency(income.amount)}</span></span>,
                        onOk:()=>setModal(undefined),
                        onCancel:()=> setModal(undefined),
                        okText:'Seen',
                        cancelText:'Close'
                    })} key={income._id} transaction={income} style={{borderBottomWidth:index === list.length-1? 0:1}} />;
                    })}

                </div>

            </div>
        <div className="flex flex-col gap-5 flex-1">
                    {/* Referrals */}
                    <div className="rounded-2xl shadow-lg relative bg-white px-5 pb-5 h-[500px] overflow-y-scroll custom-scrollbar">
                    <h1 className="text-[22px] w-full sticky top-0 z-10 bg-white text-[#0c1927] font-bold pt-5 pb-2">
                        {user!.firstName.trim()}{"'s"} Referrals 
                    </h1>
                    {
                        referrals.length === 0 && <LoadingLayout className='w-full h-[400px] shadow-none' lottie={transactionsAnim} label="No Referrals Yet" />
                    }

                    {referrals.map((referral, index, list)=>{
                        return <Link key={referral._id} href={Routes.dashboard.users.path + "/" + referral._id}><ReferralItemLayout referral={referral}  style={{borderBottomWidth:index === list.length-1? 0:1}} /></Link>;
                    })}

                    </div>

                    {/* Wallet Withdrawals */}
                    <div className="rounded-3xl shadow-sm bg-white px-5 p-5 h-fit min-h-[500px]">
                    <h1 className="text-[22px] text-[#0c1927] font-bold py-2">
                        Withdrawals
                    </h1>
                    {
                        walletHistory.filter(target => target.walletType !== "Income").length === 0 && <LoadingLayout className='w-full h-[420px] shadow-none' lottie={transactionsAnim} label="No Withdrawals" />
                    }

                    {walletHistory.filter(target => target.walletType !== "Income").map((income, index, list)=>{
                        return <WalletTransactionItem onClick={()=>setModal({
                        title: income.content,
                        question:<span>ID: <span className="font-bold">{income._id}</span><br/><br/>Status: <span className={`font-bold ${income.status.toLowerCase() == 'completed'? 'text-themeColor': 'text-red-500'}`}>{income.status}</span><br/><br/>Time: <span className="font-bold">{formatDate(income.createdTime ?? income.date, true)}</span><br/><br/>Amount: <span className={`font-bold ${income.walletType.toLowerCase() == 'income'? 'text-themeColor': 'text-red-500'}`}>{formatCurrency(income.amount)}</span></span>,
                        onOk:()=>setModal(undefined),
                        onCancel:()=> setModal(undefined),
                        okText:'Seen',
                        cancelText:'Close'
                        })} key={income._id} transaction={income} style={{borderBottomWidth:index === list.length-1? 0:1}} />;
                    })}

                    </div>
                </div>
        </div>
    )

    const kycDetails = ()=>(
        <div className="flex flex-col items-center">
            {user!.kycDocuments ?
              <>
                {user!.kycDocuments?.photo &&
                  <div className="rounded-3xl bg-white p-8 w-full my-4 flex flex-col gap-3 justify-center">
                    <h1 className="text-[22px] font-semibold mb-5">KYC Tier 1 {`(Formal Photo)`}</h1>
                    <Image priority={true} src={`${user!.kycDocuments.photo}`} alt="kyc docs" height={200} width={500} className="self-center mb-3" />


                    <div className="flex flex-col gap-4">
                      <Button onClick={()=>approveKycDocs.mutate()} title={user!.kycTier >=1? "Approved...": "Approve"} loading={approveKycDocs.isPending && user!.kycTier<1} disabled={user!.kycTier>=1} />
                    
                      {user!.kyccurrentTier === 1 && <Button onClick={()=>disapproveKycDocs.mutate()} title={"Reject"} negative={true} disabled={user!.kycTier === user!.kyccurrentTier} loading={disapproveKycDocs.isPending && user!.kyccurrentTier==1} />}

                      {user!.kycTier === 1 && <Button onClick={()=>revertKycDocs.mutate()} title={"Revert"} negative={true} loading={revertKycDocs.isPending && user!.kycTier==1} />}
                    </div>

                  
                  </div>}
                {user!.kycDocuments?.driverLicense &&
                  <div className="rounded-3xl bg-white p-8 w-full my-4 flex flex-col gap-3 justify-center">
                    <h1 className="text-[22px] font-semibold mb-5">KYC Tier 2 {`(Identity Document)`}</h1>
                    <Image priority={true} src={`${user!.kycDocuments?.driverLicense}`} alt="kyc docs" height={400} width={500} className="self-center mb-3 " />
                    
                    <div className="flex flex-col gap-4">
                      <Button onClick={()=>approveKycDocs.mutate()} title={user!.kycTier >=2? "Approved...": "Approve"} loading={approveKycDocs.isPending && user!.kycTier<2} disabled={user!.kycTier>=2} />
                    
                      {user!.kyccurrentTier === 2 && <Button onClick={()=>disapproveKycDocs.mutate()} title={"Reject"} negative={true} disabled={user!.kycTier === user!.kyccurrentTier} loading={disapproveKycDocs.isPending && user!.kyccurrentTier==2} />}

                      {user!.kycTier === 2 && <Button onClick={()=>revertKycDocs.mutate()} title={"Revert"} negative={true} loading={revertKycDocs.isPending && user!.kycTier==2} />}
                    </div>
                  </div>}
                {user!.kycDocuments?.ninDocument &&
                  <div className="rounded-3xl bg-white p-8 w-full my-4 flex flex-col gap-3 justify-center">
                    <h1 className="text-[22px] font-semibold mb-5">KYC Tier 3 {`(Identity Document)`}</h1>
                    <Image priority={true} src={`${user!.kycDocuments?.ninDocument}`} alt="kyc docs" height={200} width={500} className="self-center mb-3" />
                    <div className="flex flex-col gap-4">
                      <Button onClick={()=>approveKycDocs.mutate()} title={user!.kycTier >=3? "Approved...": "Approve"} loading={approveKycDocs.isPending && user!.kycTier<3} disabled={user!.kycTier>=3} />
                    
                      {user!.kyccurrentTier === 3 && <Button onClick={()=>disapproveKycDocs.mutate()} title={"Reject"} negative={true} disabled={user!.kycTier === user!.kyccurrentTier} loading={disapproveKycDocs.isPending && user!.kyccurrentTier==3} />}

                      {user!.kycTier === 3 && <Button onClick={()=>revertKycDocs.mutate()} title={"Revert"} negative={true} loading={revertKycDocs.isPending && user!.kycTier==3} />}
                    </div>
                  </div>}
              </>
              :
              <h1 className="text-[25px] text-gray-500">
                No KYC details uploaded yet
              </h1>
            }
          </div>
    )
    
  return (
    <div className='h-full overflow-y-scroll custom-scrollbar px-8 pb-2'>
        <div className="mb-8 flex flex-col gap-10">
            {/* View Menu Items. Whether User details tab, wallet tab or Kyc tab */}
            <div className="flex gap-3 w-full justify-center items-center my-4">
                <FilterItem checked={filter === 'User Details'} onClick={()=>navigate("User Details")} label="User Details" />
                <FilterItem checked={filter === 'Wallet'} onClick={()=>navigate("Wallet")} label="Wallet" />
                <FilterItem checked={filter === 'KYC'} onClick={()=>navigate("KYC")} label="Kyc" />

            </div>

            {filter === 'User Details' && userDetails()}

            {filter === 'Wallet' && walletDetails()}

            {filter === 'KYC' && kycDetails()}

            {modal && <PopupModal modal={modal} />}

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded-xl w-[400px]">
                    <h2 className="text-[22px] font-bold mb-4">Confirm {user!.isBlocked ? 'Unblock' : 'Block'} User</h2>
                    <p className="text-[16px] mb-6">Are you sure you want to {user!.isBlocked ? 'unblock' : 'block'} this user?</p>
                    <div className="flex justify-end gap-4">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded-xl"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Cancel
                    </button>

                    <button
                        className={`${user!.isBlocked ? 'bg-themeColor' : 'bg-red-600'} text-white px-4 py-2 rounded-xl`}
                        onClick={handleBlockToggle}
                        disabled={blockUserMutation.isPending}
                    >
                        {blockUserMutation.isPending ? 'Processing...' : 'Confirm'}
                    </button>

                    </div>
                </div>
                </div>
            )}

            {isMessageModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded-lg shadow-lg w-[400px]">
                    <h2 className="text-xl font-bold mb-4">Send Message</h2>
                    <textarea
                    className="w-full p-3 border bg-tertiary rounded-md"
                    rows={4}
                    placeholder="Type your message here..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    />
                    <div className="flex gap-4 mt-8">
                    <button
                        className="bg-tertiary text-black px-4 py-2 rounded-md"
                        onClick={() => setIsMessageModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-themeColor text-white px-4 py-2 rounded-md"
                        onClick={handleSendMessage}
                        disabled={sendMessageMutation.isPending}
                    >
                        {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
                    </button>
                    </div>
                </div>
                </div>
            )}

            {bonusModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded-lg modal-popin relative shadow-lg w-[400px]">
                    <div onClick={()=> setBonusModal(false)} className='rounded-[50%] z-[51] absolute -right-3.5 -top-3.5 cursor-pointer text-[12px] p-3 flex items-center justify-center text-white' style={{backgroundColor:Colors.themeColor}}>
                        <Add color='#fff' className='rotate-45' />
                    </div>
                    <h2 className="text-xl font-bold mb-4">Send Bonus</h2>
                    <select name=""
                        value={type}
                        className="w-full px-4 py-3 border bg-tertiary outline-none border-none rounded-[15px] mb-4"
                        onChange={
                            e=>{
                                setType(e.target.value as 'refund' | 'bonus')
                            }
                        }
                >
                        <option value="bonus">Bonus</option>
                        <option value="refund">Refund</option>
                    </select>
                    <textarea
                    className="w-full px-4 py-3 border bg-tertiary outline-none border-none rounded-[15px] mb-4"
                    rows={2}
                    placeholder="Reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    />
                    <input
                    className="w-full px-4 py-3 border bg-tertiary outline-none border-none rounded-[15px] mb-4"
                    placeholder="Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number.parseFloat(e.target.value))}
                    />

                    <div className="flex gap-4 mt-8 justify-end">
                    <button
                        className="bg-tertiary text-black px-4 py-2 rounded-md"
                        onClick={() => setIsMessageModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-themeColor text-white px-4 py-2 rounded-md"
                        onClick={()=>sendBonusMutation.mutate()}
                        disabled={sendBonusMutation.isPending}
                    >
                        {sendBonusMutation.isPending ? <FaSpinner className="animate-spin" />: "Send"}
                    </button>
                    </div>
                </div>
            </div>
            )}

        </div>
    </div>
  )
}
