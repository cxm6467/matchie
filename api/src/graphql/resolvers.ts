import Item from '../models/Item'; 

export const root = {
  items: async () => {
    return await Item.find();
  },
  addItem: async ({ name }: { name: string }) => {
    const newItem = new Item({ name });
    await newItem.save();
    return newItem;
  },
  deleteItem: async ({ _id }: { _id: string }) => {
    await Item.findByIdAndDelete(_id);
    return 'Item deleted';
  },
};
