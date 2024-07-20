import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';

interface Item {
  _id: string;
  name: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get<Item[]>('http://localhost:5000/items');
      setItems(response.data);
    } catch (err) {
      setError('Error fetching items');
      console.error(err);
    }
  };

  const addItem = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post<Item>('http://localhost:5000/items', { name: newItem });
      setItems([...items, response.data]);
      setNewItem('');
    } catch (err) {
      setError('Error adding item');
      console.error(err);
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      setError('Error deleting item');
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Items</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={addItem}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            {item.name}
            <button onClick={() => deleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
