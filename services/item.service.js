const Item = require('../models/item.model');
import mongoose from 'mongoose';

exports.create = async (req, res) => {
  try {
    const { name, description, remark, photos, date, userId } = req.body;
    const user_Id = new mongoose.Types.ObjectId(userId);


    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const item = await Item.create({
      name,
      description,
      date,
      remark: remark || '',
      photos: photos || [],
      userId: user_Id,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error creating item' });
  }
};

exports.findAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;  // Default to page 1 if not provided
  const limit = parseInt(req.query.limit) || 10;  // Default to 10 items per page
  const isToday = req.query.isToday === 'true';  // Ensure `isToday` is treated as a boolean
  console.log(`Fetching items for page: ${page}, limit: ${limit}, isToday: ${isToday}`);

  try {
    // Base query
    let query = {};

    // If `isToday` is true, filter by today's date
    if (isToday) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Fetch filtered and paginated items
    const items = await Item.find(query)
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .skip((page - 1) * limit) // Skip documents for pagination
      .limit(limit); // Limit the number of items per page

    // Get the total count of documents that match the query
    const total = await Item.countDocuments(query);

    res.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error retrieving items:', error);
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