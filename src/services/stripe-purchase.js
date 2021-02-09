import { loadStripe } from '@stripe/stripe-js'

const BASE_URL = process.env.GATSBY_BASE_URL;

let stripePromise;
const getStripe = (key) => {
  if (!stripePromise) {
    stripePromise = loadStripe(key)
  }
  return stripePromise
}

export const handleFormSubmission = (priceId) => {
  return  async (event) => {
    console.log("handling purchase");
    event.preventDefault();
    // const form = new FormData(event.target);
  
    const data = {
      // sku: form.get('sku'),
      // quantity: Number(form.get('quantity')),
      quantity: 1,
    };
  
    const response = await fetch(`${BASE_URL}/.netlify/functions/create-checkout-session?priceId=${priceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((res) => {
      return res.json();
    }).then(async (response) => {
      
      const stripe = await getStripe(response.publishableKey);
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });
    
      if (error) {
        console.error(error);
      }
    });
  
  }
}
