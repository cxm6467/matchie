import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 5000;

app.get('/', async (req: Request, res: Response) => {
  try {
    console.log('Fetching data from API...');
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    console.log('Data fetched:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
