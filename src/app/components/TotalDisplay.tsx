import React from 'react';

interface TotalDisplayProps {
  total: number;
}

export function TotalDisplay({ total }: TotalDisplayProps) {
  return (
    <div className='flex justify-between p-3'>
      <span>Total</span>
      <span>${total.toFixed(2)}</span>
    </div>
  );
}
