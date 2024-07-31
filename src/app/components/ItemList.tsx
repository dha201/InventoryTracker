import React from 'react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '~/server/db';

interface Item {
  id: string;
  name: string;
  price: string;
}

interface ItemListProps {
  items: Item[];
  onItemDeleted: () => void;
}

export function ItemList({ items, onItemDeleted }: ItemListProps) {
  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, 'items', id));
    onItemDeleted();
  };

  return (
    <ul>
      {items.map((item: Item, id: number) => (
        <li key={id} className='my-4 w-full flex justify-between bg-slate-950'>
          <div className='p-4 w-full flex justify-between'>
            <span className='capitalize'>{item.name}</span>
            <span>{item.price}</span>
          </div>
          <button
            onClick={() => deleteItem(item.id)}
            className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16'
          >
            X
          </button>
        </li>
      ))}
    </ul>
  );
}
