import React, { ReactNode } from 'react'

export default function layout({children}: {children: ReactNode}) {
  return (
    <div className="flex flex-col w-full h-[100vh] p-10 bg-green-600">
        <div className="w-[80%] h-[98%] bg-white overflow-hidden rounded-3xl shadow-md self-end md:self-center sm:self-center">
           {children} 
        </div>

    </div>
  )
}
