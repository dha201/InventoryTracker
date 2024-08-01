import React, { useState } from 'react';
import { addDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '~/server/db';
import { useAuth } from "@clerk/nextjs";

interface ItemFormProps {
  onItemAdded: () => void;
}

export function ItemForm({ onItemAdded }: ItemFormProps) {
  const [newItem, setNewItem] = useState({ name: '', count: '' });
  const { userId } = useAuth();

  const addItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(newItem.name && newItem.count && userId) {
      const itemName = newItem.name.trim();
      const itemCount = parseInt(newItem.count, 10);

      // Query to check if the item already exists
      const q = query(collection(db, 'items'), 
        where('name', '==', itemName),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Item exists, update the count
        const existingItem = querySnapshot.docs[0]!;
        const existingCount = existingItem.data().count as number;
        await updateDoc(existingItem.ref, {
          count: existingCount + itemCount
        });
      } else {
        // Item doesn't exist, add it
        await addDoc(collection(db, 'items'), {
          name: itemName,
          count: itemCount,
          userId: userId,
        });
      }

      setNewItem({ name: '', count: '' });
      onItemAdded();
    }
  }

  return (
    <form className='grid grid-cols-6 items-center text-black'>
      <input
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        className='col-span-3 p-3 border'
        type='text'
        placeholder='Enter Item'
      />
      <input
        value={newItem.count}
        onChange={(e) => setNewItem({ ...newItem, count: e.target.value })}
        className='col-span-2 p-3 border mx-3'
        type='number'
        placeholder='Enter count'
      />
      <button
        onClick={addItem}
        className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl'
        type='submit'
      >
        +
      </button>
    </form>
  );
}
