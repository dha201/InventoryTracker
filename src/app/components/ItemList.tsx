import React from 'react';
import { deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '~/server/db';

interface Item {
  id: string;
  name: string;
  count: string;
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

  const deleteAllItems = async () => {
    const batch = writeBatch(db);
    items.forEach((item) => {
      const docRef = doc(db, 'items', item.id);
      batch.delete(docRef);
    });
    await batch.commit();
    onItemDeleted();
  };

  return (
    <div>
      <ul>
        {items.map((item: Item, id: number) => (
          <li key={id} className='my-4 w-full flex justify-between bg-slate-950'>
            <div className='p-4 w-full flex justify-between'>
              <span className='capitalize'>{item.name}</span>
              <span>{item.count}</span>
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
      {items.length > 0 && (
        <div className="mt-6 text-right">
          <button
            onClick={deleteAllItems}
            className='p-2 bg-red-600 text-white rounded hover:bg-red-700'
          >
            Delete All
          </button>
        </div>
      )}
    </div>
  );
}
