# COUPONS_API
Implemented Cases
1. Cart-Wise Coupons
A) 40% off up to ₹80 (Valid till 09 September 2024)

Condition: The discount is 40%, but the maximum discount amount is capped at ₹80.
Expiration Date: Valid for 3 days (09 September 2024).
Coupon Code: ONLY4U

Details:
json
Copy code
{
  "code": "ONLY4U",
  "type": "cart-wise",
  "details": {
    "discount": 40,
    "maxDiscount": 80
  },
  "expirationDate": "2024-09-09"
}
B) Flat ₹150 off on orders above ₹700 (Valid till 09 September 2024)

Condition: Cart total must be at least ₹700 to avail the discount.
Expiration Date: Valid for 3 days (09 September 2024).
Coupon Code: FLAT150

Details:
json
Copy code
{
  "code": "FLAT150",
  "type": "cart-wise",
  "details": {
    "threshold": 700,
    "flatDiscount": 150
  },
  "expirationDate": "2024-09-09"
}
2. Payment Coupons
Cashback up to ₹100 using Paytm UPI (Valid till 09 September 2024)

Condition: Cashback is provided on payment via Paytm UPI.
Expiration Date: Valid for 3 days (09 September 2024).
Coupon Code: PAYTMUPI

Details:
json
Copy code
{
  "code": "PAYTMUPI",
  "type": "payment",
  "details": {
    "cashback": 100,
    "maxCashback": 100
  },
  "expirationDate": "2024-09-09"
}
Unimplemented Cases
Combination Coupons: Coupons cannot be stacked or combined for extra discounts.
Advanced Validation: Specific item-based validation is not yet implemented.
Limitations
Coupons are applicable only once per cart.
Expiration dates are hardcoded; future improvements can make expiration more dynamic.
Bonus Features
Expiration Dates: Implemented with a 3-day validity window for Diwali offers.
Unit Tests: Coming soon.
