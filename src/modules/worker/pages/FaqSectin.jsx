import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Do you offer a free, no obligation quotation?",
    answer:
      "Yes! We provide completely free quotations with no obligations. Simply register on our platform and our team will get in touch with you within 24 hours to discuss your requirements.",
  },
  {
    question: "What services do you offer?",
    answer:
      "We offer end-to-end blue-collar workforce management including job posting, worker hiring, attendance tracking, automated payroll with PF & ESI compliance, wallet-based daily payments, and monthly payslip generation.",
  },
  {
    question: "What types of projects do you specialize in?",
    answer:
      "We specialize in Construction, Manufacturing, Warehouse, Logistics & Delivery, Security Services, and Housekeeping industries. Our platform is designed specifically for blue-collar workforce needs across all these sectors.",
  },
  {
    question: "How do I start a project with your company?",
    answer:
      "Getting started is simple! Register your company on our platform, post your job requirements, and we'll match you with the right workers instantly. Our team will guide you through the entire onboarding process.",
  },
  {
    question: "How are worker payments handled?",
    answer:
      "Workers receive their daily earnings directly in their digital wallet after PF & ESI deductions. They can withdraw anytime via UPI or bank transfer. Monthly payslips are auto-generated on the 1st of every month.",
  },
  {
    question: "Is PF and ESI compliance handled automatically?",
    answer:
      "Yes! Our smart payroll system automatically calculates PF (12%), ESI (0.75%), TDS, and other statutory deductions based on worker designation. All compliance is handled by the platform — no manual work needed.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(2);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#EBF5FF] md:py-16 md:px-6 p-5" id="faq">
      <div className="max-w-6xl mx-auto">
        {/* HEADING */}
        <div className="text-center md:mb-[5rem] mb-5">
          <p className="text-[#FFB703] font-semibold text-sm uppercase tracking-widest mb-3">
            FAQs
          </p>
          <h2 className="md:text-[56px] text-2xl font-bold text-[#12223b] mb-4">
            Got questions? we've got answers
          </h2>
          <p className="text-[#667282] md:text-base text-sm max-w-xl mx-auto">
            We specialize in blue-collar workforce management including
            construction, logistics, manufacturing, and warehouse industries.
          </p>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* LEFT - IMAGES GRID */}
          <div className="lg:w-[45%] relative">
            <div>
              <img src="/images/agent1.webp" alt="agent" />
            </div>
          </div>

          {/* RIGHT - ACCORDION */}
          <div className="lg:w-[55%] flex flex-col gap-1">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="border-b border-gray-200 py-4 cursor-pointer"
                  onClick={() => handleToggle(index)}
                >
                  {/* QUESTION ROW */}
                  <div className="flex items-center justify-between gap-4">
                    <h3
                      className={`md:text-xl text-base font-semibold transition-colors duration-200 ${
                        isOpen ? "text-[#FFB703]" : "text-[#1a2a4a]"
                      }`}
                    >
                      {faq.question}
                    </h3>

                    {/* ARROW ICON */}
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M7 4l6 6-6 6"
                          stroke={isOpen ? "#FFB703" : "#1a2a4a"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* ANSWER - ANIMATED */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-gray-500 mt-3 leading-relaxed pr-6">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
