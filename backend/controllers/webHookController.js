const { FoodBucket } = require('../models/AuthModel');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.stripeWebhook = async (req, res) => {
  console.log('Received Stripe webhook event');
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  console.log('Webhook event type:', event.type);
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const foodBucketId = paymentIntent.metadata?.id;
    const userId = paymentIntent.metadata?.userId;
    if (foodBucketId && userId) {
      try {
        await FoodBucket.update(
          { status: 0 },
          { where: { id: foodBucketId, user_id: userId } }
        );
        console.log(`FoodBucket ${foodBucketId} for user ${userId} marked as completed.`);
      } catch (dbErr) {
        console.error('Failed to update FoodBucket status:', dbErr);
      }
    }
  }

  res.json({ received: true });
};