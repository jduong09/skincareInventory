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
  const categoryId = await Category.findOne({ name: req.body.category }).then(data => data._id.toString());

  const itemData = {
    name: req.body.name,
    volume: req.body.volume,
    description: req.body.description,
    brand: req.body.brand,
    skin_type: req.body.skin_type,
    category: [categoryId]
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
// Index Page.
// Read All Items
app.get('/', async (req, res) => {
  mongoose.connect(mongoConnection);
  let items;
  let currentCategory = 'All Items';
  
  if (req.query.category) {
    const foundCategory = await Category.findOne({ name: req.query.category })
      .then(data => {
        return {
          id: data._id.toString(),
          name: data.name
        }
      });

    items = await Item.find({ category: [foundCategory.id] }).then(data => {
      return data.map((item) => {
        return {
          id: item._id.toString(),
          name: item.name,
          brand: item.brand,
          skin_type: item.skin_type,
        }
      });
    });
    
    currentCategory = foundCategory.name;
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

// Get New Item Form
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

// Get Item Detail Page
app.get('/items/:itemId', async (req, res) => {
  const item = await Item.findById(req.params.itemId);
  
  const itemData = {
    name: item.name,
    volume: item.volume, 
    description: item.description,
    brand: item.brand,
    skin_type: item.skin_type[0],
    category: item.category[0]
  }

  const category = await Category.findById(item.category[0]);

  const allProductsByCategory = await Item.find({ category: [category._id] }).then(data => {
    return data.reduce((result, product) => {
      if (product._id.toString() !== req.params.itemId) {
        result.push({
          id: product._id.toString(),
          name: product.name,
          brand: product.brand
        })
      }
      return result;
    }, []);
  });

  res.render('detail', { item: itemData, currentCategory: category.name, productsByCategory: allProductsByCategory });
});

// Read Items based on category
app.get(`/items/:categoryName`, async (req, res) => {
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
// Get Update Form Page.
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
      skin_type: data.skin_type[0],
      category: data.category
    }
  });
  res.render('form', { title: 'Update Item', item, categories });
});

// Update item by itemId and Form Body.
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
    brand: req.body.brand,
    skin_type: req.body.skin_type,
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
// Delete Item by itemId
app.delete('/items/:itemId/delete', async (req, res) => {
  await mongoose.connect(mongoConnection);

  try {
    await Item.findOneAndDelete({ _id: req.params.itemId })
    res.send({ message: 'Success' });
  } catch(err) {
    res.send({ message: 'Problem deleting Item' });
  }
});

app.listen(port, () => {
  console.log(`Inventory App listening on port ${port}`);
})