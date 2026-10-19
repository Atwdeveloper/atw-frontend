import { motion } from "framer-motion";
import { Check, ShieldCheck } from "lucide-react";

const plans = [
  {
    id: "starter",
    label: "Starter Factories",
    percent: "10%",
    wageBill: "Below ₹5 Lakhs",
    btnText: "Get Started",
    color: "orange",
    features: [
      "Recruitment & Deployment",
      "Biometric Attendance (IoT)",
      "Payroll + PF/ESI Auto-calc",
      "Digital Payouts (UPI/RTGS)",
      "Compliance Dashboard",
    ],
  },
  {
    id: "growth",
    label: "Growth Factories",
    percent: "8%",
    wageBill: "₹5L — ₹20 Lakhs",
    btnText: "Contact Sales",
    color: "purple",
    featured: true,
    features: [
      "Everything in Starter",
      "Priority Worker Matching",
      "Advanced Analytics",
      "Dedicated Account Manager",
      "24/7 Support",
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    percent: "5%",
    wageBill: "Above ₹20 Lakhs",
    btnText: "Contact Sales",
    color: "green",
    features: [
      "Everything in Growth",
      "Custom Integrations",
      "On-site ATW Supervisor",
      "Bulk Recruitment Drive",
      "SLA Guarantee",
    ],
  },
];

const colorMap = {
  orange: {
    percent: "text-orange-600",
    check: "bg-orange-100 text-orange-600",
    btn: "bg-orange-500 text-white border-orange-500 hover:bg-orange-600",
  },
  purple: {
    percent: "text-purple-600",
    check: "bg-purple-100 text-purple-600",
    btn: "bg-purple-500 text-white border-purple-500 hover:bg-purple-600",
  },
  green: {
    percent: "text-emerald-600",
    check: "bg-emerald-100 text-emerald-600",
    btn: "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600",
  },
};
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PricingSection() {
  return (
    <section className="bg-white min-h-screen py-16 px-4" id="pricing">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 border border-orange-500 text-orange-500 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
        >
          <ShieldCheck size={14} />
          Factory Pricing — No Hidden Charges
        </motion.div>

        <motion.h2
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-900 text-4xl md:text-5xl font-bold mb-4 leading-tight"
        >
          Wage-Bill Linked Pricing
        </motion.h2>

        <motion.p
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-base max-w-lg mx-auto leading-relaxed"
        >
          We only charge factories — never workers. The more workers you manage
          through ATW, the less you pay per rupee.
        </motion.p>
      </div>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {plans.map((plan) => {
          const colors = colorMap[plan.color];

          return (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl p-6 flex flex-col shadow-lg hover:shadow-2xl transition-all duration-300 ${
                plan.featured
                  ? "bg-white featured-border"
                  : "bg-white border border-gray-200"
              }`}
              style={
                plan.featured
                  ? {
                      border: "1px solid transparent",
                      backgroundClip: "padding-box",
                      backgroundImage: "none",
                      position: "relative",
                    }
                  : {}
              }
            >
              {/* Rainbow border for featured card */}
              {plan.featured && (
                <div
                  className="absolute inset-0 rounded-2xl -z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4, #10b981)",
                    padding: "1px",
                    borderRadius: "16px",
                  }}
                >
                  <div className="w-full h-full bg-white rounded-2xl" />
                </div>
              )}

              {/* Most Popular Badge */}
              {plan.featured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[11px] font-semibold tracking-widest uppercase px-4 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Label */}
              <p className="text-gray-500 text-sm mb-1">{plan.label}</p>

              {/* Percent */}
              <p
                className={`text-6xl font-extrabold leading-none mb-1 ${colors.percent}`}
              >
                {plan.percent}
              </p>
              <p className="text-gray-600 text-xs mb-5">Service Fee</p>

              {/* Wage Bill */}
              <p className="text-gray-400 text-xs mb-1">Monthly Wage Bill</p>
              <p className="text-gray-900 text-xl font-bold mb-5">
                {plan.wageBill}
              </p>

              <hr className="border-gray-200 mb-5" />

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 text-gray-700 text-sm"
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${colors.check}`}
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3 rounded-lg border text-sm font-semibold transition-colors duration-200 ${colors.btn}`}
              >
                {plan.btnText}
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
