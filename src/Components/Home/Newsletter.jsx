import { useState } from "react";
import emailjs from "emailjs-com";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      user_email: email,
    };

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_ID
      )
      .then(
        () => {
          toast.success("Successfully subscribed!");
          setEmail("");
        },
        () => {
          toast.error("Subscription failed. Try again!");
        }
      );
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-gray-900 mt-5 dark:to-gray-800 py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto text-center text-white dark:text-gray-100">

        <h2 className="text-3xl md:text-4xl font-bold">Subscribe to Our Newsletter</h2>

        <p className="mt-3 text-white/80 dark:text-gray-300">
          Stay updated with the latest news and exclusive offers.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full md:w-2/3 px-5 py-3 rounded-xl border
                      text-base-800 focus:ring-2 focus:ring-indigo-300 outline-none
                      dark:bg-gray-700 dark:text-gray-100
                      dark:placeholder-gray-400 dark:focus:ring-gray-500"
          />

          <button
            type="submit"
            className="bg-base-100 text-indigo-600 font-semibold px-6 py-3 rounded-xl 
                      hover:bg-gray-200 transition 
                      dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
          >
            Subscribe
          </button>
        </form>

      </div>
    </div>
  );
};

export default Newsletter;
