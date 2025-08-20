const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes.js')

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB is connected');
    app.listen(8000, () => console.log('Server is running on port 8000'));
  })
  .catch(err => console.log(err));