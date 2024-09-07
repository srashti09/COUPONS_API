
const Coupon = require('../models/couponModel');

const mongoose = require('mongoose');

// Helper function to calculate discounts
function calculateDiscount(details, cartTotal) {
    let discountApplied = 0;
    if (details.discount && details.maxDiscount) {
        // Percentage based discount
        const calculatedDiscount = (cartTotal * details.discount) / 100;
        discountApplied = Math.min(calculatedDiscount, details.maxDiscount);
    } else if (details.flatDiscount && cartTotal >= details.threshold) {
        // Flat discount on minimum spend
        discountApplied = details.flatDiscount;
    }
    return discountApplied;
}

// Create a new coupon
const createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        console.log('Coupon created:', coupon);
        res.status(201).json(coupon);
    } catch (error) {
        console.error('Error creating coupon:', error);
        res.status(400).json({ message: 'Error creating coupon', error: error.message });
    }
};

// Apply a coupon to the cart
const applyCoupon = async (req, res) => {
    const { cart } = req.body;  // Cart items with total
    const { code } = req.params;  // Coupon code passed as URL parameter

    try {
        const coupon = await Coupon.findOne({ code });
        if (!coupon) {
            console.error('Coupon not found:', code);
            return res.status(404).json({ message: 'Coupon not found' });
        }

        const today = new Date();
        if (today > coupon.expirationDate) {
            console.warn('Coupon expired:', code);
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        let totalDiscount = 0;
        const cartTotal = cart.total;

        switch (coupon.type) {
            case 'cart-wise':
                totalDiscount = calculateDiscount(coupon.details, cartTotal);
                break;
            case 'payment':
                // Cashback logic if applicable
                if (coupon.details.cashback) {
                    totalDiscount = Math.min(coupon.details.cashback, coupon.details.maxCashback || Infinity);
                }
                break;
                
            
            default:
                console.error('Unhandled coupon type:', coupon.type);
                return res.status(500).json({ message: 'Unhandled coupon type' });
        }

        console.log('Coupon applied:', code, 'Discount:', totalDiscount);
        res.status(200).json({ totalDiscount, message: `Coupon applied: ₹${totalDiscount} discount.` });
    } catch (error) {
        console.error('Error applying coupon:', error);
        res.status(400).json({ message: 'Error applying coupon', error: error.message });
    }
};

// Get a coupon by its ID
const getCouponById = async (req, res) => {
    const { id } = req.params;
    try {
        const coupon = await Coupon.findById(id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.json(coupon);
    } catch (error) {
        console.error('Error fetching coupon:', error);
        res.status(500).json({ message: 'Error fetching coupon', error: error.message });
    }
};

// Update a coupon by its ID
const updateCouponById = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.json(updatedCoupon);
    } catch (error) {
        console.error('Error updating coupon:', error);
        res.status(400).json({ message: 'Error updating coupon', error: error.message });
    }
};

// Delete a coupon by its ID
const deleteCouponById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        if (!deletedCoupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ message: 'Error deleting coupon', error: error.message });
    }
};

const getApplicableCoupons = async (req, res) => {
    const { cart } = req.body;
    try {
        console.log('Received cart:', cart);
        // Fetch only unexpired coupons
        const coupons = await Coupon.find({ expirationDate: { $gte: new Date() } });  
        console.log('Fetched Coupons:', coupons);

        // Filter coupons that are applicable and map them to include specific details
        const applicableCoupons = coupons.filter(coupon => {
            return checkCouponCondition(coupon, cart);
        }).map(coupon => {
            return {
                couponId: coupon._id,
                couponType: coupon.type,
                discount: calculateDiscount(coupon.details, cart) // Calculate the discount based on the coupon type
            };
        });

        console.log('Applicable Coupons:', applicableCoupons);
        res.status(200).json({ applicableCoupons });
    } catch (error) {
        console.error('Error fetching applicable coupons:', error);
        res.status(500).json({ message: 'Error fetching applicable coupons', error: error.message });
    }
};

function checkCouponCondition(coupon, cart) {
    switch (coupon.type) {
        case 'product-wise':
            // Check if applicableProducts array is defined and contains the productType
            if (coupon.details.applicableProducts && Array.isArray(coupon.details.applicableProducts)) {
                return cart.items.some(item =>
                    coupon.details.applicableProducts.includes(cart.items[0].productType)
 &&
                    (item.quantity >= (coupon.details.minQuantity || 1))
                ) && (
                    !coupon.details.applicablePlaces || // Safely handle undefined applicablePlaces
                    (cart.places && coupon.details.applicablePlaces.includes(cart.places))
                );
            }
            break;
        default:
            return false;
    }
    return false;
}






function calculateDiscount(details, cart) {
    switch(details.type) {
        case 'percentage':
            return Math.min((cart.total * details.percent) / 100, details.maxDiscount || Infinity);
        case 'flat':
            return (cart.total >= details.threshold) ? details.flatDiscount : 0;
        default:
            console.warn(`Unsupported discount type: ${details.type}`);
            return 0;  // Default no discount if type is not supported
    }
}



module.exports = {
    createCoupon,
    applyCoupon,
    getCouponById,
    updateCouponById,
    deleteCouponById,
    getApplicableCoupons
};
