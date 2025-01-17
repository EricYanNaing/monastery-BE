const Item = require('../models/item.model');

exports.create = async (req, res) => {
  try {
    const { name, description, remark, photos, date } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const item = await Item.create({
      name,
      description,
      date,
      remark: remark || '',
      photos: photos || [],
      userId: req.user.id
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error creating item' });
  }
};

exports.findAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;  // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10;  // Default to 10 items per page
  console.log(`Fetching items for page: ${page}, limit: ${limit}`);

  try {
    const items = await Item.find().skip((page - 1) * limit).limit(limit);

    const total = await Item.countDocuments();

    res.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ message: 'Error retrieving items' });
  }
};


exports.findOne = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, userId: req.user.id });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving item' });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, remark, photos , date } = req.body;
    const updatedItem = await Item.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, description, remark, photos, date },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item' });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedItem = await Item.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};