'use client';

import { SignedIn, SignedOut } from "@clerk/nextjs";
import React, { useState, useEffect } from 'react';
import { useAuth } from "@clerk/nextjs";
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '~/server/db';

import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';

import CustomUploadButton from './components/UploadButton';

interface Item {
  id: string;
  name: string;
  count: string;
}

export const dynamic = "force-dynamic";

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      const q = query(collection(db, 'items'), where("userId", "==", userId));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const itemsArr: Item[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name as string,
          count: doc.data().count as string
        }));
        setItems(itemsArr);
      });
      return unsubscribe;
    }
  }, [userId]);

  const handleItemAdded = () => {
    // This function can be used to trigger any additional actions after an item is added
    // For now, it's empty as the onSnapshot will automatically update the items
  };

  const handleItemDeleted = () => {
    // Similar to handleItemAdded, this can be used for any post-deletion actions
  };

  return (
    <main className="">
      <SignedOut>
        <div className="h-full w-full text-2xl text-center">Please sign in above</div>
      </SignedOut>
      <SignedIn>
        <div className='z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center font-mono text-sm'>
          <h1 className='text-4xl p-4 text-center'>Inventory Tracker</h1>
          <div className='bg-slate-800 p-4 rounded-lg'>
            <div className="flex justify-center">
              <CustomUploadButton />
            </div>
            <div className="text-center my-4 text-white">OR</div>
            <ItemForm onItemAdded={handleItemAdded} />
            <ItemList items={items} onItemDeleted={handleItemDeleted} />
          </div>
        </div>
      </SignedIn>
    </main>
  );
}
