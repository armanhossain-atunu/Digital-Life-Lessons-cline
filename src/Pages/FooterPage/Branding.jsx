import React from "react";
import Container from "../../Components/Shared/Container";

const BrandingServices = () => {
  return (
    <section className="bg-base-50 dark:bg-gray-900 text-base-900 dark:text-gray-200 py-16">
      <Container>

        {/* Hero Section */}
        <div className="text-center my-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-[#875DF8]">
            Branding Services
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl">
            Elevate your digital presence with powerful branding strategies, tailored visuals, and impactful messaging.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-10 mb-16">
          
          {/* Service 1 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 dark:text-[#875DF8]">Logo & Identity</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Crafting unique logos and brand identity systems that make your digital presence unforgettable.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 dark:text-[#875DF8]">Visual Branding</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Designing color schemes, typography, and graphics that reflect your brand personality and values.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 dark:text-[#875DF8]">Brand Strategy</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Building a strong branding strategy that resonates with your audience and drives engagement.
            </p>
          </div>

        </div>

        {/* Benefits Section */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-6 dark:text-[#875DF8]">Why Choose Us?</h2>
          <ul className="grid md:grid-cols-3 gap-6 text-gray-700 dark:text-gray-300">
            <li className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2 dark:text-[#875DF8]">Creative Excellence</h4>
              <p>Innovative design and strategy that stands out in the digital space.</p>
            </li>
            <li className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2 dark:text-[#875DF8]">Consistency</h4>
              <p>Ensuring your brand looks and feels cohesive across all platforms.</p>
            </li>
            <li className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2 dark:text-[#875DF8]">Expert Guidance</h4>
              <p>Professional support to grow your brand with proven strategies.</p>
            </li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 dark:text-[#875DF8]">Ready to Elevate Your Brand?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Let's work together to build a digital identity that truly represents you.
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#875DF8] hover:bg-[#6a45d9] text-white px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            Get Started
          </a>
        </div>

      </Container>
    </section>
  );
};

export default BrandingServices;
