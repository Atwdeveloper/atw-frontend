import { motion } from "framer-motion";
import { Phone, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  const highlights = [
    "Smart Payroll & PF/ESI Automation",
    "Daily Wallet-Based Worker Payments",
    "Multi-Company Workforce Management",
  ];

  return (
    <section className="py-16 px-6 bg-white" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-14">
          {/* LEFT - IMAGE */}
          <motion.div
            className="lg:w-[45%] relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* MAIN IMAGE */}
            <div className="rounded-2xl w-full">
              <img
                src="/images/about-us-img.png"
                alt="Anytime Work Team"
                className="w-full h-full object-cover"
              />
            </div>

            {/* FLOATING BADGE - RECOGNISED STARTUP */}
            <motion.div
              className="w-[370px] absolute -bottom-6 -right-6 bg-gradient-to-br from-[#1a6fc4] to-[#1a2a4a] text-white rounded-2xl px-6 py-5 shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="text-2xl font-bold leading-tight">
                Recognised Startup
              </p>
              <p className="text-xs text-blue-200 mt-1 flex items-center gap-1">
                Made with <span className="text-red-400">♥</span> in Jaipur
              </p>

              {/* BADGES ROW */}
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/20">
                <img
                  src="/images/worker/Group182.png"
                  alt="PCI DSS Compliant"
                  className="h-[72px] w-auto object-contain bg-white rounded-lg p-1"
                />
                <img
                  src="/images/worker/Group181.png"
                  alt="ISO 27001 Certified"
                  className="h-[72px] w-auto object-contain bg-white rounded-lg p-1"
                />
              </div>
            </motion.div>

            {/* FLOATING STAT - TOP LEFT */}
            <motion.div
              className="absolute top-24 -left-14 bg-[#FFB703] text-white rounded-xl px-4 py-3 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-2xl font-bold leading-none">1200+</p>
              <p className="text-xs font-medium mt-0.5 text-orange-100">
                Registered Workers
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT - CONTENT */}
          <motion.div
            className="lg:w-[55%] mt-8 lg:mt-0"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* LABEL */}
            <p className="text-[#FFB703] font-semibold text-sm uppercase tracking-widest mb-3">
              About Us
            </p>

            {/* HEADING */}
            <h2 className="text-4xl font-bold text-[#1a2a4a] leading-tight mb-5">
              Blue-collar workers ke liye{" "}
              <span className="text-[#3885C9]">India ka smartest</span>{" "}
              workforce platform
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Anytime Work ek digital platform hai jo blue-collar workers aur
              companies ko ek jagah connect karta hai. Hamara mission hai ki har
              mazdoor ko roz kaam mile, roz paisa mile — bina kisi thekedaar ke
              chakkar kaate. Companies ke liye we provide smart hiring,
              attendance tracking, automated payroll aur PF/ESI compliance — sab
              ek hi platform par.
            </p>

            {/* HIGHLIGHTS BOX */}
            <div className="bg-[#EBF5FF] rounded-2xl px-6 py-5 mb-7">
              <div className="flex flex-col gap-3">
                {highlights.map((point, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2
                      size={20}
                      className="text-[#FFB703] flex-shrink-0"
                      fill="#FFF3DC"
                    />
                    <span className="text-sm font-semibold text-[#1a2a4a]">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* STATS ROW */}
            <div className="flex items-center gap-6 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1a2a4a]">1500+</p>
                <p className="text-xs text-gray-400 mt-0.5">Jobs Posted</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1a2a4a]">15+</p>
                <p className="text-xs text-gray-400 mt-0.5">Industries</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#1a2a4a]">100%</p>
                <p className="text-xs text-gray-400 mt-0.5">Compliance</p>
              </div>
            </div>

            {/* CTA ROW */}
            <div className="flex flex-wrap items-center gap-6">
              {/* BUTTON */}

              {/* CALL */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#FFB703] flex items-center justify-center">
                  <Phone size={16} className="text-[#FFB703]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Call support 24x7</p>
                  <p className="text-sm font-bold text-[#1a2a4a]">
                    +91 98295 59922
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
