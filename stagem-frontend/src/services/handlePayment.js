import {loadStripe} from '@stripe/stripe-js/pure';
import axios from '../config/axios';

export const handlePayment = async(body) => {

    try{
        const stripe = await loadStripe(process.env.REACT_APP_STRIPE);

        const response = await axios.post('/create-checkout-session', body,  {
          headers: {
              Authorization: localStorage.getItem('token')
          }
        })

        localStorage.setItem('stripeId', response.data.id)
        window.location = response.data.url

    }catch(e){
      console.log(e)
    }
    
}