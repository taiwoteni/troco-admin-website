'use client'

import modalProps from "@/utils/interfaces/modal";

interface prop{
    modal:modalProps;
}

import React from 'react'
import { FaX } from "react-icons/fa6";

export default function PopupModal({modal}:prop) {
  return (
    <div onClick={modal.onCancel} className="fixed z-20 inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div onClick={(e)=> e.stopPropagation()} style={{animationDuration:'0.5s'}} className="bg-white p-5 rounded-lg relative shadow-md w-[300px] modal-popin">
            <div onClick={modal.onCancel} className='rounded-[50%] z-[51] absolute -right-3.5 -top-3.5 cursor-pointer text-[12px] p-3 flex items-center justify-center text-white bg-themeColor'>
                <FaX />
            </div>
            <h2 className="text-xl font-bold mb-4">{modal.title}</h2>
            <p style={{maxLines:10}}>{modal.question}</p>
            <div className="flex justify-end mt-4">
                <button onClick={modal.onCancel} className="bg-tertiary text-black px-4 py-2 rounded mr-2">{modal.cancelText ?? "Cancel"}</button>
                <button onClick={modal.onOk} className={` text-white px-4 py-2 rounded ${modal.negative? 'bg-red-500': 'bg-themeColor'}`}>{modal.okText ?? "Confirm"}</button>
            </div>
        </div>
  </div>
  )
}
