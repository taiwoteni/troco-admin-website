'use client';

import {QueryClient, QueryClientProvider}  from '@tanstack/react-query'
import AdminProvider from '@/providers/AdminProvider';


export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return <QueryClientProvider client={queryClient}>
    <AdminProvider>{children}</AdminProvider>
  </QueryClientProvider>;
}
