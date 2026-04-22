import { useState, useEffect } from "react";
import api from "../services/api";

export default function Billing() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initPayment = async () => {
    setLoading(true);
    try {
      const res = await api.post("/payment/order");
      const order = res.data;

      const options = {
        key: "rzp_test_YourKeyHere", // Would usually come from API config
        amount: order.amount,
        currency: order.currency,
        name: "AI Portfolio Builder",
        description: "Premium Subscription",
        order_id: order.id,
        handler: async (response) => {
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          // Send verification to backend...
        },
        theme: {
          color: "#66fcf1"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Failed to initialize payment. Check your API keys.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10 pt-24 bg-dark-900 border-t border-white/5">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 text-gradient">Upgrade to Pro</h1>
        <p className="text-textMuted mb-12 text-center max-w-xl">Unlock custom domains, remove all branding, and get unlimited AI prompt usage for your portfolio builder.</p>

        <div className="glass-card w-full max-w-sm p-8 flex flex-col border border-primary/30 hover:border-primary transition-all relative overflow-hidden group shadow-[0_0_40px_rgba(102,252,241,0.1)] hover:shadow-[0_0_60px_rgba(102,252,241,0.2)]">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
           <h3 className="text-2xl text-white font-bold mb-2">SaaS Pro</h3>
           <div className="text-primary text-5xl font-heading font-bold mb-6">₹500<span className="text-base text-textMuted font-normal">/mo</span></div>
           <ul className="text-textMuted space-y-4 mb-8 flex-1">
             <li className="flex items-center gap-3">
               <svg className="text-primary w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 
               Custom Domain Linking
             </li>
             <li className="flex items-center gap-3">
               <svg className="text-primary w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 
               Priority 24/7 Support
             </li>
             <li className="flex items-center gap-3">
               <svg className="text-primary w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> 
               Unlimited AI Generator usage
             </li>
           </ul>
           <button 
             onClick={initPayment} 
             disabled={loading}
             className="w-full bg-gradient-to-r from-primary to-secondary text-dark-900 font-bold py-3.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-lg shadow-lg"
           >
             {loading ? 'Processing...' : 'Subscribe Now'}
           </button>
        </div>
      </div>
    </div>
  );
}
