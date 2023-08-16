const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const Item = require('./models/item');
const Category = require('./models/category');

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
const mongoConnection = process.env.uri;

// Create
// Create Item
app.post('/item/new', async (req, res) => {
  await mongoose.connect(mongoConnection);
  console.log(req.body);

  const itemData = {
    name: req.body.name,
    volume: req.body.volume,
    description: req.body.description,
    brand: req.body.brand,
    skin_type: req.body.skin_type,
  }

  const newItem = new Item(itemData);
  newItem.save();

  await mongoose.disconnect();
  res.redirect('/');
})

// Create Category?
app.post('/category/new', async (req, res) => {
  await mongoose.connect(mongoConnection);
  const newCategory = new Category({ name: req.body.name });
  await newCategory.save();

  await mongoose.disconnect();
  res.redirect('/');
})
// Read

// Read All Items
app.get('/', async (req, res) => {
  mongoose.connect(mongoConnection);
  const items = await Item.find({}).then(data => {
    return data.map((item) => {
      return {
        name: item.name,
        brand: item.brand,
        skin_type: item.skin_type,
      }
    });
  });
  await mongoose.disconnect();
  res.render('index', { items });
  
});

// Read new item form
app.get('/item/new', (req, res) => {
  res.render('form');
});

// Read One Item

// Read Items based on category
app.get(`/items/:categoryName`, async (req, res) => {
  console.log(req.params.categoryName);
  const items = await Item.find({ category: [req.params.categoryName] }).then(data => {
    return data.map((item) => {
      return {
        name: item.name,
        brand: item.brand,
        skin_type: item.skin_type,
      }
    });
  });

  await mongoose.disconnect();
  res.render('index', { items });
})
// Update

// Update item? 
  // Admin privileges? 

// Update Categories?

// Delete

// Delete Item?

app.listen(port, () => {
  console.log(`Inventory App listening on port ${port}`);
})