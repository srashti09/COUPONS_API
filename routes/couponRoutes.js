const express = require('express');
const {
    createCoupon,
    applyCoupon,
    getCouponById,
    updateCouponById,
    getApplicableCoupons,
    deleteCouponById
} = require('../controllers/couponController');
const router = express.Router();

// Route to create a coupon
router.post('/', createCoupon);

// Route to apply a coupon by its code
router.post('/apply-coupon/:code', applyCoupon);


// Route to get a coupon by its ID
router.get('/:id', getCouponById);

// Route to update a coupon by its ID
router.put('/:id', updateCouponById);

router.post('/applicable-coupons', getApplicableCoupons);


// Route to delete a coupon by its ID
router.delete('/:id', deleteCouponById);

module.exports = router;
