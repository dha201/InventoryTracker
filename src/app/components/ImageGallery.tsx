import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from "@clerk/nextjs";
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '~/server/db';

interface Image {
  id: string;
  name: string;
  url: string;
  createdAt: Date;
  userId: string;
}

export function ImageGallery() {
  const { userId } = useAuth();
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    if (userId) {
      const q = query(
        collection(db, 'images'),
        where("userId", "==", userId),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const imagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Image));
        setImages(imagesData);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  return (
    <div className="flex flex-wrap gap-4">
      {images.map((image) => (
        <div key={image.id} className='flex flex-col w-48'>
          <Image
            src={image.url}
            alt={image.name}
            width={192}
            height={192}
            style={{ width: '100%', height: 'auto' }}
          />
          <div>{image.name}</div>
        </div>
      ))}
    </div>
  );
}
