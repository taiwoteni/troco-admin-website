/* eslint-disable @next/next/no-img-element */
'use client';

import { Carousel, CarouselRefType } from '@/components/carousel/Carousel';
import LottieWidget from '@/components/lottie/LottieWidget';
import { useAdmin } from '@/providers/AdminProvider';
import loadingAnim from '../../../../../public/lottie/loading_water.json'
import driverAnim from '../../../../../public/lottie/delivery.json'
import paymentLoadingAnim from '../../../../../public/lottie/payment-loading.json'
import returnAnim from '../../../../../public/lottie/person-delivery.json'
import pendingAnim from '../../../../../public/lottie/pending.json'
import { useTransaction } from '@/providers/TransactionsProvider';
import { initialModal } from '@/utils/interfaces/modal';
import Transaction, { TransactionStatus, TransactionType } from '@/utils/interfaces/transaction';
import { useParams} from 'next/navigation';
import React, { useMemo, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { approveDriverDetails, approveServicePayment, cancelTransaction, completeTransaction as moveToCompleted, rejectServicePayment, revertDriverDetails, revertPayment, revertTransactionStatus, updateTransactionStatus } from '@/services/rest-api/transaction-api';
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import Button from '@/components/Button';
import Image from 'next/image';
import formatDate from '@/utils/DateFormat';
import BankPayment from '@/components/transactions/payments/BankPayment';
import ReturnItemLayout from '@/components/transactions/pricings/ReturnedItemLayout';
import { Colors } from '@/utils/Colors';
import ProductItemLayout from '@/components/transactions/pricings/ProductItemLayout';
import ServiceItemLayout from '@/components/transactions/pricings/ServiceItemLayout';
import { formatCurrency } from '@/utils/Format';
import { getStatusColor } from '@/components/transactions/TransactionItemLayout';



interface CompletedMutation extends Record<string,string>{
  transactionId: string,
  sellerId: string,
  status: string,
  adminId: string,
}

interface DriverMutationTypes extends CompletedMutation{
  transactionId: string,
  sellerId: string,
  status: string,
  adminId: string,
  buyerId: string
};


export default function TransactionsPage() {
    const {id:transactionID} = useParams();
    const {admin:adminOrNull} = useAdmin();
    const {transaction:transactionData, refresh} = useTransaction(transactionID!.toString())
    const admin = useMemo(()=>adminOrNull!, [adminOrNull]);
    const transaction = useMemo(()=>!transactionData? undefined: new Transaction(transactionData), [transactionData]);

    const driverCarouselRef = useRef<CarouselRefType>(null)
    const carouselRef = useRef<CarouselRefType>(null)

    const [modal, setModal] = useState(initialModal)
    const [showModal, setShowModal] = useState(false);

    const approveMutation = useMutation({
      mutationFn: ({ taskId, typeOfTransaction }: {taskId: string, typeOfTransaction: string}) => {
        return approveServicePayment({transactionId: transaction!.id, taskId, transactionType:typeOfTransaction, adminId: admin._id},true)
      },
      onSuccess: async() => {
        toast.success("Payment approved!")
        setShowModal(false);

        await refresh();
        approveMutation.reset();
      },
      onError: ()=>{
        toast.error("Error approving payment")
      }
    });

    const rejectMutation = useMutation({
      mutationFn: ({ taskId, typeOfTransaction }: {taskId: string, typeOfTransaction: string}) => {
        return rejectServicePayment({transactionId: transaction!.id, taskId, transactionType:typeOfTransaction, adminId: admin._id},true)
      },
      onSuccess: async() => {
        toast.success("Payment rejected!")
        setShowModal(false);

        await refresh();
        rejectMutation.reset();
      },
      onError: ()=>{
        toast.error("Error rejecting payment")
      }
    });

    const revertDriverMutation = useMutation({
        mutationFn: () => revertDriverDetails({sellerId: transaction!.creatorId, transactionId: transaction!.id, buyerId: transaction!.buyerId, adminId: admin._id}, true),
      onSuccess: async() => {
          toast.success("Driver Information Reverted!")
          await refresh();
          revertDriverMutation.reset();
        
        },
      onError:()=>{
          toast.error("Error Reverting Driver");
        }
    });

    const cancelMutation = useMutation({
      mutationFn: ()=>cancelTransaction({transactionId: transaction!.id, adminId: admin._id}, true),
      onSuccess: async() => {
        toast.success("Cancelled Transaction")
        await refresh();
        cancelMutation.reset();
      },
      onError: ()=>{
        toast.error("Error Cancelling Transaction")
      }
    });

    const respondToServicePaymentDetails = async (accept:boolean, pricingId: string)=>{
        setShowModal(false);

        if(accept){
            approveMutation.mutate({
                taskId:pricingId,
                typeOfTransaction: transaction!.transactionType.toLowerCase(),
            })
        }
        else{
            rejectMutation.mutate({
            taskId:transaction!.currentTask.id,
            typeOfTransaction: transaction!.transactionType.toLowerCase(),
            })
        }
    }

    /// This mutation is called when u want to change status to completed
    const mutation = useMutation({
      mutationFn: (payload: CompletedMutation) => moveToCompleted(payload, true),
      onSuccess: async(data) => {
        console.log("Mutation success:", data);
        toast.success("Completed Transaction",{description:"This transaction has been marked as completed"})
        setShowModal(false);
        await refresh();
        mutation.reset();
      },
      onError: (error) => {
        console.error("Mutation error:", error);
        toast.error("Error Completing Transaction")
      }
    });

    /// called when you want to revert transaction status
    const revertTransactionStatusMutation = useMutation(
        {
        mutationFn: () =>revertTransactionStatus({transactionId: transaction!.id, adminId: admin._id}, true),
        onSuccess: async(data) => {
            setShowModal(false); // If you are showing a modal and want to close it on success
            console.log("Transaction reverted successfully:", data);
            await refresh();
            revertTransactionStatusMutation.reset();
        },
        onError: (error) => {
            console.error("Error reverting transaction:", error);
        }
        }
    );

    const revertTransaction = async()=>revertTransactionStatusMutation.mutate();

    /// called when you want to approve/reject payment
    const paymentMutation = useMutation({
      mutationFn: async({accept}:{accept:boolean})=>{
        await updateTransactionStatus({
          transactionId: transaction!.id,
          adminId:admin._id,
          buyerId:transaction!.buyerId,
          status: accept? 'accept': 'declined'
        });
      },
      onSuccess:(async(result, {accept})=>{
        console.log("Payment Mutation success:", result);
        toast.success(`Successfuly ${accept? 'accepted':'declined'} payment`)
        setShowModal(false);
        await refresh();
        paymentMutation.reset();
      }),
      onError:((error, {accept})=>{
        const rejecting = !accept
        console.error("Payment Mutation error:", error);
        toast.error(`Error ${rejecting? 'rejecting':'approving'} payment`)
      }),
    });

    const revertPaymentMutation = useMutation({
        mutationFn: ()=>revertPayment({transactionId: transaction!.id}),
      onSuccess:(async()=>{
        toast.success(`Successfuly reverted payment`)
        setShowModal(false);
        await refresh();
        revertPaymentMutation.reset();
      }),
      onError:((error)=>{
        console.error("Revert Payment Mutation error:", error);
        toast.error(`Error reverting payment`)
      }),
    }
  )

    const revertServicePaymentMutation = useMutation({
      mutationFn: ({taskId}:{taskId: string})=>{
        return rejectServicePayment({transactionId: transaction!.id, taskId, adminId: admin._id, transactionType:transaction!.transactionType.toLowerCase()}, true);
      },
      onSuccess:(async()=>{
        toast.success("Reverted Payment successfuly")
        setShowModal(false);
        await refresh();
        revertServicePaymentMutation.reset();
      }),
      onError:(()=>{
        toast.error("Error Reverting Payment")
      }),
    }
    );

    const respondToPaymentDetails = async(accept:boolean)=>paymentMutation.mutate({accept})

     /// called when you want to approve/reject driver
    const driverMutation = useMutation(
        {
        mutationFn: async (data: DriverMutationTypes)=> approveDriverDetails(data, true),
        onSuccess:(async(result)=>{
            console.log("Driver Mutation success:", result);
            toast.success("Approved Driver's Details")
            setShowModal(false);
            await refresh();
            driverMutation.reset();
        }),
        onError:((error)=>{
            toast.error("Error disapproving driver details")
            console.error("Driver Mutation error:", error);
        }),
        }
    );

    const respondToDriverDetails = async(accept: boolean)=>driverMutation.mutate({
        transactionId:transaction!.id,
        adminId: admin!._id,
        sellerId: transaction!.creatorId,
        buyerId:transaction!.buyerId,
        status: accept?'accept':'declined',
    })

    const completeTransaction = async () => mutation.mutate({
        transactionId: transaction!.id,
        sellerId: transaction!.creatorId,
        adminId: admin._id,
        status: 'completed'
    })

    const Modal = () => (
        <div className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-5 rounded-lg shadow-md w-[300px]">
            <h2 className="text-xl font-bold mb-4">{modal.title}</h2>
            <p>{modal.question}</p>
            <div className="flex justify-end mt-4">
            <button onClick={modal.onCancel} className="bg-gray-300 text-black px-4 py-2 rounded mr-2">Cancel</button>
            <button onClick={modal.onOk} className=" text-white px-4 py-2 rounded" style={{backgroundColor:modal.negative?'red':Colors.themeColor}}>Confirm</button>
            </div>
        </div>
        </div>
    );

    if(!transaction){
        return <div className='w-full h-full flex flex-col gap-2 flex-center'>
            <LottieWidget lottieAnimation={loadingAnim} className='w-[200px] h-[200px] aspect-square object-cover' />
            <h2 className='text-[25px] font-bold font-lato'>{"Loading this transaction's data"}</h2>
            <p className='text-secondary font-quicksand -mt-1 text-sm'>Give us <b>a</b> minute.</p>
        </div>
    }

    const actionButton = ()=>{
    if(transaction.transactionStatus === TransactionStatus.Pending){
      return <Button title='Nothing to do yet..' disabled={true} />
    }

    if(transaction.transactionStatus === TransactionStatus.Finalizing){
      if(transaction.transactionType === TransactionType.Product){
        if(transaction.buyerSatisfied){
          return <Button title="Complete Transaction" loading={mutation.isPending} onClick={()=>{
            setShowModal(true)
            setModal({
              title:'Complete Transaction',
              question:'You are about to mark this transaction as completed.',
              onCancel:(()=>setShowModal(false)),
              onOk:(()=>completeTransaction())
            })
          }} />
        }
        return <Button title="Waiting For Buyer's Satisfaction" disabled={true} />
      }
      return <Button title="Complete Transaction" loading={mutation.isPending} onClick={()=>{
        setShowModal(true)
        setModal({
          title:'Complete Transaction',
          question:'You are about to mark this transaction as completed.',
          onCancel:(()=>setShowModal(false)),
          onOk:(()=>completeTransaction())
        })
      }} />
    }
    if(transaction.transactionStatus === TransactionStatus.Completed){
      return <Button title="Completed Transaction..." disabled={true} />
    }
    if(transaction.transactionStatus === TransactionStatus.Cancelled){
      return <Button title="Cancelled Transaction..." disabled={true} />
    }

    if(transaction.transactionType !== TransactionType.Product && transaction.completedTasks){
      return <Button title="Complete Transaction" loading={mutation.isPending || mutation.isSuccess} onClick={()=>{
        setShowModal(true)
        setModal({
          title:'Complete Transaction',
          question:'You are about to mark this transaction as completed.',
          onCancel:(()=>setShowModal(false)),
          onOk:(()=>completeTransaction())
        })
      }} />
    }

    if(transaction.transactionStatus === TransactionStatus.InProgress){
      if(transaction.transactionType === TransactionType.Product){
        if(transaction.paymentMade){
          return <Button title="Head to Payment Section" disabled={true} />
        }
        return <Button title="Waiting for Buyer to make payment" disabled={true} />
      }

      const currentTask = transaction.currentTask;

      if(!currentTask.paymentApproved){
        return <Button title="Head Over to payment section..." disabled={true} /> 

      }

      return <Button title="Transaction taking place..." disabled={true} /> 
    }

    if(transaction.transactionStatus === TransactionStatus.Processing){
      if(transaction.hasDriver){
        return <Button title="Head to Driver Section..." disabled={true} /> 
      }
      return <Button title="Waiting for Driver Details..." disabled={true} />
    }

    if(transaction.transactionStatus === TransactionStatus.Ongoing){
      return <Button title={transaction.transactionType === TransactionType.Product?"Delivery Ongoing...":'Transaction taking place..'} disabled={true} />
    }

   
    return <Button title="Cancelled Transaction..." disabled={true} />
  }

  const paymentSection = ()=>{

    if(transaction.transactionType === TransactionType.Product){
      return (<div className={`h-[500px] flex flex-1 bg-white rounded-lg shadow-md text-[16px] ${transaction.paymentMade? 'px-5 py-2.5 overflow-y-scroll custom-scrollbar':''}`}>
        {!transaction.paymentMade && <div className='flex w-full h-full text-center text-[18px] flex-col justify-center items-center gap-1'>
          <LottieWidget lottieAnimation={paymentLoadingAnim} width={200} height={200} />
          <p>Waiting for buyer make payment</p>
        </div>}

        
        {transaction.paymentMade && <div>
      <h1 className='text-[25px] text-[#495065] font-bold mb-4'>{transaction!.transactionType !== TransactionType.Product? `Payment Details for Task ${transaction!.pricings.map((e)=> e.id).indexOf(transaction!.currentTask.id)+1}`:'Payment Details'}</h1>
      <BankPayment style={{marginBottom:'15px'}} accountDetails={transaction!.buyerAccountDetails} />

      <img className='object-cover rounded-[25px] h-[auto] w-full max-h-[600px]' alt='payment receipt' src={transaction!.paymentReceipt} width={100} height={100} />
      
      {/* Buttons To Show if payment has been approved */}
      {transaction!.paymentApproved && <div className='mt-4 flex flex-col gap-4'>
        <Button title={'Approved..'} disabled={true} />
        {transaction!.transactionStatus !== TransactionStatus.Completed && <p className='text-center font-bold'>OR</p>}
        {transaction!.transactionStatus !== TransactionStatus.Completed && <Button onClick={()=>{
          setShowModal(true)
          setModal({
            title:'Revert Payment',
            negative:true,
            question:`Are you sure you want to revert this payment receipt?`,
            onOk:(()=>{
              setShowModal(false);
              revertPaymentMutation.mutate();
            }),
            onCancel:(()=> setShowModal(false))
          },)
        }} title={'Revert?'} negative={true} loading={revertPaymentMutation.isPending || revertPaymentMutation.isSuccess} />}
        </div>}

      {/* buttons To Show if payment has not been responded to */}
      {!transaction!.paymentApproved && <div className='mt-4 flex flex-col gap-4'>
        <Button title={'Approve'} 
        loading={paymentMutation.isPending || paymentMutation.isSuccess} onClick={()=>{
          setShowModal(true)
          setModal({
            title:'Approve Payment',
            question:`Are the payment details matching with the receipt?`,
            onOk:(()=>{
              setShowModal(false)
              respondToPaymentDetails(true)
            }),
            onCancel:(()=> setShowModal(false))
          },)
        }} />
        <Button onClick={()=>{
          setShowModal(true)
          setModal({
            title:'Reject Payment',
            negative:true,
            question:`Are you sure you want to reject this payment receipt?`,
            onOk:(()=>{
              respondToPaymentDetails(false)
            }),
            onCancel:(()=> setShowModal(false))
          },)
        }} title={'Reject'} negative={true} loading={paymentMutation.isPending || paymentMutation.isSuccess} />

      </div>
        }
          </div>}
      </div>);
    }

    const isService = transaction!.transactionType === TransactionType.Service;

    return <div className={`h-[500px] flex relative flex-1 overflow-hidden items-center justify-center bg-white rounded-lg shadow-md text-[16px]`}>
      <Carousel initialIndex={transaction!.currentTaskPosition} ref={carouselRef}>
        {transaction!.pricings.map((pricing, index) => (
          <>
          {!pricing.paymentMade && <div className='flex w-full h-full text-center text-[18px] flex-col justify-center items-center gap-1'>
            <LottieWidget lottieAnimation={paymentLoadingAnim} width={200} height={200} />
            <p>Waiting for {isService? "client": "buyer"} make payment</p>
          </div>}

          {pricing.paymentMade && <div className='px-5 py-2.5 w-full h-fit overflow-y-scroll custom-scrollbar'>
            <h1 className='text-[25px] text-[#495065] font-bold mb-4'>{`Payment Details for ${isService? "task" : "product"} ${index+1}`}</h1>
            <BankPayment style={{marginBottom:'15px'}} accountDetails={transaction!.buyerAccountDetails} />

            <img className='object-cover rounded-[25px] h-[auto] w-full max-h-[600px]' alt='payment receipt' src={pricing.buyerPaidProof} width={100} height={100} />
          
            {/* Buttons To Show if payment has been approved */}
            {pricing.paymentApproved && <div className='mt-4 flex flex-col gap-4'>
              <Button title={'Approved..'} disabled={true} />
              {transaction!.transactionStatus !== TransactionStatus.Completed && <p className='text-center font-bold'>OR</p>}
              {transaction!.transactionStatus !== TransactionStatus.Completed && <Button onClick={()=>{
                setShowModal(true)
                setModal({
                  title:'Revert Payment',
                  negative:true,
                  question:`Are you sure you want to revert this payment receipt?`,
                  onOk:(()=>{
                    setShowModal(false);
                    revertServicePaymentMutation.mutate({taskId: pricing.id});
                  }),
                  onCancel:(()=> setShowModal(false))
                },)
              }} title={'Revert?'} negative={true} loading={revertServicePaymentMutation.isPending || revertServicePaymentMutation.isSuccess} />}
              </div>}

            {/* buttons To Show if payment has not been responded to */}
            {!pricing.paymentApproved && <div className='mt-4 flex flex-col gap-4'>
              <Button title={'Approve'} 
                loading={approveMutation.isPending || approveMutation.isSuccess} onClick={()=>{
                setShowModal(true)
                setModal({
                  title:'Approve Payment',
                  question:`Are the payment details matching with the receipt?`,
                  onOk:(()=>{
                    setShowModal(false)
                    respondToServicePaymentDetails(true, pricing.id);
                  }),
                  onCancel:(()=> setShowModal(false))
                },)
              }} />
              <Button onClick={()=>{
                setShowModal(true)
                setModal({
                  title:'Reject Payment',
                  negative:true,
                  question:`Are you sure you want to reject this payment receipt?`,
                  onOk:(()=>{
                    respondToServicePaymentDetails(false, pricing.id);
                    return;
                  }),
                  onCancel:(()=> setShowModal(false))
                },)
              }} title={'Reject'} negative={true} loading={rejectMutation.isPending|| rejectMutation.isSuccess} />

            </div>
              }
              </div>}


          </>
        ))}
      </Carousel>

      {transaction!.pricings.length > 1 && <><div onClick={()=>{
        if(carouselRef.current){
          carouselRef.current.back();
        }
      }} className='w-[50px] h-[50px] z-10 select-none absolute left-3 rounded-[50%] cursor-pointer bg-opacity-20 bg-black flex items-center justify-center'>
        <ArrowLeft2 color='#fff' variant='Bold' />
      </div>
      
      <div onClick={()=>{
        if(carouselRef.current){
          carouselRef.current.next();
        }
      }} className='w-[50px] h-[50px] absolute right-3 rounded-[50%] cursor-pointer z-10 bg-opacity-20 bg-black flex items-center justify-center'>
        <ArrowRight2 color='#fff' variant='Bold' />
      </div></>}

    </div>
  }
  
  const driverSection = ()=>{
    if(transaction!.transactionType !== TransactionType.Product){
      return <div className='h-[500px] flex-1 bg-white rounded-lg shadow-md text-[18px] gap-1 text-center items-center justify-center flex-col flex'>
        <LottieWidget lottieAnimation={driverAnim} width={200} height={200} />
        <p>Drivers are not needed for this type of transaction</p>
      </div>
    }

    if(!transaction!.hasDriver){
      return <div className='h-[500px] flex-1 bg-white rounded-lg shadow-md text-[18px] text-center gap-1 items-center justify-center flex-col flex'>
        <LottieWidget lottieAnimation={driverAnim} width={200} height={200} />
        <p>No Driver yet</p>
      </div>
    }

    return <div className={`h-[500px] flex relative flex-1 items-center justify-center bg-white rounded-lg shadow-md text-[16px]`}>
      <Carousel ref={driverCarouselRef}>
        {transaction!.rawData.driverInformation.map((driver, index) =>{
          const isReturnDriver =  transaction!.hasReturnDriver && index > 0;

          const thisDriverApproved = transaction!.driverApproved || (!isReturnDriver && index > 0)

          return <div key={index} className='px-5 py-2.5 w-full h-fit overflow-y-scroll custom-scrollbar'>
            <h1 className='text-[25px] text-[#495065] font-bold mb-4'>{index>0? "Return Driver Details": "Driver Details"}</h1>
            <div className='gap-3 flex flex-col'>
              <p><span className='font-bold text-[17px]'>Driver Name:</span>  {driver.name}</p>
              <p><span className='font-bold text-[17px]'>Phone Number:</span>  {driver.phoneNumber}</p>
              <p><span className='font-bold text-[17px]'>Company Name:</span>  {driver.CompanyName}</p>
              <p><span className='font-bold text-[17px]'>Destination:</span>  {driver.theDelivery}</p>
              <p><span className='font-bold text-[17px]'>Estimated Arrival:</span>  {formatDate(driver.EstimatedDeliveryTime)}</p>
              <p><span className='font-bold text-[17px]'>Front Plate Number:</span></p>
              <Image className='w-full rounded-[25px] height-auto max-h-[200px] obect-cover' src={driver.FrontPlateNumber} priority={true} alt='front plate number' width={100} height={100} />
              <p><span className='font-bold text-[17px]'>Black Plate Number:</span></p>
              <Image className='w-full mb-4 rounded-[25px] height-auto max-h-[200px] obect-cover' src={driver.BackPlateNumber} priority={true} alt='back plate number' width={100} height={100} />

              {thisDriverApproved && <div className='flex flex-col gap-4'>
                <Button title={'Approved..'} disabled={true} />
                {transaction!.transactionStatus !== TransactionStatus.Completed && <p className='text-center font-bold'>OR</p>}
                {transaction!.transactionStatus !== TransactionStatus.Completed && 
                <Button onClick={()=>{
                  setShowModal(true)
                  setModal({
                    title:'Revert Driver',
                    negative:true,
                    question:`Are you sure you want to revert this driver's details?`,
                    onOk:(()=>{
                      setShowModal(false);
                      revertDriverMutation.mutate();
                    }),
                    onCancel:(()=> setShowModal(false))
                  },)
                }} title={'Revert?'} negative={true} loading={revertDriverMutation.isPending || revertDriverMutation.isSuccess} />}
              </div> }

              {!thisDriverApproved && <div className='flex flex-col gap-4'>
                <Button title={'Approve'} disabled={transaction!.returnedItems.length >0 && !transaction!.hasReturnDriver} loading={driverMutation.isPending || driverMutation.isSuccess} onClick={()=>{
                  setShowModal(true)
                  setModal({
                    title:'Approve Driver',
                    question:`Are you okay the Driver's details?`,
                    onOk:(()=>{
                      respondToDriverDetails(true)
                    }),
                    onCancel:(()=> setShowModal(false))
                  },)
                }} />
                <Button onClick={()=>{
                  setShowModal(true)
                  setModal({
                    title:'Reject Driver',
                    negative:true,
                    question:`Are you sure you want to reject this driver's details?`,
                    onOk:(()=>{
                      respondToDriverDetails(false)
                    }),
                    onCancel:(()=> setShowModal(false))
                  },)
                }} title={'Reject'} negative={true} disabled={transaction!.returnedItems.length >0 && !transaction!.hasReturnDriver} loading={driverMutation!.isPending || driverMutation.isSuccess} />

              </div>
                }
              
            </div>
          </div>
        })}

      </Carousel>

      {transaction!.hasReturnDriver && <><div onClick={()=>{
        if(driverCarouselRef.current){
          driverCarouselRef.current.back();
        }
      }} className='w-[50px] h-[50px] absolute left-3 rounded-[50%] cursor-pointer bg-opacity-20 bg-black flex items-center justify-center'>
        <ArrowLeft2 color='#fff' variant='Bold' />
      </div>
      
      <div onClick={()=>{
        if(driverCarouselRef.current){
          driverCarouselRef.current.next();
        }
      }} className='w-[50px] h-[50px] absolute right-3 rounded-[50%] cursor-pointer bg-opacity-20 bg-black flex items-center justify-center'>
        <ArrowRight2 color='#fff' variant='Bold' />
      </div></>}
    </div>

    




  }

    


    

  return (
    <div className='flex flex-col w-full px-7 py-2 gap-7 h-full overflow-y-scroll custom-scrollbar'>

      {/* Transaction Details & Payment Details & Driver Details */}
      <div className='flex w-full gap-5'>
        <div className='h-[500px] flex flex-col flex-1 bg-white rounded-lg px-5 py-2.5 shadow-md text-[16px] overflow-y-scroll custom-scrollbar'>
          <h1 className='text-[25px] text-[#495065] font-bold mb-4'>Transaction Details</h1>
          <div className='gap-3 flex flex-col'>
            <p><span className='font-bold text-[17px]'>Transaction ID:</span>  {transaction.id}</p>
            <p><span className='font-bold text-[17px]'>Transaction Name:</span>  {transaction.transactionName}</p>
            <p><span className='font-bold text-[17px]'>Description:</span>  {transaction.transactionDescription}</p>
            <p><span className='font-bold text-[17px]'>Transaction Type:</span>  {transaction.transactionType}</p>
            <div className='flex items-center justify-start'><p className='font-bold text-[17px] mr-3.5'>Transaction Status:</p>  <div className='rounded-3xl inline-flex text-[14px] font-semibold text-white px-[14px] py-[7px]' style={{backgroundColor:getStatusColor(transaction.transactionStatus)}}>{transaction.transactionStatus}</div></div>
            <p><span className='font-bold text-[17px]'>{`No of ${transaction.pricingsName}:`}</span>  {transaction.pricings.length}</p>
            <p className='font-semibold' style={{color:Colors.themeColor}}><span className='font-bold text-[17px] text-black'>Transaction Amount:</span>  {formatCurrency(transaction.totalAmount)}</p>
            <p><span className='font-bold text-[17px]'>Estimated End:</span>  {formatDate(transaction.estimatedEnd)}</p>
            <p><span className='font-bold text-[17px]'>{transaction.transactionType === TransactionType.Service?'Transaction Duration:' : 'Inspection Period:'}</span>  {transaction.inspectionPeriod}</p>
            <p><span className='font-bold text-[17px]'>Transaction Location:</span>  {transaction.fullAddress}</p>
            <p><span className='font-bold text-[17px]'>Creator:</span>  {transaction.creatorName}</p>
          </div>          
        </div>
        
        {paymentSection()}

        {driverSection()}
      </div>

      {/* Pricing Items & Returned Items */}
      <div className='grid grid-cols-3 w-full gap-7'>
        <div className='h-fit col-span-2 bg-white rounded-lg px-8 py-2 shadow-md'>
          {transaction.pricings.length !==0 && 
            <div className='w-full'>
              <h1 className='text-[25px] text-[#495065] font-bold mb-4'>{`${transaction.pricingsName}(s)`}</h1>
              <div className='w-full mb-16'>
              {transaction.pricings.map((item, index, list)=>{
                const reverse = (index%2) === 1;

                if(transaction.transactionType === TransactionType.Product){
                  return <ProductItemLayout item={item} inverse={reverse} key={item.id} style={{marginBottom: list.length-1 === index? '0':'65px'}}><Button disabled={true} title={'Nothing to do'} /></ProductItemLayout>
                }

                return <ServiceItemLayout style={{marginBottom: list.length-1 === index? '0':'65px'}} key={item.id} item={item} type={transaction.transactionType} inverse={reverse}/>
              })}
              </div>
              <div className='mb-4 w-full flex flex-col gap-4'>
                {actionButton()}
                {admin.role?.toLowerCase() === 'super admin' && <p className='text-center font-bold'>OR</p>}
                {admin.role?.toLowerCase() === 'super admin' && <Button title={'Cancel Transaction'} disabled={[TransactionStatus.Completed, TransactionStatus.Cancelled].includes(transaction.transactionStatus)} negative={true} loading={cancelMutation.isPending || cancelMutation.isSuccess} onClick={()=>{
                  setShowModal(true)
                  setModal({
                    title:'Cancel Transaction',
                    negative:true,
                    question:`Are you sure you want to cancel this transaction?`,
                    onOk:(()=>{
                      setShowModal(false);
                     cancelMutation.mutate();
                    }),
                    onCancel:(()=> setShowModal(false))
                  },)
                }} />}
              </div>
              <p className='mb-4 text-center font-bold'>OR</p>
              <Button negative={true} loading={revertTransactionStatusMutation.isPending || revertTransactionStatusMutation.isSuccess} className='mb-4' title={'Revert Status'} onClick={()=>{
                setShowModal(true)
                setModal({
                  negative:true,
                  title:'Revert Status',
                  question:'Are you sure you want to revert the transaction status? This process is irreversible.',
                  onCancel:(()=>setShowModal(false)),
                  onOk:(()=>revertTransaction())
                })
              }} />
            </div>
          }
          {transaction.pricings.length === 0 && <div className='flex w-full h-[500px] text-center text-[18px] flex-col justify-center items-center gap-1'>
              <LottieWidget lottieAnimation={pendingAnim} width={200} height={200} />
              <p>{`Waiting for seller to upload ${transaction.pricingsName}s`}</p> 
          </div>}
        </div>
        <div className={`h-[500px] flex-1 bg-white rounded-lg shadow-md text-[16px] ${transaction.returnedItems.length !== 0? 'px-5 py-2.5 overflow-y-scroll custom-scrollbar':''}`}>
          {transaction.transactionType !== TransactionType.Product && <div className='flex w-full h-[500px] text-center text-[18px] flex-col justify-center items-center'>
              <LottieWidget lottieAnimation={returnAnim} width={250} height={250} />
              <p>No Return Items for this type of transaction</p> 
          </div>}

          {transaction.transactionType === TransactionType.Product && transaction.returnedItems.length ===0 && <div className='flex w-full h-[500px] text-center text-[18px] flex-col justify-center items-center'>
              <LottieWidget lottieAnimation={returnAnim} width={250} height={250} />
              <p>No Returned Items </p> 
          </div>}

          {transaction.transactionType === TransactionType.Product && transaction.returnedItems.length !==0 && <div>
              <h1 className='text-[25px] text-[#495065] font-bold mb-4'>Return Transaction</h1>
              <div className='gap-3 flex flex-col'>
                <p><span className='font-bold text-[17px]'>Reason:</span>  {transaction.returnedReason}</p>
                <p><span className='font-bold text-[17px]'>Products:</span></p>
                {transaction.returnedItems.map((item)=> <ReturnItemLayout key={item.id} item={item}/>)}
                <p className='font-bold' style={{color:Colors.themeColor}}><span className='text-black text-[17px]'>Total Amount:</span> {formatCurrency(transaction.totalPriceReturned)}</p>
              </div>
            </div>}
        </div>
      </div>
      {showModal && <Modal />}
    </div>
  )
}
