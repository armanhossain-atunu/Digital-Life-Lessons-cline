import React, { useRef, useState } from "react";
import emailjs from "emailjs-com";
import Container from "../../Components/Shared/Container";
import toast from "react-hot-toast";

const Contact = () => {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault(); // Prevent reload
        setLoading(true);

        emailjs
            .sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                formRef.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_ID
            )
            .then(
                () => {
                    toast.success("Message sent successfully! 🎉");
                    formRef.current.reset();
                    setLoading(false);
                },
                () => {
                    toast.error("❌ Something went wrong. Please try again.");
                    setLoading(false);
                }
            );
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 pt-15 transition duration-300">
            <header className="py-10 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <h1 className="text-3xl md:text-4xl font-bold">Contact Us</h1>
                <p className="mt-2 text-lg">We are here to help you anytime</p>
            </header>

            <Container className="min-h-screen pt-10">
                <div className=" grid md:grid-cols-2 gap-10 mt-8">

                    {/* Contact Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                            Contact Information
                        </h2>
                        <div className="mt-4 space-y-4 text-gray-700 dark:text-gray-300">
                            <p><strong>Address:</strong> Dhaka, Bangladesh</p>
                            <p><strong>Email:</strong> support@example.com</p>
                            <p><strong>Phone:</strong> +880 1234-567890</p>
                            <p><strong>Working Hours:</strong> Sun–Thu (10 AM – 7 PM)</p>
                        </div>
                    </div>
                    {/* Contact Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                            Send a Message
                        </h2>
                        <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">
                                    Your Name
                                </label>
                                <input
                                    name="user_name"
                                    type="text"
                                    required
                                    className="w-full mt-1 p-3 border rounded-lg dark:border-gray-700 
                                    dark:bg-gray-900 dark:text-white"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">
                                    Email Address
                                </label>
                                <input
                                    name="user_email"
                                    type="email"
                                    required
                                    className="w-full mt-1 p-3 border rounded-lg dark:border-gray-700 
                                    dark:bg-gray-900 dark:text-white"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="font-medium text-gray-700 dark:text-gray-300">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    required
                                    className="w-full mt-1 p-3 border rounded-lg dark:border-gray-700 
                                    dark:bg-gray-900 dark:text-white"
                                    placeholder="Write your message..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium 
                                hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
                {/* Map */}
                <div className="mt-10">
                    <iframe
                        title="map"
                        className="w-full h-72 border-0 rounded-lg"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.12345!2d90.412345!3d23.810123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c12345abcd%3A0x1234abcd5678ef!2sDhaka%2C+Bangladesh!5e0!3m2!1sen!2sbd!4v1699999999999!5m2!1sen!2sbd"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </Container>
        </div>
    );
};

export default Contact;
