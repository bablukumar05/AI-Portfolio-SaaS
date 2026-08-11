const Stripe = require("stripe");
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

if (!stripe) {
    console.warn("WARNING: STRIPE_SECRET_KEY is not defined. Stripe features will be disabled.");
}


exports.createCheckoutSession = async (userId, priceId) => {
    if (!stripe) throw new Error("Stripe is not configured");
    return await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing`,
        client_reference_id: userId,
        subscription_data: {
            metadata: { userId }
        }
    });
};

exports.createPortalSession = async (customerId) => {
    if (!stripe) throw new Error("Stripe is not configured");
    return await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/billing`,
    });
};

exports.handleWebhook = async (event) => {
    const session = event.data.object;
    switch (event.type) {
        case "checkout.session.completed":
            // Update user subscription
            break;
        case "customer.subscription.deleted":
            // Downgrade user
            break;
    }
};
