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
  await newItem.save();
  res.redirect('/');
});

// Create Category?
app.post('/category/new', async (req, res) => {
  await mongoose.connect(mongoConnection);
  try {
    const newCategory = new Category({ name: req.body.category });
    await newCategory.save();
    res.redirect('/');
  } catch(e) {
    console.log(e);
  }
});
// Read

// Read All Items
app.get('/', async (req, res) => {
  mongoose.connect(mongoConnection);
  let items;
  let currentCategory = 'All Items';

  if (req.query.category) {
    items = await Item.find({ category: [req.query.category] }).then(data => {
      return data.map((item) => {
        return {
          id: item._id.toString(),
          name: item.name,
          brand: item.brand,
          skin_type: item.skin_type,
        }
      });
    });
    currentCategory = req.query.category;
  } else {
    items = await Item.find({}).then(data => {
      return data.map((item) => {
        return {
          id: item._id.toString(),
          name: item.name,
          brand: item.brand,
          skin_type: item.skin_type,
        }
      });
    });
  }

  const categories = await Category.find({}).then(data => {
    return data.map((category) => {
      return {
        name: category.name
      }
    })
  });

  res.render('index', { items, categories, currentCategory });
});

// Read new item form
app.get('/item/new', async (req, res) => {
  await mongoose.connect(mongoConnection);

  const categories = await Category.find({}).then(data => {
    return data.map((category) => {
      return {
        name: category.name
      }
    })
  });

  res.render('form', { title: 'Add Item', categories });
});

// Read One Item
app.get('/items/:itemId', async (req, res) => {
  const item = await Item.findById(req.params.itemId);

  res.render('detail', { item });
});

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
  res.render('index', { items });
});
// Update
app.get('/items/:itemId/update', async (req, res) => {
  await mongoose.connect(mongoConnection);

  const categories = await Category.find({}).then(data => {
    return data.map((response) => {
      return {
        name: response.name
      }
    })
  });

  const item = await Item.findById(req.params.itemId).then(data => {
    return {
      id: data._id.toString(),
      name: data.name,
      volume: data.volume,
      description: data.description,
      brand: data.brand,
      skin_type: data.skin_type,
      category: data.category
    }
  });
  res.render('form', { title: 'Update Item', item, categories });
});

// Update item? 
  // Admin privileges? 
app.post('/items/:itemId/update', async (req, res) => {
  await mongoose.connect(mongoConnection);
  const updatedCategories = [];

  if (req.body.category) {
    const foundCategory = await Category.findOne({ name: req.body.category }).then(data => data);
    updatedCategories.push(foundCategory._id)
  }
  
  const updateData = {
    name: req.body.name,
    volume: req.body.volume,
    description: req.body.description,
    brand: req.body.skin_type,
    category: updatedCategories
  }
  
  try {
    await Item.findOneAndUpdate({ _id: req.params.itemId }, updateData);
    res.redirect('/');
  } catch(err) {
    console.log(err);
  }
});
// Update Categories?

// Delete

// Delete Item?

app.listen(port, () => {
  console.log(`Inventory App listening on port ${port}`);
})