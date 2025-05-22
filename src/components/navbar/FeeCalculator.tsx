'use client'
import React, { ReactNode, useState } from 'react'
import { FaX } from 'react-icons/fa6'
import { Colors } from '@/utils/Colors'
import { IoBackspace } from 'react-icons/io5'
import { MdClear } from 'react-icons/md'
import Button from '@/components/Button'
import { formatCurrency } from '@/utils/Format'
import { TransactionType } from '@/utils/interfaces/transaction'
import { useMutation } from '@tanstack/react-query'
import EscrowCharge from '@/utils/interfaces/escrow-charge'
import { getEscrowChargeOrThrow } from '@/services/rest-api/transaction-api'

interface props{
    onCancel:()=> void,
}


export default function FeeCalculator({onCancel}:props) {
    const [fee, setFee] = useState("0")
    const [escrowCharges, setEscrowCharges] = useState<EscrowCharge[] | null>(null);
    const [filter, setFilter] = useState<TransactionType>(TransactionType.Product);

    // useEffect(()=>{
    //     console.log(fee);
    // }, [fee])

    const escrowFeeMutation = useMutation({
        mutationFn: ()=> getEscrowChargeOrThrow(),
        onSuccess({data}) {
            const charges = data.data;
            setEscrowCharges(charges);
            const percentage = (charges.find((charge)=> charge.category === filter.toLowerCase())?.percentage ?? 20)/100;
            let parsed = Number.parseFloat(fee);
            console.log(formatCurrency(parsed * percentage))
            parsed += (parsed * percentage)
            console.log(formatCurrency(parsed))
            setFee((parsed).toFixed(2))

        },
        onError(){
            if(escrowCharges === null){
                setFee((Number.parseFloat(fee) * 0.2).toFixed(2))
                return;
            }

            const percentage = (escrowCharges.find((charge)=> charge.category === filter.toLowerCase())?.percentage ?? 20)/100;
            let parsed = Number.parseFloat(fee);
            parsed += (parsed * percentage)
            setFee((parsed).toFixed(2))
        }
    })
    

    function Key({children, onClicked}:{children?:ReactNode, onClicked: ()=> void}){

        return <div className='flex justify-center items-center'>
            <div onClick={()=>{
                if(escrowFeeMutation.isSuccess || escrowFeeMutation.isError){
                    escrowFeeMutation.reset();
                    setFee("0");
                }
                onClicked()
            }} className='select-none cursor-pointer text-themeColor rounded-[50%] w-[65px] h-[65px] text-[20px] flex items-center justify-center text-center font-bold bg-themeColor bg-opacity-20'>
            {typeof children === 'string'? <p>{children}</p> : children}
        </div>
        </div>
    }

    function Filter({filterType}:{filterType:TransactionType}){
        return <div onClick={()=>{
            if(escrowFeeMutation.isSuccess || escrowFeeMutation.isError){
                escrowFeeMutation.reset();
                setFee("0");
            }
            setFilter(filterType)
        }} style={{backgroundColor:filterType === filter? Colors.themeColor:"#CFECD0",color:filterType === filter? "white":Colors.themeColor}} className='flex rounded-[25px] cursor-pointer items-center px-4 py-2 justify-center font-semibold text-[10px] transition-colors duration-[2s] ease-in'>
            <p>{filterType}</p>
        </div>
    }

    function enterKey(value:number){
        setFee(Number.parseInt(Number.parseFloat(fee + Number.parseInt(value.toString())).toFixed(0)).toString())
    }

    function calculateFee(){
        if(Number.parseInt(fee) === 0){
            return;
        }

        escrowFeeMutation.mutate();

    }
    function getCalculatedEscrowFee():number{
        const f = (escrowCharges?.find((charge)=> charge.category === filter.toLowerCase())?.percentage ?? 20)/100;
        const x = Number.parseFloat(fee);

        // From my mathematical calculation,
        // (f*y) = x-(x/(1+f))
        // where (f*y) is the calculated escrow charge

        return x-(x/(1+f));
    }

    const parsedFee = Number.parseFloat(fee);
    const feeInteger =Math.trunc(parsedFee);
  return (
    <div onClick={onCancel} className="fixed select-none inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div  onClick={(e)=>{
                e.stopPropagation()
              }} style={{animationDuration: '0.75s'}} className="min-w-[24%] relative bg-white flex flex-col items-center justify-center  modal-animate p-6 rounded-lg">
            <div onClick={onCancel} className='rounded-[50%] z-[51] absolute -right-3.5 -top-3.5 cursor-pointer text-[12px] p-3 flex items-center justify-center text-white' style={{backgroundColor:Colors.themeColor}}>
                <FaX />
            </div>
            <h2 className="text-2xl font-semibold self-start mb-4">Fee Calculator</h2>
            <div className='flex w-full justify-center gap-3 mb-6'>
                <Filter filterType={TransactionType.Product} />
                <Filter filterType={TransactionType.Service} />
                <Filter filterType={TransactionType.Virtual} />

            </div>
            <p className='text-gray-500 self-start text-[14px] text-start mb-4'>{(escrowFeeMutation.isError || escrowFeeMutation.isSuccess)? (escrowCharges? `Escrow Fee is ${formatCurrency(getCalculatedEscrowFee())}`: "No Escrow Charge has been set" ) :"Enter Price:" }</p>
            <p style={{color:Colors.themeColor}} className='pr-2 select-text font-bold mb-4 text-3xl self-end text-end'>{formatCurrency(feeInteger, false)}<span className='text-2xl opacity-65'>{`.${Math.abs(parsedFee-feeInteger).toFixed(2).replaceAll('0.','')}`}</span></p>
            <div className='w-full mb-6 inline-grid grid-cols-3 gap-x-7 gap-y-8'>
                    <Key onClicked={()=>enterKey(1)}>
                    1
                    </Key>
                    <Key onClicked={()=>enterKey(2)}>
                    2
                    </Key>
                    <Key onClicked={()=>enterKey(3)}>
                    3
                    </Key>
                    <Key onClicked={()=>enterKey(4)}>
                    4
                    </Key>
                    <Key onClicked={()=>enterKey(5)}>
                    5
                    </Key>
                    <Key onClicked={()=>enterKey(6)}>
                    6
                    </Key>
                    <Key onClicked={()=>enterKey(7)}>
                    7
                    </Key>
                    <Key onClicked={()=>enterKey(8)}>
                    8
                    </Key>
                    <Key onClicked={()=>enterKey(9)}>
                    9
                    </Key>
                    <Key onClicked={()=>setFee("0")}>
                    <MdClear />
                    </Key>
                    <Key onClicked={()=>enterKey(0)}>
                    0
                    </Key>
                    <Key onClicked={()=>setFee(fee.length >1? fee.substring(0, fee.length-1):"0")}>
                    <IoBackspace />
                    </Key>
                </div>
            <Button title='Calculate' onClick={calculateFee} loading={escrowFeeMutation.isPending} />
        </div>
     </div>
  )
}
