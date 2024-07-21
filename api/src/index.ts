import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/schema';
import { root } from './graphql/resolvers';
import Item from './models/Item';

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/matchie';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    seedDatabase(); // Call the seed function after successful connection
  })
  .catch(err =>  console.log('MongoDB connection error:', err));

// Function to seed the database with an initial item
const seedDatabase =  async () => {
  const items = await Item.find();
  if (items.length === 0) {
    const newItem = new Item({ name: 'Sample Item' });
    await newItem.save();
    console.log('Database seeded with initial item.');
  } else {
    console.log('Database already seeded.');
  }
};

app.use(cors()); // Enable CORS
app.use(express.json());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL UI
}));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
