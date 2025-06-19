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
            amount: Math.round(totalAmount * 100),
            currency: 'lkr',
            metadata: {
            id: id,
            userId: user_id
            },
            automatic_payment_methods: {
            enabled: true,
            },
        });res.json({
            clientSecret: paymentIntent.client_secret,
            amount: totalAmount,
            foodBucket: {
                id: foodBucket.id,
                user_id: foodBucket.user_id,
                restaurant_id: foodBucket.restaurant_id,
                total_price: totalAmount,
                status: foodBucket.status,
                createdAt: foodBucket.createdAt,
                products: foodBucket.products.map(product => ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    price: parseFloat(product.price),
                    image: product.image,
                    category: product.category,
                    quantity: product.food_bucket_product.quantity,
                    subtotal: parseFloat(product.price) * product.food_bucket_product.quantity
                }))
            }
        });
    } catch (error) {
        console.error('Payment Intent error:', error);
        res.status(500).json({ error: 'Failed to create Payment Intent' });
    }
};