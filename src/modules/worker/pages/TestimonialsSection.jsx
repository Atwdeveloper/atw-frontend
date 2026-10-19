import React from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaBolt,
  FaShieldAlt,
  FaMobileAlt,
  FaBuilding,
} from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Machine Operator",
    location: "Jaipur",
    duration: "6 months with ATW",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    review:
      "मैं पिछले 6 महीनों से इस प्लेटफॉर्म से जुड़ा हूँ। सबसे अच्छी बात यह है कि काम खत्म होते ही हर दिन पेमेंट मिल जाती है।",
  },
  {
    id: 2,
    name: "Sunita Devi",
    role: "Textile Worker",
    location: "Surat",
    duration: "4 months with ATW",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
    review:
      "इस ऐप पर तुरंत काम मिलना बहुत आसान है। मुझे कई बार जाकर काम ढूंढने की जरूरत नहीं पड़ी।",
  },
  {
    id: 3,
    name: "Mahesh Yadav",
    role: "Security Guard",
    location: "Rajkot",
    duration: "8 months with ATW",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
    review:
      "भारतभर में यह प्लेटफॉर्म केवल रोजगार नहीं दिलाता बल्कि भरोसे का दूसरा नाम बन चुका है।",
  },
];

const highlights = [
  {
    icon: <FaBolt />,
    title: "समय पर पैसा",
    subtitle: '"हाथ का हाथ कमाई"',
    border: "border-green-200",
  },
  {
    icon: <FaShieldAlt />,
    title: "भरोसा",
    subtitle: '"काम और सुरक्षा का वादा"',
    border: "border-blue-200",
  },
  {
    icon: <FaMobileAlt />,
    title: "आज़ादी",
    subtitle: '"जब चाहो, तब काम पाओ"',
    border: "border-purple-200",
  },
  {
    icon: <FaBuilding />,
    title: "पक्की नौकरी",
    subtitle: '"ईमानदारी = काम की गारंटी"',
    border: "border-yellow-200",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="bg-white py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300 bg-yellow-50 px-5 py-2 text-sm font-semibold text-yellow-700">
            ⭐ WORKER TESTIMONIALS
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 md:text-5xl">
            हमारे कारीगरों की आवाज़
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600 text-base md:text-lg">
            Real feedback from real workers using ATW daily across Rajasthan and
            Gujarat.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative rounded-3xl border border-gray-200 bg-white p-7 shadow-lg transition-all duration-300"
            >
              {/* Avatar */}
              <div className="absolute -top-6 left-7">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 rounded-full border-4 border-white object-cover shadow-md"
                />
              </div>

              <div className="pt-10">
                {/* Stars */}
                <div className="mb-5 flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="mr-1" />
                  ))}
                </div>

                <p className="mb-8 text-sm leading-7 text-gray-600">
                  "{item.review}"
                </p>

                <div className="border-t border-gray-200 pt-5">
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-emerald-600 font-medium">
                    {item.role} • {item.location}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">{item.duration}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Highlights */}
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.03,
                y: -5,
              }}
              className={`rounded-2xl border ${item.border} bg-white p-6 text-center shadow-sm`}
            >
              <div className="mb-3 flex justify-center text-2xl text-yellow-500">
                {item.icon}
              </div>

              <h4 className="font-semibold text-gray-900">{item.title}</h4>

              <p className="mt-2 text-sm text-gray-500">{item.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
