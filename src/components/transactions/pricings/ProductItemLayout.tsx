'use client'

/* eslint-disable @next/next/no-img-element */
import React, { CSSProperties, ReactNode, useRef } from 'react'
import { SalesItem } from '../../../utils/interfaces/sales-item'
import { Colors } from '../../../utils/Colors'
import { formatCurrency } from '../../../utils/Format'
import CarouselRefType from '@/components/carousel/CarouselRefType'
import { Carousel } from '@/components/carousel/Carousel'
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react'

interface props{
  inverse:boolean,
  item:SalesItem,
  style:CSSProperties,
  children:ReactNode
}
export default function ProductItemLayout({inverse, item, style, children}:props) {

  const ref = useRef<CarouselRefType>(null);
  return (
    <div className={`w-full flex gap-9 ${inverse? 'flex-row-reverse':'flex-row'}`} style={style}>
      {/* Images div */}
      <div className='w-[45%] max-h-[350px] flex justify-center items-center relative'>
        <Carousel
          ref={ref}
        >
          {
            item.getImages.map((image, index)=> (
              <img key={index} className='w-full h-auto max-h-[350px] self-center object-cover rounded-[25px]' src={image} alt='product image' width={100} height={100} />
            ))
          }
          
        </Carousel>

        {item.getImages.length > 1 && <>
          <div onClick={ref.current?.back} className='w-[50px] h-[50px] absolute left-3 rounded-[50%] cursor-pointer bg-opacity-20 bg-black flex items-center justify-center'>
            <ArrowLeft2 color='#fff' variant='Bold' />
          </div>

          <div onClick={ref.current?.next} className='w-[50px] h-[50px] absolute right-3 rounded-[50%] cursor-pointer bg-opacity-20 bg-black flex items-center justify-center'>
            <ArrowRight2 color='#fff' variant='Bold' />
          </div>
        </>}

        
        
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
          <p><span className='font-bold text-[21px]'>{item.quantity}</span> In Quantity</p>
          <p><span className='font-bold text-[21px]'>{item.quality}</span> Product</p>
          <p><span className='font-bold text-[21px]'>{item.productCondition}</span> Product Condition</p>

          <p><span className='font-bold text-[21px]' style={{color:Colors.themeColor}}>{formatCurrency(item.escrowFee)}</span> Escrow Charge Per Item</p>

          <p className='font-bold mb-3'>Total Price: <span className='font-bold text-[21px]' style={{color:Colors.themeColor}}>{formatCurrency(item.totalPrice)}</span></p>

          {children}
        </div>
      </div>
    </div>
  )
}
