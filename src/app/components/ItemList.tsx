import React, { useState } from 'react';
import { deleteDoc, doc, writeBatch, updateDoc} from 'firebase/firestore';
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'name' | 'count' | null>(null);
  const [newValue, setNewValue] = useState<string>('');

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

  const startEditing = (id: string, field: 'name' | 'count', value: string) => {
    setEditingId(id);
    setEditingField(field);
    setNewValue(value);
  };

  const updateItem = async (id: string, field: 'name' | 'count') => {
    if (newValue !== '') {
      const updateData = field === 'count' 
        ? { [field]: parseInt(newValue, 10) }
        : { [field]: newValue };
      await updateDoc(doc(db, 'items', id), updateData);
      setEditingId(null);
      setEditingField(null);
      onItemDeleted(); // Refresh the list
    }
  };

  return (
    <div>
      <ul>
        {items.map((item: Item, id: number) => (
          <li key={id} className='my-4 w-full flex justify-between bg-slate-950'>
            <div className='p-4 w-full flex justify-between'>
              {editingId === item.id && editingField === 'name' ? (
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onBlur={() => updateItem(item.id, 'name')}
                  autoFocus
                  className="bg-transparent border border-white text-white w-32 text-center capitalize"
                />
              ) : (
                <span
                  onClick={() => startEditing(item.id, 'name', item.name)}
                  className="cursor-pointer hover:bg-slate-800 p-1 rounded capitalize"
                >
                  {item.name}
                </span>
              )}
              {editingId === item.id && editingField === 'count' ? (
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onBlur={() => updateItem(item.id, 'count')}
                  autoFocus
                  className="bg-transparent border border-white text-white w-16 text-center"
                />
              ) : (
                <span
                  onClick={() => startEditing(item.id, 'count', item.count)}
                  className="cursor-pointer hover:bg-slate-800 p-1 rounded"
                >
                  {item.count}
                </span>
              )}
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
        <div className="mt-6 flex justify-center">
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
