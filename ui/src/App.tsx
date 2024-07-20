import React, { useState, useEffect, FormEvent } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, useMutation, gql } from '@apollo/client';

interface Item {
  _id: string;
  name: string;
}

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
});

const GET_ITEMS = gql`
  query GetItems {
    items {
      _id
      name
    }
  }
`;

const ADD_ITEM = gql`
  mutation AddItem($name: String!) {
    addItem(name: $name) {
      _id
      name
    }
  }
`;

const DELETE_ITEM = gql`
  mutation DeleteItem($_id: ID!) {
    deleteItem(_id: $_id)
  }
`;

const App: React.FC = () => {
  const { loading, error, data, refetch } = useQuery(GET_ITEMS);
  const [addItem] = useMutation(ADD_ITEM);
  const [deleteItem] = useMutation(DELETE_ITEM);
  const [newItem, setNewItem] = useState<string>('');

  const handleAddItem = async (event: FormEvent) => {
    event.preventDefault();
    await addItem({ variables: { name: newItem } });
    setNewItem('');
    refetch();
  };

  const handleDeleteItem = async (_id: string) => {
    await deleteItem({ variables: { _id } });
    refetch();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1>Items</h1>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {data.items.map((item: Item) => (
          <li key={item._id}>
            {item.name}
            <button onClick={() => handleDeleteItem(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const WrappedApp: React.FC = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

export default WrappedApp;
