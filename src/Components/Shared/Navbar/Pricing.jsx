import toast from "react-hot-toast";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";


const Pricing = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure()

  const handleUpgrade = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    const paymentInfo = {
      name: "Premium Plan",
      price: 20,
      quantity: 1,
      customer: {
        email: user.email,
        name: user.displayName,
      },
    };

    try {
      const { data } = await axiosSecure.post(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        paymentInfo
      );

      // redirect to Stripe
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error("Payment initiation failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 mb-10 p-6 border rounded-xl">
      <h2 className="text-2xl font-bold">Premium Plan</h2>
      <p className="my-3">$20 / Lifetime</p>

      <ul className="mb-4 list-disc pl-5 text-sm">
        <li>Unlimited lessons</li>
        <li>Premium content</li>
        <li>No ads</li>
      </ul>

      <button
        onClick={handleUpgrade}
        className="btn btn-primary w-full"
      >
        Upgrade to Premium
      </button>
    </div>
  );
};

export default Pricing;
