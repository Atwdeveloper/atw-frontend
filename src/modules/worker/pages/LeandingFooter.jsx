// import {
//   MapPin,
//   Mail,
//   Phone,
//   Facebook,
//   Instagram,
//   Linkedin,
// } from "lucide-react";
// import { useAuthContext } from "../../../common/context/AuthContext";
// const Footer = () => {
//   const { settings } = useAuthContext();
//   return (
//     <footer className="bg-gradient-to-r from-[#07152f] to-[#0a1a3d] text-white">
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="flex flex-col lg:flex-row justify-between gap-10">
//           {/* Left Section */}
//           <div className="max-w-md">
//             <img
//               src={settings?.site_logo_url || "/images/worker/Anytime-Logo.png"}
//               alt={settings?.app_name || "ATW Logo"}
//               className="h-16 w-auto mb-4 rounded bg-white p-2"
//             />

//             <h3 className="text-3xl font-bold mb-4">
//               Connecting Workers & Employers
//             </h3>

//             <p className="text-gray-300 text-sm leading-7 mb-6">
//               {settings?.app_tagline}
//             </p>

//             <div className="space-y-3 text-sm">
//               <div className="flex items-center gap-3">
//                 <MapPin size={18} className="text-green-400" />

//                 <span>{settings?.office_address}</span>
//               </div>

//               <div className="flex items-center gap-3">
//                 <Mail size={18} className="text-green-400" />

//                 <span>{settings?.support_email}</span>
//               </div>

//               <div className="flex items-center gap-3">
//                 <Phone size={18} className="text-green-400" />
//                 <span>{settings?.whatsapp_number}</span>
//               </div>
//             </div>
//           </div>

//           {/* Right Section */}
//           <div className="flex flex-col items-center lg:items-end">
//             <h3 className="text-2xl font-bold mb-6">
//               Download the Anytimework App
//             </h3>

//             <div className="flex flex-wrap gap-4 my-10">
//               {/* App Store */}
//               <a
//                 href="#"
//                 className="inline-flex items-center gap-3 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-md hover:shadow-xl transition"
//               >
//                 <svg
//                   className="w-8 h-8 text-black"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                 >
//                   <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.22 7.13-.57 1.5-1.31 2.99-2.27 4.08zm-5.85-15.1c.07-1.74 1.48-3.27 3.2-3.4.29 1.96-1.59 3.76-3.2 3.4z" />
//                 </svg>

//                 <div>
//                   <p className="text-[10px] text-gray-500">Download on the</p>
//                   <p className="font-bold text-black">App Store</p>
//                 </div>
//               </a>

//               {/* Google Play */}
//               <a
//                 href="#"
//                 className="inline-flex items-center gap-3 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-md hover:shadow-xl transition"
//               >
//                 <svg
//                   className="w-8 h-8 text-black"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                 >
//                   <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
//                 </svg>

//                 <div>
//                   <p className="text-[10px] text-gray-500">GET IT ON</p>
//                   <p className="font-bold text-black">Google Play</p>
//                 </div>
//               </a>
//             </div>
//             <div className="flex gap-4">
//               <a
//                 href={settings?.facebook_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
//               >
//                 <Facebook size={18} />
//               </a>

//               <a
//                 href={settings?.instagram_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
//               >
//                 <Instagram size={18} />
//               </a>

//               <a
//                 href={settings?.linkedin_url}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
//               >
//                 <Linkedin size={18} />
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Bottom */}
//         <div className="border-t border-white/10 mt-10 pt-5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
//           <p>© {new Date().getFullYear()} Anytimework. All Rights Reserved.</p>

//           <p className="mt-3 md:mt-0">
//             Developed by{" "}
//             <a
//               href="https://www.logicspice.com/"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-white font-medium hover:text-green-400 transition-colors"
//             >
//               LogicSpice Consultancy Pvt. Ltd.
//             </a>
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useAuthContext } from "../../../common/context/AuthContext";

const Footer = () => {
  const { settings } = useAuthContext();
  return (
    <footer className="bg-gradient-to-r from-[#07152f] to-[#0a1a3d] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          {/* Left Section */}
          <div className="max-w-md bor">
            {/* <img
              src="/images/worker/Anytime-Logo.png"
              alt="ATW Logo"
              className="h-16 w-auto mb-4 p-2"
            /> */}

            <h3 className="text-xl font-semibold mb-2">
              ANYTIME WORK
            </h3>

            <p className="text-gray-300 text-sm leading-7 mb-6">
              {settings?.app_tagline}
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-green-400" />
                <span>{settings?.office_address}</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-green-400" />
                <span>{settings?.support_email}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-green-400" />
                <span>{settings?.support_phone}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl font-semibold align-center">Support & Legal</h3>
            <ul className="py-6 text-sm leading-7 space-y-2">
                <li>
                  <Link to="/privacy" className="hover:text-green-400 transition-colors duration-300">
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link to="/terms" className="hover:text-green-400 transition-colors duration-300">
                    Terms & Conditions
                  </Link>
                </li>

                <li>
                  <Link to="/cancellation-policy" className="hover:text-green-400 transition-colors duration-300">
                    Cancellation Policy
                  </Link>
                </li>

                <li>
                  <Link to="/refund-policy" className="hover:text-green-400 transition-colors duration-300">
                    Refund Policy
                  </Link>
                </li>
              </ul>

          </div>

          {/* Right Section */}
          <div className="flex flex-col items-center lg:items-start">
            <h3 className="text-xl font-semibold mb-2">
              Download the AnyTime Work today!
            </h3>

            <div className="flex flex-wrap gap-4 my-6">
              {/* App Store */}
              <a
                href={settings?.app_store_url}
                className="inline-flex items-center gap-3 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-md hover:shadow-4xl transition"
              >
                <svg
                  className="w-8 h-8 text-black "
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
                href={settings?.play_store_url}
                className="inline-flex items-center gap-0 bg-white border border-gray-200 px-5 py-3 rounded-2xl shadow-md hover:shadow-xl transition"
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
            <div className="flex gap-4">
              <a
                href={settings?.facebook_url}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              >
                <Facebook size={18} />
              </a>

              <a
                href={settings?.instagram_url}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              >
                <Instagram size={18} />
              </a>

              <a
                href={settings?.linkedin_url}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Anytime Work. All Rights Reserved.</p>

          <p className="mt-3 md:mt-0">
            Developed by{" "}
            <a href="https://www.logicspice.com"> <span className="font-sm hover:text-green-400 transition-colors duration-600">
              LogicSpice Consultancy Pvt. Ltd.
            </span> </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
