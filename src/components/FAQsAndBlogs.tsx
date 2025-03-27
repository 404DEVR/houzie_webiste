import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const faqs = [
  {
    question: 'Who can use Houzie?',
    answer: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  },
  {
    question: 'What is Houzie?',
    answer:
      'Houzie is a property listing and selling platform that connects property owners, buyers, renters, and real estate agents. Users can list properties for sale or rent, search for available properties, and communicate directly through the platform.',
  },
  {
    question: 'Is Houzie free to use?',
    answer: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  },
  {
    question: 'How do I create an account?',
    answer: 'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  },
];

const blogPosts = [
  {
    title:
      'Real Estate 2025: Top 5 Game-Changing Trends Transforming the Indian Market',
    description:
      "In the Indian real estate sector, 2025 will be a year of change supported by rapid technological advances, shifts in consumer preferences, and evolving policies. Whether you're a homebuyer or investor, staying ahead of these trends can help you make informed decisions and capitalize on emerging opportunities.Real Estate in 2025: Top 5 Game-Changing Trends You Shouldn’t Miss",
    longDescription: `
    <h3>1. The Rise of AI and PropTech in Real Estate</h3>
    <p>Artificial Intelligence and PropTech are revolutionizing the real estate sector by enhancing efficiency, transparency, and customer experiences.</p>
    <p><strong>How AI & PropTech Are Changing the Game:</strong></p>
    <ul>
      <li><strong>Virtual Property Tours & AR/VR Integration</strong> – Buyers can explore properties online with immersive 360-degree views.</li>
      <li><strong>AI-Powered Property Valuation</strong> – Machine learning evaluates market trends, price performance, and demand-supply relationships.</li>
      <li><strong>Smart Chatbots & CRM Systems</strong> – AI-powered tools handle customer queries, schedule meetings, and improve response times.</li>
      <li><strong>Blockchain for Secure Transactions</strong> – Smart contracts enhance transparency and reduce fraud risks.</li>
    </ul>

    <h3>2. Sustainable and Eco-Friendly Housing Is the Future</h3>
    <p>Sustainability is now a necessity as homebuyers prioritize environmentally friendly housing solutions.</p>
    <p><strong>Key Sustainable Housing Trends:</strong></p>
    <ul>
      <li><strong>Solar-Powered Homes</strong> – Developers are increasingly investing in solar energy solutions.</li>
      <li><strong>Rainwater Harvesting & Water Recycling</strong> – Water conservation techniques are becoming standard in modern developments.</li>
      <li><strong>Eco-Friendly Building Materials</strong> – Sustainable materials like bamboo and recycled wood are gaining popularity.</li>
      <li><strong>Waste Management & Green Spaces</strong> – Smart waste disposal and urban green zones are integral to new projects.</li>
    </ul>

    <h3>3. Smart Homes and AI-Integrated Living Spaces</h3>
    <p>Tech-enabled homes offering security, convenience, and energy efficiency are in high demand.</p>
    <p><strong>Smart Home Features:</strong></p>
    <ul>
      <li><strong>Home Automation Systems</strong> – AI-powered lighting, voice-controlled assistants, and smart appliances.</li>
      <li><strong>Secure Remote Access</strong> – Facial recognition entry, smart locks, and real-time surveillance.</li>
      <li><strong>Smart Devices for Energy Efficiency</strong> – IoT-enabled appliances optimize energy consumption.</li>
    </ul>

    <h3>4. The Rise of Co-Living and Co-Working Spaces</h3>
    <p>Shared spaces are gaining traction, offering affordability and flexibility.</p>
    <p><strong>Why Co-Living & Co-Working Are Thriving:</strong></p>
    <ul>
      <li><strong>Co-Living Spaces</strong> – Affordable housing solutions for millennials and professionals in metro cities.</li>
      <li><strong>Hybrid Work Culture</strong> – Companies are shifting towards flexible shared office environments.</li>
      <li><strong>Student Housing Boom</strong> – Demand for quality-controlled student accommodations is on the rise.</li>
    </ul>

    <h3>5. Trustworthy Houzie, Your Real Estate Partner for 2025</h3>
    <p>As the Indian real estate market evolves, expert guidance is essential for buyers, sellers, and investors.</p>
    <p>Houzie is a trusted real estate agency in Gurgaon, offering premium property deals, tech-driven insights, and customer-focused services to help you navigate this transforming landscape.</p>
  `,
    image: '/images/Frame 165.png',
  },

  {
    title:
      'Properties in Gurgaon: 2025 Key Market Trends, Growth, and Investment Insights',
    subtitle:
      'Gurgaon Real Estate Forecast 2025: Emerging Trends Every Buyer Must Know',
    description:
      'Gurgaon remains one of the top real estate destinations with a mix of luxury and affordable housing. With its proximity to Delhi and a booming corporate sector, Gurgaon continues to attract investors and home buyers alike. 2025 brings new trends driven by government initiatives and technological advancements in the real estate market.',

    longDescription: `
    <h3>1. Growing Demand for High-end Homes and Luxury Homes</h3>
    <p>Gurgaon has become a hotspot for luxury real estate, especially for high-net-worth individuals (HNWIs) and corporate professionals seeking premium residences in prime locations such as Golf Course Road, Cyber City, and DLF Phase 1-5. This trend is expected to accelerate in 2025.</p>
    <ul>
      <li>Increased disposable income among professionals and millennials driving demand for high-end lifestyle amenities.</li>
      <li>NRIs investing heavily in premium properties for rental and personal use.</li>
      <li>Smart homes with AI-driven security, automated lighting, and energy-efficient features are becoming the standard.</li>
    </ul>
    
    <h3>2. The Affordable or Mid-Segment Housing is Making Waves</h3>
    <p>While luxury housing dominates in some pockets, affordable and mid-range housing is growing rapidly. Areas like Sohna Road, New Gurgaon, and Dwarka Expressway are seeing a surge in demand due to an increasing working-class population.</p>
    <ul>
      <li>New affordable residential projects are launching frequently.</li>
      <li>Attractive home loan offers are making property ownership easier.</li>
      <li>Improved infrastructure and connectivity are boosting growth.</li>
    </ul>

    <h3>3. Growth of Commercial Real Estate & Office Spaces</h3>
    <p>The corporate expansion in Gurgaon continues to drive commercial real estate demand. IT parks, coworking spaces, and retail developments position Gurgaon as India's preferred business hub in 2025.</p>
    <ul>
      <li>Coworking spaces are rising as startups and MNCs seek flexible office solutions.</li>
      <li>Retail expansion in high-traffic areas, including malls and premium shopping centers.</li>
      <li>Grade A office spaces with cutting-edge technology and sustainability features are in demand.</li>
    </ul>

    <h3>4. Smart Homes & Sustainable Living Take Center Stage</h3>
    <p>Buyers in Gurgaon are increasingly looking for eco-friendly, technology-driven homes that integrate sustainability and energy efficiency seamlessly.</p>

    <h3>5. Key Investment Spots in Gurgaon for 2025</h3>
    <p>Certain areas in Gurgaon are expected to be prime investment locations with high returns:</p>
    <ul>
      <li>Golf Course Extension Road</li>
      <li>Dwarka Expressway</li>
      <li>Sohna Road & Southern Peripheral Road</li>
    </ul>

    <h3>Government Policies & Future Outlook</h3>
    <p>Government real estate reforms, pro-business policies, and infrastructure development continue to drive Gurgaon's market, making it one of India's best investment destinations.</p>

    <h3>Why Choose Houzie as Your Real Estate Partner?</h3>
    <p>Navigating the real estate market can be complex, but Houzie simplifies the process. Whether you’re buying, selling, or renting, we offer:</p>
    <ul>
      <li>Expert consultancy with deep market insights.</li>
      <li>Verified listings to ensure security and transparency.</li>
      <li>Competitive pricing for both residential and commercial properties.</li>
    </ul>
    <p>Contact us today to make the best real estate decisions in Gurgaon!</p>
  `,
    image: '/images/Frame 84.png',
  },
  {
    title: 'Real Estate in Gurgaon: Key Investment Insights',
    description:
      'Gurgaon offers a mix of luxury and affordable housing options, making it an attractive investment destination.',
    longDescription: `
      <p>Gurgaon's proximity to Delhi and its thriving corporate sector make it a hub for real estate investments.</p>
      <p>Government policies and infrastructure development support the growth of the real estate market in Gurgaon.</p>
    `,
    image: '/images/home.png',
  },
];

export default function FAQsAndBlogs() {
  const [activeSection, setActiveSection] = useState<'faqs' | 'blogs' | null>(
    null
  );
  const [openFAQ, setOpenFAQ] = useState<number | null>(1);
  const [activeBlog, setActiveBlog] = useState(0);

  return (
    <div className='max-w-6xl mx-auto px-4 py-8 md:py-16'>
      <div className='flex gap-4 justify-center'>
        <button
          onClick={() => setActiveSection('faqs')}
          className={`transition-all duration-500 ease-in-out flex items-center gap-2 bg-[#3B8FF6] text-white px-6 py-2 rounded-md hover:bg-[#c6d9fa] ${
            activeSection === 'faqs' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          FAQ's <ChevronDown />
        </button>
        <button
          onClick={() => setActiveSection('blogs')}
          className={`transition-all duration-500 ease-in-out flex items-center gap-2 bg-[#3B8FF6] text-white px-6 py-2 rounded-md hover:bg-[#c6d9fa] ${
            activeSection === 'blogs' ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Blogs <ChevronDown />
        </button>
      </div>

      {/* FAQs Section */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          activeSection === 'faqs'
            ? 'opacity-100 h-auto mt-8'
            : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h2 className='text-2xl font-bold mb-2'>
              Frequently Asked Questions
            </h2>
            <p className='text-gray-600'>
              Find answers to frequently asked questions about our services and
              platform.
            </p>
          </div>
          <button
            onClick={() => setActiveSection(null)}
            className='bg-[#3B8FF6] text-white px-6 py-2 rounded-md flex items-center gap-2'
          >
            FAQ's <ChevronUp />
          </button>
        </div>

        <div className='space-y-4'>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-lg transition-colors duration-300 ${
                openFAQ === index ? 'bg-[#DBE8FE]' : 'bg-gray-50'
              }`}
            >
              <button
                className='w-full px-6 py-4 flex justify-between items-center'
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <span className='font-medium'>{faq.question}</span>
                {openFAQ === index ? (
                  <X className='w-5 h-5 text-[#3B8FF6]' />
                ) : (
                  <Plus className='w-5 h-5' />
                )}
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openFAQ === index ? 'max-h-40' : 'max-h-0'
                } overflow-hidden`}
              >
                <div className='px-6 pb-4'>
                  <p className='text-gray-600'>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blogs Section */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          activeSection === 'blogs'
            ? 'opacity-100 h-auto mt-8'
            : 'opacity-0 h-0 overflow-hidden'
        }`}
      >
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h2 className='text-2xl font-bold mb-2'>Blogs</h2>
            <p className='text-gray-600'>
              Explore insightful articles and updates on real estate trends,
              market insights, and industry news.
            </p>
          </div>
          <button
            onClick={() => setActiveSection(null)}
            className='bg-[#3B8FF6] text-white px-6 py-2 rounded-md flex items-center gap-2'
          >
            Blogs <ChevronUp />
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='md:col-span-2'>
            <div className='relative h-[400px] mb-4'>
              <Image
                src={blogPosts[activeBlog].image}
                alt={blogPosts[activeBlog].title}
                fill
                className='object-cover rounded-lg'
              />
            </div>
            <h3 className='text-2xl font-bold mb-4'>
              {blogPosts[activeBlog].title}
            </h3>
            <div className='space-y-4 text-gray-600'>
              <p>{blogPosts[activeBlog].description}</p>
              <div
                dangerouslySetInnerHTML={{
                  __html: blogPosts[activeBlog].longDescription,
                }}
              />
            </div>
          </div>

          <div className='space-y-4'>
            {blogPosts.map((post, index) => (
              <div key={index} className='flex gap-4'>
                <div className='relative w-24 h-24 flex-shrink-0'>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className='object-cover rounded-lg'
                  />
                </div>
                <div>
                  <h4
                    className={`font-medium mb-1 cursor-pointer ${
                      activeBlog === index ? 'text-[#3B8FF6]' : ''
                    }`}
                    onClick={() => setActiveBlog(index)}
                  >
                    {post.title}
                  </h4>
                  <p className='text-sm text-gray-600 line-clamp-4'>
                    {post.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
