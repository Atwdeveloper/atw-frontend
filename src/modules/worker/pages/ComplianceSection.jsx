import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  BadgeCheck,
  BookOpen,
  FileText,
  Shield,
} from "lucide-react";

const certifications = [
  {
    icon: ShieldCheck,
    title: "Startup India",
    subtitle: "DPIIT Recognized",
    badge: "Verified",
    color: "orange",
  },
  {
    icon: BadgeCheck,
    title: "ISO Certified",
    subtitle: "ISO 9001:2015",
    badge: "Quality",
    color: "blue",
  },
  {
    icon: BookOpen,
    title: "Skill India",
    subtitle: "NSDC Partner",
    badge: "Training",
    color: "green",
  },
  {
    icon: FileText,
    title: "GeM Registered",
    subtitle: "Govt. e-Marketplace",
    badge: "Govt. Supplier",
    color: "purple",
  },
  {
    icon: Shield,
    title: "Labor Law Compliant",
    subtitle: "EPFO • ESIC • Wage Code",
    badge: "100% Legal",
    color: "red",
  },
];

const colors = {
  orange: {
    icon: "bg-orange-100 text-orange-600",
    border: "border-orange-200",
    badge: "bg-orange-50 text-orange-600",
  },
  blue: {
    icon: "bg-blue-100 text-blue-600",
    border: "border-blue-200",
    badge: "bg-blue-50 text-blue-600",
  },
  green: {
    icon: "bg-green-100 text-green-600",
    border: "border-green-200",
    badge: "bg-green-50 text-green-600",
  },
  purple: {
    icon: "bg-purple-100 text-purple-600",
    border: "border-purple-200",
    badge: "bg-purple-50 text-purple-600",
  },
  red: {
    icon: "bg-red-100 text-red-600",
    border: "border-red-200",
    badge: "bg-red-50 text-red-600",
  },
};

export default function ComplianceSection() {
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-amber-500 font-semibold uppercase tracking-widest text-sm">
            Trust & Compliance
          </span>

          <h2 className="mt-4 text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Government Recognized.
            <br />
            Industry Certified.
          </h2>

          <p className="max-w-3xl mx-auto mt-6 text-gray-600 text-lg">
            ATW is fully compliant with Indian labor laws and recognized by
            leading government initiatives.
          </p>
        </motion.div>

        {/* Certification Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {certifications.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className={`bg-white border ${colors[item.color].border}
                  rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${colors[item.color].icon}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="font-bold text-gray-900 text-center">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 text-center mt-2">
                  {item.subtitle}
                </p>

                <div
                  className={`mt-5 rounded-lg py-2 text-center text-sm font-semibold ${colors[item.color].badge}`}
                >
                  {item.badge}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Compliance Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 bg-gray-50 border border-gray-200 rounded-3xl p-8 md:p-10 shadow-lg"
        >
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div>
              <h3 className="text-4xl font-bold text-orange-500 mb-4">EPFO</h3>

              <p className="text-gray-600">
                Provident Fund auto-deduction and filing handled end-to-end.
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-blue-500 mb-4">ESIC</h3>

              <p className="text-gray-600">
                Employee State Insurance registration and monthly returns.
              </p>
            </div>

            <div>
              <h3 className="text-4xl font-bold text-amber-500 mb-4">
                Wage Code 2019
              </h3>

              <p className="text-gray-600">
                Full compliance with new wage code regulations and minimum wage
                rules.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
