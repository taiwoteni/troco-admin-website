// components/QueryErrorBoundary.tsx
'use client';

import React, { ReactNode, useEffect } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import LottieWidget from '../lottie/LottieWidget';
import errorAnim from '../../../public/lottie/error.json';
import { ErrorBoundary } from 'react-error-boundary';

interface QueryErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  message?: ReactNode,
}

function QueryErrorFallback({ error, resetErrorBoundary, message }: QueryErrorFallbackProps) {
    useEffect(()=>{
        console.error(error)
    },[error])
  return (
    <div className='w-full h-full flex flex-col gap-2 flex-center bg-white'>
        <LottieWidget lottieAnimation={errorAnim} className='w-[200px] h-[200px] aspect-square object-cover' />
        <h2 className='text-[25px] font-bold font-lato'>An Error Occurred</h2>
        <p className='text-secondary text-center font-quicksand -mt-1 text-sm'>
            {message && message}
            {!message && <span>Give us <b>a</b> minute.</span>}
        </p>
        <button className='min-w-[80px] py-2 text-center text-sm font-normal mt-3 font-quicksand text-white rounded-[20px] bg-themeColor' onClick={()=>resetErrorBoundary()}>Retry</button>
    </div>
  );
}

export function QueryErrorBoundary({ children, message }: { children: React.ReactNode, message?: ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          FallbackComponent={(props) => <QueryErrorFallback {...props} message={message} />}
          onReset={reset}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}