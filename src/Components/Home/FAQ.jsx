import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Container from "../Shared/Container";

const FAQWithImage = () => {
    const faqs = [
        {
            question: "What services do you provide?",
            answer:
                "We offer modern web development, UI/UX design, and full-stack solutions.",
        },
        {
            question: "How fast is your delivery?",
            answer:
                "Most small-to-medium projects are delivered within 1–2 weeks.",
        },
        {
            question: "Do you offer support after project completion?",
            answer:
                "Yes, we provide ongoing support and maintenance based on your needs.",
        },
        {
            question: "Can I request custom features?",
            answer:
                "Absolutely! We build fully customized solutions based on your requirements.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <Container>

            {/* LEFT: FAQ Section */}
            <h2 className=" text-center text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-5 items-center">


                <div className="space-y-4">
                    {faqs.map((item, index) => (
                        <div
                            key={index}
                            className="border rounded-xl p-4 bg-base-100 shadow-sm cursor-pointer"
                            onClick={() => toggleFAQ(index)}
                            data-aos="fade-up"
                            data-aos-duration="1000"
                            data-aos-anchor-placement="center-center"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">{item.question}</h3>
                                <ChevronDown
                                    className={`transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </div>

                            {openIndex === index && (
                                <p className="mt-2 text-base-600">{item.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
                {/* RIGHT: Image Section */}
                <div className="flex justify-center" data-aos="fade-up">
                    <img
                        src="https://i.ibb.co.com/mC34RKNM/faq.webp"
                        alt="FAQ Illustration"
                        className="w-full max-w-md"
                    />
                </div>
            </div>


        </Container>
    );
};

export default FAQWithImage;
