const STRIPE_SECRET_KEY_TEST = "sk_test"
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || STRIPE_SECRET_KEY_TEST;
const stripe = require('stripe')(STRIPE_SECRET_KEY);

const STRIPE_PUBLIC_KEY_TEST = "pk_test"
const STRIPE_PUBLIC_KEY = process.env.STRIPE_PUBLIC_KEY || STRIPE_PUBLIC_KEY_TEST;

const URL = "http://localhost:8000";
const domainURL = process.env.URL || URL;

exports.handler = async function(event, context) {

  if (event.httpMethod !== 'POST') {
    // To enable CORS
    return {
      statusCode: 200, // <-- Important!
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      body: 'CORS ok',
    };
 }
  
  // Create new Checkout Session for the order
  const session = await stripe.checkout.sessions.create({
    payment_method_types: (process.env.PAYMENT_METHODS || "card").split(', '),
    mode: 'subscription',
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['FR'],
    },
    line_items: [
      {
        price: event.queryStringParameters.priceId,
        quantity: 1
      },
    ],
    success_url: `${domainURL}/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainURL}/`,
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    },
    body: JSON.stringify({ sessionId: session.id, publishableKey: STRIPE_PUBLIC_KEY}),
  };
};
