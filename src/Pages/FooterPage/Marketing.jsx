import React from "react";

// Example campaign images (replace with your own)
const campaignImages = [
  {
    src: "https://promorepublic.com/en/blog/wp-content/uploads/2019/01/The-most-successful-social-media-campaigns.jpg",
    title: "Social Media Campaign",
    description: "Boosted engagement and reach with a creative social media campaign."
  },
  {
    src: "https://www.feedough.com/wp-content/uploads/2020/08/what-is-marketing.webp",
    title: "Email Marketing Campaign",
    description: "Designed high-converting email campaigns for client newsletters."
  },
  {
    src: "https://www.techslang.com/wp-content/uploads/2020/08/image-from-rawpixel-id-867720-jpeg-1024x614.jpg",
    title: "SEO Optimization",
    description: "Increased website traffic and search engine rankings through strategic SEO."
  },
];

const MarketingPage = () => {
  return (
    <section className="bg-gray-900 text-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-4">

        {/* Hero Section */}
        <div className="text-center my-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#875DF8] mb-4">
            Marketing Services
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Grow your brand, reach the right audience, and increase conversions with our digital marketing expertise.
          </p>
        </div>

        {/* Services Grid */}
        <div data-aos="fade-left" data-aos-duration="1000" className="grid md:grid-cols-3 gap-10 mb-16">
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-[#875DF8]">Social Media Marketing</h3>
            <p>
              Build brand awareness, grow your audience, and engage customers with creative campaigns.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-[#875DF8]">Email Marketing</h3>
            <p>
              Design email campaigns that drive engagement, nurture leads, and boost conversions.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-[#875DF8]">SEO & Content Marketing</h3>
            <p>
              Optimize your website and create content strategies to attract organic traffic and leads.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-[#875DF8] mb-6">Why Choose Our Marketing Services?</h2>
          <ul data-aos="fade-right" data-aos-duration="1000" className="grid md:grid-cols-3 gap-6 text-gray-900 dark:text-gray-100">
            <li className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2 text-[#875DF8]">Data-Driven Strategy</h4>
              <p className="text-gray-700 dark:text-gray-300">All campaigns are backed by research and analytics for maximum impact.</p>
            </li>
            <li className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2 text-[#875DF8]">Creative Campaigns</h4>
              <p className="text-gray-700 dark:text-gray-300">Innovative marketing ideas that capture attention and build trust.</p>
            </li>
            <li className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow">
              <h4 className="font-semibold mb-2 text-[#875DF8]">Results-Oriented</h4>
              <p className="text-gray-700 dark:text-gray-300">We focus on measurable outcomes to ensure your marketing delivers real results.</p>
            </li>
          </ul>
        </div>

        {/* Campaigns / Case Studies */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#875DF8] text-center mb-8">Recent Campaigns</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {campaignImages.map((campaign, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <img src={campaign.src} alt={campaign.title} data-aos="zoom-in" data-aos-delay={index * 100} className="w-full h-56 object-cover"/>
                <div className="p-4">
                  <h3 className="font-semibold text-[#875DF8] mb-2">{campaign.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{campaign.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#875DF8] mb-4">Ready to Grow Your Brand?</h2>
          <p className="text-gray-300 mb-6">
            Let's create marketing strategies that drive results and take your brand to the next level.
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

export default MarketingPage;
