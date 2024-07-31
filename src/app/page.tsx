'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  QuerySnapshot,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '~/server/db';

// import { desc } from "drizzle-orm";
// import Link from "next/link";
// import { db } from "~/server/db";

interface Item {
  id: string;
  name: string;
  price: string;
}

interface Image {
  id: string;
  name: string;
  url: string;
}

// Make sure to change TS version to match with workspace instead of vscode

// Convert page to a dynamic page, making sure that everytime something changes in the database, the page is revalidated
export const dynamic = "force-dynamic";

/* async function Images() {
  // const images = await db.query.images.findMany();
  // flip the images order in reverser order:
  const images = await db.query.images.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });

  return(
    <div className="flex flex-wrap gap-4">
      {images.map((image) => (
        <div key={image.id} className='flex flex-col w-48'>
          <img src={image.url} alt="image"/>
          <div>{image.name}</div>
        </div>
      ))}
    </div>
  )
} */

/**
 * This approach uses a one-time fetch to retrieve images from Firestore:

    Suitable for scenarios where real-time updates are not required
    Executes a single query when the function is called
    Returns a Promise that resolves with the image data
    Efficient for infrequently changing data or when you want to control when data is fetched
    Can be used in both server-side and client-side contexts
 */
/* async function Images() {
  const imageRef = collection(db, 'images');
  const q = query(imageRef, orderBy('id', 'desc'));
  const querySnapshot = await getDocs(q);
  const images = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))

  return (<div></div>);
} */

/**
 * This approach sets up a real-time listener for Firestore updates:

    Ideal for scenarios requiring live updates as data changes
    Uses React hooks (useState and useEffect) for state management and side effects
    Automatically updates the component state when Firestore data changes
    Provides a smoother user experience for frequently updating data
    Includes cleanup to prevent memory leaks when the component unmounts
    Specifically designed for client-side React applications
 * 
 */
  function Images() {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'images'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const imagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Image));
      setImages(imagesData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      {images.map((image) => (
        <div key={image.id} className='flex flex-col w-48'>
          <Image 
            src={image.url} 
            alt={image.name}
            width={192}
            height={192}
            layout="responsive"
          />
          <div>{image.name}</div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState({ name: '', price: '' });
  const [total, setTotal] = useState(0);

  const itemsCollection = collection(db, 'items');

  const addItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if(newItem.name && newItem.price) {
      await addDoc(itemsCollection, {
        name: newItem.name.trim(),
        price: newItem.price,
      });
      setNewItem({ name: '', price: '' });
    }
  }

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, 'items', id));
  };

  const calculateTotal = (itemsArr: Item[]) => {
    return itemsArr.reduce((sum, item) => sum + parseFloat(item.price), 0);
  };

  useEffect(() => {
    const q = query(itemsCollection);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsArr: Item[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name as string,
          price: data.price as string
        };
      });
      setItems(itemsArr);
      setTotal(calculateTotal(itemsArr));
    });
    return unsubscribe;
  }, []);
  
  

  const renderForm = () => (
    <form className='grid grid-cols-6 items-center text-black'>
      <input
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        className='col-span-3 p-3 border'
        type='text'
        placeholder='Enter Item'
      />
      <input
        value={newItem.price}
        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        className='col-span-2 p-3 border mx-3'
        type='number'
        placeholder='Enter $'
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

  const renderItems = () => (
    <ul>
      {items.map((item: Item, id: number) => (
        <li key={id} className='my-4 w-full flex justify-between bg-slate-950'>
          <div className='p-4 w-full flex justify-between'>
            <span className='capitalize'>{item.name}</span>
            <span>${item.price}</span>
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

  const renderTotal = () => (
    items.length > 0 && (
      <div className='flex justify-between p-3'>
        <span>Total</span>
        <span>${total}</span>
      </div>
    )
  );

  return (
    <main className="">
      <SignedOut>
          <div className="h-full w-full text-2xl text-center">Please sign in above</div>
      </SignedOut>
      <SignedIn>
        <Images />
        <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm '>
          <h1 className='text-4xl p-4 text-center'>Inventory Tracker</h1>
          <div className='bg-slate-800 p-4 rounded-lg'>
            {renderForm()}
            {renderItems()}
            {renderTotal()}
          </div>
        </div>
      </SignedIn>
    </main>
  );
}
