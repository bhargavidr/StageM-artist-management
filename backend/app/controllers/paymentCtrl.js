const stripe = require("stripe")(process.env.STRIPE_SECRET)
const User = require('../models/user')
const _ = require('lodash')

const paymentCtrl = {}

paymentCtrl.checkout = async(req,res) => {
    const user = req.body
    try{
        const price = await stripe.prices.create({
            unit_amount: 110000,
            currency: 'inr',
            recurring: {interval: 'year'},
            product_data: { name: user.name }
        });
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price: price.id,
                quantity: 1
            }],
            mode: "subscription",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/fail"
        });
    res.json({id:session.id, url: session.url})
    } catch(e){
        console.log(e)
    }

}

paymentCtrl.updateUser = async (req,res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { isPremium: true }, {new:true} );
        const data = _.pick(user, ['_id', 'email', 'role','isPremium'])
        res.status(201).json({message:'Account updated successfully', data})
    }catch (e) {
        console.log(e)
    }
}

module.exports = paymentCtrl 