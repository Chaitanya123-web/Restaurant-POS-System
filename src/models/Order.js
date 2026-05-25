const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    billNo: { type: String, required: true },
    date: { type: Date, default: Date.now },
    grandTotal: { type: Number, required: true },
    paymentMode: { type: String, required: true },
    tableNo: { type: Number, required: true },
    items: [{ name: String, quantity: Number, price: Number }],
    subtotal: { type: Number, required: true },
    sgst: { type: Number, required: true },
    cgst: { type: Number, required: true },
    discount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Order', orderSchema);
