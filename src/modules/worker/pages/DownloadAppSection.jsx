import React from "react";
import { motion } from "framer-motion";
import { Smartphone, FileText, DollarSign, Check } from "lucide-react";

export default function DownloadAppSection() {
  const features = [
    {
      icon: Smartphone,
      title: "Face and Biometric Attendance",
      desc: "Mark attendance via app with GPS verification",
    },
    {
      icon: FileText,
      title: "Digital Payslips",
      desc: "Download salary slips and offer letters anytime",
    },
    {
      icon: DollarSign,
      title: "Instant Payouts",
      desc: "UPI transfer directly to your bank account",
    },
  ];

  return (
    <section className="py-20 bg-white px-4 overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900">
            Download the <span className="text-green-600">ATW Worker App</span>
          </h2>

          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Manage your workforce or find jobs — all from your phone.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-6">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <Icon size={24} className="text-green-600" />
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {item.title}
                    </h4>

                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Store Buttons */}
          <div className="flex flex-wrap gap-4 mt-10">
            {/* App Store */}
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <svg
                className="w-8 h-8 text-black"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.22 7.13-.57 1.5-1.31 2.99-2.27 4.08zm-5.85-15.1c.07-1.74 1.48-3.27 3.2-3.4.29 1.96-1.59 3.76-3.2 3.4z" />
              </svg>

              <div>
                <p className="text-[10px] text-gray-500">Download on the</p>
                <p className="font-bold text-black">App Store</p>
              </div>
            </a>

            {/* Google Play */}
            <a
              href="#"
              className="inline-flex items-center gap-3 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <svg
                className="w-8 h-8 text-black"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
              </svg>

              <div>
                <p className="text-[10px] text-gray-500">GET IT ON</p>
                <p className="font-bold text-black">Google Play</p>
              </div>
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 mt-8 text-gray-600">
            <span className="flex items-center gap-2">
              <Check size={18} className="text-green-600" />
              4.8 Rating
            </span>

            <span>50K+ Downloads</span>

            <span>Free</span>
          </div>
        </motion.div>

        {/* Right Mobile Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="relative">
            {/* Shadow */}
            <div className="absolute inset-0 bg-gray-300 blur-3xl opacity-20 rounded-full"></div>

            <div className="bg-white rounded-[34px] overflow-hidden">
              <img
                src="/images/worker-app-screen.png"
                alt="ATW Worker App"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
