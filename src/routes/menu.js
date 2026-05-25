const express = require('express');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

// GET all menu items
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;