import React from 'react';
import StripeCheckout from '../lib/StripeCheckout';
import { storeCreditCard, fetchCreditCard } from '../actions/LessonsActions';
import { BASE_URL } from '../constants/ApiConstants';

const CURRENCY = 'USD';
const STRIPE_PUBLISHABLE = process.env.NODE_ENV === 'production'
   ? 'pk_live_6gQlAo5usMUINliNwfGhoMp7'
   : 'pk_test_rVLBWa4bGoVM3f0RRFAyyWDG';

const PAYMENT_SERVER_URL = BASE_URL;

const onToken = (amount, description, sessionId, dispatch) => token => {
  dispatch(storeCreditCard(token, sessionId));
};


const Checkout = ({ name, description, amount, sessionId, dispatch }) => (
  <StripeCheckout
    name={name}
    description={description}
    amount={amount}
    token={onToken(amount, description, sessionId, dispatch)}
    currency={CURRENCY}
    stripeKey={STRIPE_PUBLISHABLE}
  />
);

export default Checkout;
