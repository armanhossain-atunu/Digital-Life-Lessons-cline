import { FaBrain, FaBookReader, FaSmile, FaSeedling } from "react-icons/fa";

const WhyLearningMatters = () => {
  const benefits = [
    {
      id: 1,
      icon: <FaBookReader className="text-4xl text-blue-600 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" />,
      title: "Experience Is the Best Teacher",
      desc: "Real-life experiences teach us through success, failure, and challenges."
    },
    {
      id: 2,
      icon: <FaBrain className="text-4xl text-green-600 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" />,
      title: "Improves Decision-Making",
      desc: "Past experiences help us make wiser and more confident decisions."
    },
    {
      id: 3,
      icon: <FaSmile className="text-4xl text-yellow-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" />,
      title: "Boosts Emotional Intelligence",
      desc: "Life moments teach us patience, empathy, and emotional balance."
    },
    {
      id: 4,
      icon: <FaSeedling className="text-4xl text-red-500 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12" />,
      title: "Helps You Grow as a Person",
      desc: "Learning from mistakes makes us stronger and builds self-confidence."
    }
  ];

  return (
    <section className="mb-2 mt-5 bg-base-100">
      <div className="max-w-6xl mx-auto text-center px-4">
        
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-base-800">
          Why Learning From Life Matters
        </h2>
        <p className="text-base-600 mb-12">
          Every life experience teaches us something valuable. Here are four important benefits:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((item) => (
            <div
              key={item.id} data-aos="fade-right"
              className="group bg-base-200 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
            >
              <div className="mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-base-800 mb-2">
                {item.title}
              </h3>
              <p className="text-base-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyLearningMatters;
