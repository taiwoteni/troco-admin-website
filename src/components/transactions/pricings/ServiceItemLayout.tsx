'use client';

/* eslint-disable @next/next/no-img-element */
import React, { CSSProperties, ReactNode, useRef } from 'react'
import { SalesItem } from '../../../utils/interfaces/sales-item'
import Image from 'next/image'
import { Colors } from '../../../utils/Colors'
import { formatCurrency } from '../../../utils/Format'
import { TransactionType } from '../../../utils/interfaces/transaction'
import ProofOfWorkItem from './ProofOfWorkItem'
import PaymentReceipt from '../payments/PaymentReceipt'
import { Carousel, CarouselRefType } from '@/components/carousel/Carousel'
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react'

interface props{
  inverse:boolean,
  item:SalesItem,
  type:TransactionType,
  style:CSSProperties,
  children?:ReactNode
}
export default function ServiceItemLayout({inverse, item, style, type, children}:props) {

  const ref = useRef<CarouselRefType>(null);

  return (
    <div className={`w-full flex gap-9 ${inverse? 'flex-row-reverse':'flex-row'}`} style={style}>
      {/* Images div */}
      <div className='w-[45%] relative flex items-center justify-center'>
        {item.hasImages && <Carousel
          ref={ref}
        >
          {
            item.getImages.map((image, index)=> (
              <img key={index} className='w-full h-auto max-h-[350px] self-center object-cover rounded-[25px]' src={image} alt='product image' width={100} height={100} />
            ))
          }
          
        </Carousel>}

       {item.hasImages && item.getImages.length >1 && <>
          <div onClick={ref.current?.back} className='w-[50px] h-[50px] absolute left-3 rounded-[50%] cursor-pointer bg-opacity-20 bg-black flex items-center justify-center'>
            <ArrowLeft2 color='#fff' variant='Bold' />
          </div>

          <div onClick={ref.current?.next} className='w-[50px] h-[50px] absolute right-3 rounded-[50%] cursor-pointer bg-opacity-20 bg-black flex items-center justify-center'>
            <ArrowRight2 color='#fff' variant='Bold' />
          </div>
        </>}

      
        {!item.hasImages && <div className='w-full h-[350px] rounded-[25px] flex items-center justify-center' style={{backgroundColor:Colors.tertiary}}>
            <Image width={40} height={40} alt='broken-image' src='/icons/transaction/broken-link.svg' style={{objectFit:'cover'}} />
          </div>}
      </div>

      {/* Details div */}
      <div className='flex flex-col flex-1'>
        <p className='text-[40px] mb-4 text-cente'>{item.name.trim().split(' ').map((word, index)=>{
          if(index %2 === 0){
            return <span key={index} className='font-bold'>{word} </span>;
          }
          return word + " ";
        })}</p>
        <div className='flex flex-col gap-3 text-[18px] text-center items-start'>
          <p className='text-start'>{item.description}</p>
          {type === TransactionType.Virtual && <p><span className='font-bold text-[21px]'>{item.quantity}</span> In Quantity</p>}
          <p><span className='font-bold text-[21px] capitalize'>{item.requirement}</span> Requirement</p>

          <p><span className='font-bold text-[21px]' style={{color:Colors.themeColor}}>{formatCurrency(item.escrowFee * item.quantity)}</span> Total Escrow Charge</p>

          <p className='font-bold'>Total Price: <span className='font-bold text-[21px]' style={{color:Colors.themeColor}}>{formatCurrency(item.totalPrice)}</span></p>
          {item.paymentMade && <div className='w-full' onClick={()=>window.open(item.buyerPaidProof, '_blank')}><PaymentReceipt item={item} url={item.buyerPaidProof!} /></div>}
          {item.proofOfWork.length !== 0 && <p className='font-bold'>{type === TransactionType.Virtual? "Virtual Documents:":"Developer's Works:"}</p>}
          {item.proofOfWork.map((work, index)=><ProofOfWorkItem key={index} item={item} url={work} />)}
          {children}
        </div>
      </div>
    </div>
  )
}
