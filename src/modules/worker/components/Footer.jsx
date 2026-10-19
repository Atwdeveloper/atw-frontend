import React from "react";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#070606] text-white pt-12 pb-6">
      <section className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl lg:text-[36px] font-bold mb-8">
            Download the Anytimework app today!
          </h2>
          <div className="flex flex-wrap justify-center gap-4 ">
            <button className="">
              <img
                src="/images/worker/Google-app-store.png"
                alt="Google Play"
                className="w-full h-full"
              />
            </button>
            <button className="">
              <img
                src="/images/worker/Apple-app-store.png"
                alt="Google Play"
                className="w-full h-full"
              />
            </button>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-2">
          <img
            src="/images/worker/Anytime-Logo-Black.png"
            alt="Anytimework Logo"
            className="w-auto h-auto place-self-center md:place-self-auto"
          />

          <nav className="flex flex-wrap gap-6 items-center md:justify-end">
            <a href=" " className="hover:text-gray-300">
              Privacy Policy
            </a>
            <a href=" " className="hover:text-gray-300">
              About Us
            </a>
            <a href=" " className="hover:text-gray-300">
              FAQs
            </a>
            <a href=" " className="hover:text-gray-300">
              Blog
            </a>
            <a href=" " className="hover:text-gray-300">
              Contact Us
            </a>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-800">
          <div className="flex gap-4 mb-4 md:mb-0">
            <a href=" " className="hover:text-gray-300">
              <FacebookIcon className="w-8 h-8" />
            </a>
            <a href=" " className="hover:text-gray-300">
              <LinkedinIcon className="w-8 h-8" />
            </a>
            <a href=" " className="hover:text-gray-300">
              <InstagramIcon className="w-8 h-8" />
            </a>
          </div>

          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Anytimework, Ltd. All Rights Reserved{" "}
            {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
