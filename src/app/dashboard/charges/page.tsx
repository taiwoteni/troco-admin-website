'use client';

import Button from '@/components/Button';
import { useEscrowCharges } from '@/hooks/charges-hook';
import { updateEscrowCharge } from '@/services/rest-api/transaction-api';
import { Colors } from '@/utils/Colors';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { toast } from 'sonner';

type Category = 'product' | 'virtual' | 'service' | '';

export default function ChargesPage() {
    const {product, service, virtual} = useEscrowCharges()
    const [selectedCategory, setCategory] = useState<Category>('')
    const [percentage, setPercentage] = useState<number>()

    const updateChargeMutation = useMutation({
        mutationFn:()=> updateEscrowCharge({category: selectedCategory, percentage}, true),
        onSuccess: ()=>{
            toast.success("Update Escrow Charges", {description:`Successfully updated ${selectedCategory} escrow charge`});
            setPercentage(undefined);
            setCategory('')
        },
        onError:()=>{
            toast.error("Error updating charges",{description:"Please try again later."})
        }
    })

  return (
    <div className='w-full h-full overflow-y-scroll custom-scrollbar flex flex-col gap-8 px-8 pb-2'>
        <p className='text-secondary text-[26px]  mt-2 font-bold'>Escrow Charges</p>

        <div className='w-full flex gap-7'>
            {/* Charges Table */}
            <div className='flex flex-col flex-1 rounded-2xl bg-white shadow-lg p-5 pt-0 h-fit'>
                <h1 className="text-[22px] font-bold w-full bg-white sticky top-0 z-10 pt-5 pb-3 text-black mb-4">All Charges</h1>
                <div className='w-full h-fit rounded-lg border border-separate border-spacing-0 overflow-hidden'>
                  <table className="w-full rounded-lg border border-spacing-0 table-fixed text-[14px] overflow-hidden">
                    <thead className="px-5 py-3 w-full h-[60px] border-b">
                        <tr className='font-bold text-start bg-tertiary'>
                            <th colSpan={2} className="pl-5 py-3 text-start font-bold">Category</th>
                            <th className="py-3 text-center font-bold">Percentage</th>
                        </tr>
                    </thead>
                    <tbody className='font-quicksand'>
                        <tr className="border-b py-3 hover:bg-[#F9F8F6] font-medium cursor-pointer w-full last:border-b-0 transition-[background-color] ease-in duration-[0.4s]">
                            <td colSpan={2} className="py-3 px-4 overflow-hidden box-border text-ellipsis whitespace-nowrap">Product</td>
                            <td className="py-3 px-4 text-center font-medium">{product ?( product.percentage + "%") : "-/-"}</td>
                        </tr>
                        <tr className="border-b py-3 hover:bg-[#F9F8F6] font-medium cursor-pointer w-full last:border-b-0 transition-[background-color] ease-in duration-[0.4s]">
                            <td colSpan={2} className="py-3 px-4 overflow-hidden box-border text-ellipsis whitespace-nowrap">Service</td>
                            <td className="py-3 px-4 text-center font-medium">{service ?( service.percentage + "%") : "-/-"}</td>
                        </tr>
                        <tr className="border-b py-3 hover:bg-[#F9F8F6] font-medium cursor-pointer w-full last:border-b-0 transition-[background-color] ease-in duration-[0.4s]">
                            <td colSpan={2} className="py-3 px-4 overflow-hidden box-border text-ellipsis whitespace-nowrap">Virtual</td>
                            <td className="py-3 px-4 text-center font-medium">{virtual ?(virtual.percentage + "%") : "-/-"}</td>
                        </tr>
                    </tbody>
                  </table>
                </div>
            </div>

            {/* Upload Charges Section */}
            <form onSubmit={(e)=>{
                e.preventDefault();
                e.stopPropagation();
                updateChargeMutation.mutate();
            }} className="rounded-2xl shadow-lg bg-white p-5 pt-0 pb-5 flex flex-col gap-3 h-[300px] w-[400px]">
              <div>
                <h1 className="text-[22px] text-blac font-bold pt-2 pb-0.5">Update Charge</h1>
                <p className='text-secondary text-[13px]'>To update escrow charge, select category and enter the percentage</p>
              </div>
              <div className='flex flex-1'/>

              <select name="" id=""
                className="p-3 border-2 font-quicksand rounded-2xl placeholder:text-secondary shadow-sm focus:outline-none bg-tertiary focus:border-themeColor"
                required
                style={{color: selectedCategory === ''? Colors.secondary:'black'}}
                onChange={e=>setCategory(e.target.value as Category)}>
                  <option className='text-secondary' value="''">Select Category</option>
                  <option className='text-black' value="product">Product</option>
                  <option className='text-black' value="service">Service</option>
                  <option className='text-black' value="virtual">Virtual</option>
              </select>

              <input
                className="p-3 border-2 w-full resize-none rounded-2xl bg-tertiary placeholder:text-secondary shadow-sm focus:outline-none focus:border-themeColor"
                onChange={(e) => setPercentage(e.target?.valueAsNumber)}
                required
                spellCheck="false"
                type='number'
                placeholder="Set Percentage"
                />

              <Button title='Update' type='submit' className={'w-full'} disabled={selectedCategory === '' || (!percentage && percentage !== 0)} loading={updateChargeMutation.isPending} />
            </form>

        </div>
        
    </div>
  )
}
