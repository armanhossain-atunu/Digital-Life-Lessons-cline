import React from "react";

const DesignServices = () => {
  return (
    <section className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">

        {/* Hero Section */}
        <div className="text-center my-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#875DF8] dark:text-[#875DF8] mb-4">
            Design Services
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl">
            Transform your digital presence with stunning, user-centered designs that engage and convert.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-16">
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-[#875DF8]">UI/UX Design</h3>
            <p>
              Crafting seamless user experiences and intuitive interfaces that delight your audience.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-[#875DF8]">Web Design</h3>
            <p>
              Building modern, responsive websites with visually appealing layouts that reflect your brand.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-[#875DF8]">Graphic Design</h3>
            <p>
              Designing engaging visuals, banners, and graphics to make your digital content stand out.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-[#875DF8] mb-6">Why Choose Our Design Services?</h2>
          <ul className="grid md:grid-cols-3 gap-6 text-gray-900 dark:text-gray-100">
            <li className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2 text-[#875DF8]">User-Centered Design</h4>
              <p className="text-gray-700 dark:text-gray-300">Every design is created with your users in mind for maximum engagement.</p>
            </li>
            <li className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2 text-[#875DF8]">Creative Excellence</h4>
              <p className="text-gray-700 dark:text-gray-300">Visually stunning designs that align with your brand identity.</p>
            </li>
            <li className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2 text-[#875DF8]">Responsive & Modern</h4>
              <p className="text-gray-700 dark:text-gray-300">Designs that work flawlessly across devices and platforms.</p>
            </li>
          </ul>
        </div>

        {/* Portfolio / Case Studies */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#875DF8] text-center mb-8">Our Recent Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <img src="https://via.placeholder.com/400x250" alt="Project 1" className="w-full"/>
              <div className="p-4">
                <h3 className="font-semibold text-[#875DF8] mb-2">Project One</h3>
                <p className="text-gray-700 dark:text-gray-300">A sleek, responsive web design for a modern brand.</p>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <img src="https://via.placeholder.com/400x250" alt="Project 2" className="w-full"/>
              <div className="p-4">
                <h3 className="font-semibold text-[#875DF8] mb-2">Project Two</h3>
                <p className="text-gray-700 dark:text-gray-300">Engaging graphic design for digital marketing campaigns.</p>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <img src="https://via.placeholder.com/400x250" alt="Project 3" className="w-full"/>
              <div className="p-4">
                <h3 className="font-semibold text-[#875DF8] mb-2">Project Three</h3>
                <p className="text-gray-700 dark:text-gray-300">User-friendly interface design for a web application.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#875DF8] mb-4">Ready to Transform Your Designs?</h2>
          <p className="text-gray-300 mb-6">
            Let’s create designs that truly reflect your brand and captivate your audience.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#875DF8] hover:bg-[#6a45d9] text-white px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            Get Started
          </a>
        </div>

      </div>
    </section>
  );
};

export default DesignServices;
