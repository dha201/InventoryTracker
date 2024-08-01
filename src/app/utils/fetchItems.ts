import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '~/server/db';

interface Item {
  name: string;
}

export async function fetchItems(): Promise<string[]> {
  const itemsCollection = collection(db, 'items');
  const snapshot = await getDocs(itemsCollection);
  
  const itemNames = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
    const data = doc.data() as Item;
    return data.name;
  });

  console.log('Fetched item names:', itemNames);
  return itemNames;
}
