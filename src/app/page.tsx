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
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);


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
    // For now, it's empty as the onSnapshot will automatically update the items.
  };

  const handleItemDeleted = () => {
    // Similar to handleItemAdded, this can be used for any post-deletion actions
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFind = () => {
    const item = items.find(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (item) {
      setHighlightedItemId(item.id);
      setTimeout(() => setHighlightedItemId(null), 2000); // Remove highlight after 2 seconds
    }
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
            <div className="text-center text-xlg my-4 text-white">OR</div>
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={handleSearch}
                className="p-2 rounded text-stone-800"
              />
              <button
                onClick={handleFind}
                className="ml-2 p-2 bg-blue-500 text-white rounded"
              >
                Find
              </button>
            </div>
            <ItemForm onItemAdded={handleItemAdded} />
            <ItemList items={items} onItemDeleted={handleItemDeleted} searchTerm={searchTerm} highlightedItemId={highlightedItemId} />
          </div>
        </div>
      </SignedIn>
    </main>
  );
}
