'use client';

import {QueryClient, QueryClientProvider}  from '@tanstack/react-query'
import AdminProvider from '@/providers/AdminProvider';
import DashboardProvider from './DashboardProvider';
import TransactionsProvider from './TransactionsProvider';
import UsersProvider from './UserProvider';
import BonusesProvider from './BonusesProvider';
import WithdrawalsProvider from './WithdrawalsProvider';
import { SessionsProvider } from './SessionsProvider';
import { useEffect } from 'react';
import { getSocket } from '@/services/socket-io/Core';


export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  useEffect(()=>{
    getSocket();
  }, [])

  return <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <DashboardProvider>
        <TransactionsProvider>
          <UsersProvider>
            <BonusesProvider>
              <WithdrawalsProvider>
                <SessionsProvider>
                  {children}
                </SessionsProvider>
              </WithdrawalsProvider>
            </BonusesProvider>
          </UsersProvider>
        </TransactionsProvider> 
      </DashboardProvider>
    </AdminProvider>
  </QueryClientProvider>;
}
