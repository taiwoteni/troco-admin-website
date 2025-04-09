'use client';
export function formatCurrency(amount:number, decimal?:boolean):string{
    const showDecimal = decimal ?? true;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits:showDecimal? 2:0,
    }).format(amount);
  };

  export function formatDigits(digit:number):string{
    return new Intl.NumberFormat(
      'en-NG',
      {
        notation:'compact',
        compactDisplay:'short',
      }
  
    ).format(digit);
  }