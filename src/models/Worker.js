const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    salary: { type: Number, required: true },
    paidSalary: { type: Number, default: 0 },
    contact: { type: String }
});

module.exports = mongoose.model('Worker', workerSchema);
