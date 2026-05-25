const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

// Get all workers
router.get('/', async (req, res) => {
    try {
        const workers = await Worker.find();
        res.json(workers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new worker
router.post('/', async (req, res) => {
    const worker = new Worker(req.body);
    try {
        const savedWorker = await worker.save();
        res.status(201).json(savedWorker);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = router;