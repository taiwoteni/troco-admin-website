'use client';

import {QueryClient, QueryClientProvider}  from '@tanstack/react-query'
import AdminProvider from '@/providers/AdminProvider';
import DashboardProvider from './DashboardProvider';
import TransactionsProvider from './TransactionsProvider';
import UsersProvider from './UserProvider';
import BonusesProvider from './BonusesProvider';
import WithdrawalsProvider from './WithdrawalsProvider';
import { SessionsProvider } from './SessionsProvider';


export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

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
