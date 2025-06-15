const Stripe = require('stripe');
const { FoodBucket, Product } = require('../models/AuthModel');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    try {
        const { user_id, id } = req.body;
        const foodBucket = await FoodBucket.findOne({
            where: { user_id: user_id, id: id, status: 1 },
            include: [
                {
                    model: Product,
                    as: 'products',
                    through: { attributes: ['quantity'] }
                }
            ]
        });

        if (!foodBucket) {
            return res.status(404).json({ error: 'Food bucket not found' });
        }

        // Calculate total amount
        const totalAmount = foodBucket.products.reduce((sum, product) => {
            return sum + (parseFloat(product.price) * product.food_bucket_product.quantity);
        }, 0);

        // Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // Convert to cents
            currency: 'lkr',
            metadata: {
                foodBucketId: foodBucket.id,
                userId: foodBucket.user_id
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            amount: totalAmount
        });
    } catch (error) {
        console.error('Payment Intent error:', error);
        res.status(500).json({ error: 'Failed to create Payment Intent' });
    }
};