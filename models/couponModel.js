const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ['cart-wise', 'product-wise', 'bxgy', 'payment']  
    },
    details: {
        discount: Number,  // For percentage or flat discount
        maxDiscount: Number,  // For capped percentage discounts
        flatDiscount: Number,  // Explicit field for flat discounts
        applicableProducts: [{ type: String }],  // Array of product IDs/types
        applicablePlaces: [{ type: String }],  // Array of place types
        minQuantity: Number,  // Minimum quantity needed for the coupon to apply
        // Fields for BXGY
        buy: [{
            product_id: { type: String },
            quantity: { type: Number }
        }],
        get: [{
            product_id: { type: String },
            quantity: { type: Number }
        }],
        repetition_limit: Number
    },
    expirationDate: {
        type: Date,
        required: true
    }
});

// Middleware to log before saving (optional, but good for debugging)
couponSchema.pre('save', function(next) {
    console.log(`Saving coupon with code: ${this.code}, type: ${this.type}`);
    next();
});

module.exports = mongoose.model('Coupon', couponSchema);
