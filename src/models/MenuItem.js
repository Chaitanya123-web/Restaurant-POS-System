const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    imageUrl: { type: String }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);