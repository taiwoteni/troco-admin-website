'use client';

import { QueryErrorBoundary } from '@/components/error/QueryErrorBoundary';
import React, { ReactNode } from 'react'

export default function RootLayout({children}:{children?: ReactNode}) {
  return (
    <QueryErrorBoundary message={<span>Could not find this user.<br/>Please try again later</span>}>{children}</QueryErrorBoundary>
  )
}
