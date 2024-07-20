import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5001;
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/matchie';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    seedDatabase(); // Call the seed function after successful connection
  })
  .catch(err => console.log('MongoDB connection error:', err));

const itemSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model('Item', itemSchema);

app.use(cors()); // Enable CORS
app.use(express.json());

const seedDatabase = async () => {
  const items = await Item.find();
  if (items.length === 0) {
    const newItem = new Item({ name: 'Sample Item' });
    await newItem.save();
    console.log('Database seeded with initial item.');
  } else {
    console.log('Database already seeded.');
  }
};

app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/items', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.json(newItem);
});

app.delete('/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
