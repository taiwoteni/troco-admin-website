'use client';

import React, { useMemo} from 'react'
import { useTransactions } from '@/providers/TransactionsProvider';
import { ChartData } from 'chart.js';
import {Line} from 'react-chartjs-2';
import { distinctList } from '@/utils/ArrayUtil';
import { Colors } from '@/utils/Colors';

export default function TransactionsBarChart() {
    // const [tabIndex, selectIndex] = useState(0)
    const {allTransactions} = useTransactions();

    const uniqueTransactions = useMemo(()=>distinctList(allTransactions, '_id'), [allTransactions])

    const lineData = useMemo<ChartData<'line', number[], string>>(()=>{

        const monthlyTransactions = Array.from({ length: 12 }, (_, index) => {
            const currentMonth = index; // January = 0, February = 1, etc.
        
            return uniqueTransactions
              .filter(t => 
                new Date(t.createdTime).getFullYear() === new Date().getFullYear() &&
                new Date(t.createdTime).getMonth() === currentMonth
              )
              .reduce((sum, t) => {
                const newSum = sum + (t.totalTransactionAmount ?? 0);
        
                // Update min and max amounts
                // if (newSum > maxAmount) maxAmount = newSum;
                // if (newSum < minAmount) minAmount = newSum;
        
                return newSum;
              }, 0); // Initial sum is 0
          });

          return {
            labels:["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [
                {
                    data: monthlyTransactions,
                    fill: true,
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    showLine: true,
                    pointBorderColor: Colors.tertiary
                }
            ],

          };


    },[uniqueTransactions])

  return (
    <div className='w-full min-h-[500px] bg-white shadow-lg rounded-2xl gap-3 px-6 py-4'>
        <div className='w-full flex items-center justify-start mb-3'>
            <h1 className='font-bold text-[21px]'>Transactions This Year</h1>
            {/* <div className='w-[200px]'>
                <AestheticTabbar className='h-[47px]' tabs={['All', 'Revenue']} onSelectTab={selectIndex} index={tabIndex} />
            </div> */}
        </div>
        <Line data={lineData} options={{ maintainAspectRatio: true, plugins: { legend: { display: false }, filler: { propagate: true }, colors: { forceOverride: true } }, scales: { x: { type: 'category', grid:{display:false} }, y: { type: 'linear', beginAtZero: true } } }} />
    </div>
  )
}
